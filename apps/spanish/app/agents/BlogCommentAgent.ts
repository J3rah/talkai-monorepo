import { BaseAgent, AgentConfig } from './BaseAgent';
import composio from '@/lib/composio';
import openai from '@/lib/openai';

/**
 * BlogCommentAgent periodically searches for new blog posts in the AI-therapy / mental-health niche
 * and leaves a helpful, brand-aligned comment.
 *
 * It uses:
 *  • Google Programmable Search via Composio (google_adk.search)
 *  • Site-specific comment actions via Composio (reddit.create_comment, medium.create_comment, etc.)
 *  • OpenAI for relevance classification and comment generation
 */
export class BlogCommentAgent extends BaseAgent {
  private static BRAND = {
    name: 'TalkAI',
    url: 'https://talkai.im/about',
    mission:
      'offer empathic, voice-first AI therapy that is available 24/7 to help users manage anxiety and improve wellbeing',
  } as const;

  constructor(config: AgentConfig) {
    super(config);
  }

  /**
   * Main execution cycle – runs every this.config.interval ms
   */
  protected async execute(): Promise<void> {
    try {
      await this.logActivity('BlogCommentAgent cycle started');

      // 1. Discover potential articles
      const candidates = await this.fetchCandidates();
      if (!candidates.length) {
        await this.logActivity('No candidate articles found');
        return;
      }

      // 2. Filter & comment
      for (const article of candidates) {
        try {
          const relevant = await this.isRelevant(article);
          if (!relevant) continue;

          const comment = await this.draftComment(article);
          await this.publishComment(article, comment);
          await this.logActivity('Comment posted', { url: article.url });
        } catch (err) {
          await this.handleError(err);
        }
      }

      await this.logActivity('BlogCommentAgent cycle completed');
    } catch (error) {
      await this.handleError(error);
    }
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────────────────────────

  private async fetchCandidates(): Promise<Article[]> {
    const query = '"AI therapy" OR "empathic AI" | site:medium.com OR site:reddit.com';

    try {
      // NOTE: We rely on Composio's google_adk.search tool. The exact tool name / params
      // may change – update accordingly.
      const response: any = await (composio as any).invoke?.('google_adk.search', {
        query,
        num: 10,
      });

      const items = response?.items ?? [];
      return items.map((r: any) => ({
        title: r.title,
        url: r.link,
        provider: this.detectProvider(r.link),
        postId: this.extractPostId(r.link),
      }));
    } catch (error) {
      // On failure (e.g., tool not authorised) just return empty array
      await this.logActivity('fetchCandidates failed', { error: (error as Error).message });
      return [];
    }
  }

  private async isRelevant(article: Article): Promise<boolean> {
    const prompt = `Blog title: ${article.title}\nURL: ${article.url}\nIs this closely related to ${BlogCommentAgent.BRAND.mission}? Reply with yes or no.`;

    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a strict classifier returning only "yes" or "no".' },
        { role: 'user', content: prompt },
      ],
    });

    return /yes/i.test(res.choices?.[0]?.message?.content ?? '');
  }

  private async draftComment(article: Article): Promise<string> {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are ${BlogCommentAgent.BRAND.name}, an empathic AI therapist. Write concise, friendly, helpful comments (max 120 words). End with an invite to learn more at ${BlogCommentAgent.BRAND.url}.`,
        },
        { role: 'user', content: `Draft a comment for the post titled "${article.title}" at ${article.url}.` },
      ],
    });

    return res.choices?.[0]?.message?.content ?? '';
  }

  private async publishComment(article: Article, text: string): Promise<void> {
    const toolMap: Record<string, string> = {
      reddit: 'reddit.create_comment',
      medium: 'medium.create_comment',
      wordpress: 'wordpress.create_comment',
      hn: 'hn.create_comment',
    };

    const toolName = toolMap[article.provider];
    if (!toolName) {
      // Unsupported – log and skip
      await this.logActivity('Unsupported provider', { provider: article.provider, url: article.url });
      return;
    }

    try {
      await (composio as any).invoke?.(toolName, {
        post_id: article.postId,
        text,
      });
    } catch (error) {
      // If posting fails push to a review queue (not implemented yet)
      await this.handleError(error);
    }
  }

  // Detect provider based on URL host
  private detectProvider(url: string): Provider {
    if (url.includes('reddit.com')) return 'reddit';
    if (url.includes('medium.com')) return 'medium';
    if (url.includes('wordpress.com')) return 'wordpress';
    if (url.includes('news.ycombinator.com')) return 'hn';
    return 'unknown';
  }

  // Extract post ID – simplistic approach, refine per provider
  private extractPostId(url: string): string {
    // For Reddit -> /comments/{id}/
    const redditMatch = url.match(/comments\/(\w+)/);
    if (redditMatch) return redditMatch[1];

    // Medium slug as ID
    const mediumMatch = url.match(/medium\.com\/.+?\/([a-z0-9\-]+)$/i);
    if (mediumMatch) return mediumMatch[1];

    // Fallback to full URL
    return url;
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────

interface Article {
  title: string;
  url: string;
  provider: Provider;
  postId: string;
}

type Provider = 'reddit' | 'medium' | 'wordpress' | 'hn' | 'unknown'; 
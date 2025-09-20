const fs = require('fs');
const path = require('path');

// Function to fix text contrast in a file
function fixTextContrast(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Pattern 1: Fix cards with light backgrounds that need dark text
    const lightBackgroundPatterns = [
      {
        // bg-gradient-to-r from-green-50 to-blue-50
        regex: /(<Card className="bg-gradient-to-r from-green-50 to-blue-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-blue-50 to-green-50
        regex: /(<Card className="bg-gradient-to-r from-blue-50 to-green-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-blue-50 to-purple-50
        regex: /(<Card className="bg-gradient-to-r from-blue-50 to-purple-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-purple-50 to-pink-50
        regex: /(<Card className="bg-gradient-to-r from-purple-50 to-pink-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-yellow-50 to-orange-50
        regex: /(<Card className="bg-gradient-to-r from-yellow-50 to-orange-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-indigo-50 to-purple-50
        regex: /(<Card className="bg-gradient-to-r from-indigo-50 to-purple-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-cyan-50 to-blue-50
        regex: /(<Card className="bg-gradient-to-r from-cyan-50 to-blue-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-lime-50 to-green-50
        regex: /(<Card className="bg-gradient-to-r from-lime-50 to-green-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-rose-50 to-pink-50
        regex: /(<Card className="bg-gradient-to-r from-rose-50 to-pink-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-pink-50 to-purple-50
        regex: /(<Card className="bg-gradient-to-r from-pink-50 to-purple-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-amber-50 to-orange-50
        regex: /(<Card className="bg-gradient-to-r from-amber-50 to-orange-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-teal-50 to-blue-50
        regex: /(<Card className="bg-gradient-to-r from-teal-50 to-blue-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-emerald-50 to-teal-50
        regex: /(<Card className="bg-gradient-to-r from-emerald-50 to-teal-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-violet-50 to-pink-50
        regex: /(<Card className="bg-gradient-to-r from-violet-50 to-pink-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      },
      {
        // bg-gradient-to-r from-orange-50 to-red-50
        regex: /(<Card className="bg-gradient-to-r from-orange-50 to-red-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<h3[^>]*>)([^<]+)(<\/h3>)/g,
        replacement: '$1$2$3 text-slate-800$4'
      }
    ];

    // Apply all patterns
    lightBackgroundPatterns.forEach(pattern => {
      if (pattern.regex.test(content)) {
        content = content.replace(pattern.regex, pattern.replacement);
        modified = true;
      }
    });

    // Pattern 2: Fix paragraph text in light background cards
    const paragraphPatterns = [
      {
        // bg-gradient-to-r from-green-50 to-blue-50
        regex: /(<Card className="bg-gradient-to-r from-green-50 to-blue-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-blue-50 to-green-50
        regex: /(<Card className="bg-gradient-to-r from-blue-50 to-green-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-blue-50 to-purple-50
        regex: /(<Card className="bg-gradient-to-r from-blue-50 to-purple-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-purple-50 to-pink-50
        regex: /(<Card className="bg-gradient-to-r from-purple-50 to-pink-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-yellow-50 to-orange-50
        regex: /(<Card className="bg-gradient-to-r from-yellow-50 to-orange-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-indigo-50 to-purple-50
        regex: /(<Card className="bg-gradient-to-r from-indigo-50 to-purple-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-cyan-50 to-blue-50
        regex: /(<Card className="bg-gradient-to-r from-cyan-50 to-blue-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-lime-50 to-green-50
        regex: /(<Card className="bg-gradient-to-r from-lime-50 to-green-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-rose-50 to-pink-50
        regex: /(<Card className="bg-gradient-to-r from-rose-50 to-pink-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-pink-50 to-purple-50
        regex: /(<Card className="bg-gradient-to-r from-pink-50 to-purple-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-amber-50 to-orange-50
        regex: /(<Card className="bg-gradient-to-r from-amber-50 to-orange-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-teal-50 to-blue-50
        regex: /(<Card className="bg-gradient-to-r from-teal-50 to-blue-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-emerald-50 to-teal-50
        regex: /(<Card className="bg-gradient-to-r from-emerald-50 to-teal-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-violet-50 to-pink-50
        regex: /(<Card className="bg-gradient-to-r from-violet-50 to-pink-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      },
      {
        // bg-gradient-to-r from-orange-50 to-red-50
        regex: /(<Card className="bg-gradient-to-r from-orange-50 to-red-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<p[^>]*>)([^<]+)(<\/p>)/g,
        replacement: '$1$2$3 text-slate-700$4'
      }
    ];

    // Apply all paragraph patterns
    paragraphPatterns.forEach(pattern => {
      if (pattern.regex.test(content)) {
        content = content.replace(pattern.regex, pattern.replacement);
        modified = true;
      }
    });

    // Pattern 3: Fix list text in light background cards
    const listPatterns = [
      {
        // bg-gradient-to-r from-green-50 to-blue-50
        regex: /(<Card className="bg-gradient-to-r from-green-50 to-blue-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-blue-50 to-green-50
        regex: /(<Card className="bg-gradient-to-r from-blue-50 to-green-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-blue-50 to-purple-50
        regex: /(<Card className="bg-gradient-to-r from-blue-50 to-purple-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-purple-50 to-pink-50
        regex: /(<Card className="bg-gradient-to-r from-purple-50 to-pink-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-yellow-50 to-orange-50
        regex: /(<Card className="bg-gradient-to-r from-yellow-50 to-orange-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-indigo-50 to-purple-50
        regex: /(<Card className="bg-gradient-to-r from-indigo-50 to-purple-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-cyan-50 to-blue-50
        regex: /(<Card className="bg-gradient-to-r from-cyan-50 to-blue-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-lime-50 to-green-50
        regex: /(<Card className="bg-gradient-to-r from-lime-50 to-green-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-rose-50 to-pink-50
        regex: /(<Card className="bg-gradient-to-r from-rose-50 to-pink-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-pink-50 to-purple-50
        regex: /(<Card className="bg-gradient-to-r from-pink-50 to-purple-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-amber-50 to-orange-50
        regex: /(<Card className="bg-gradient-to-r from-amber-50 to-orange-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-teal-50 to-blue-50
        regex: /(<Card className="bg-gradient-to-r from-teal-50 to-blue-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-emerald-50 to-teal-50
        regex: /(<Card className="bg-gradient-to-r from-emerald-50 to-teal-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-violet-50 to-pink-50
        regex: /(<Card className="bg-gradient-to-r from-violet-50 to-pink-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-orange-50 to-red-50
        regex: /(<Card className="bg-gradient-to-r from-orange-50 to-red-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      }
    ];

    // Apply all list patterns
    listPatterns.forEach(pattern => {
      if (pattern.regex.test(content)) {
        content = content.replace(pattern.regex, pattern.replacement);
        modified = true;
      }
    });

    // Pattern 4: Fix ordered list text in light background cards
    const orderedListPatterns = [
      {
        // bg-gradient-to-r from-green-50 to-blue-50
        regex: /(<Card className="bg-gradient-to-r from-green-50 to-blue-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-blue-50 to-green-50
        regex: /(<Card className="bg-gradient-to-r from-blue-50 to-green-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-blue-50 to-purple-50
        regex: /(<Card className="bg-gradient-to-r from-blue-50 to-purple-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-purple-50 to-pink-50
        regex: /(<Card className="bg-gradient-to-r from-purple-50 to-pink-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-yellow-50 to-orange-50
        regex: /(<Card className="bg-gradient-to-r from-yellow-50 to-orange-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-indigo-50 to-purple-50
        regex: /(<Card className="bg-gradient-to-r from-indigo-50 to-purple-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-cyan-50 to-blue-50
        regex: /(<Card className="bg-gradient-to-r from-cyan-50 to-blue-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-lime-50 to-green-50
        regex: /(<Card className="bg-gradient-to-r from-lime-50 to-green-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-rose-50 to-pink-50
        regex: /(<Card className="bg-gradient-to-r from-rose-50 to-pink-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-pink-50 to-purple-50
        regex: /(<Card className="bg-gradient-to-r from-pink-50 to-purple-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-amber-50 to-orange-50
        regex: /(<Card className="bg-gradient-to-r from-amber-50 to-orange-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-teal-50 to-blue-50
        regex: /(<Card className="bg-gradient-to-r from-teal-50 to-blue-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-emerald-50 to-teal-50
        regex: /(<Card className="bg-gradient-to-r from-emerald-50 to-teal-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-violet-50 to-pink-50
        regex: /(<Card className="bg-gradient-to-r from-violet-50 to-pink-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      },
      {
        // bg-gradient-to-r from-orange-50 to-red-50
        regex: /(<Card className="bg-gradient-to-r from-orange-50 to-red-50[^"]*"[^>]*>[\s\S]*?<CardContent[^>]*>[\s\S]*?)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/g,
        replacement: '$1$2 text-slate-700$3$4'
      }
    ];

    // Apply all ordered list patterns
    orderedListPatterns.forEach(pattern => {
      if (pattern.regex.test(content)) {
        content = content.replace(pattern.regex, pattern.replacement);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find all blog files
function findBlogFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findBlogFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
function main() {
  const blogDir = path.join(__dirname, '..', 'app', 'blog');
  
  if (!fs.existsSync(blogDir)) {
    console.error('❌ Blog directory not found:', blogDir);
    return;
  }
  
  console.log('🔍 Scanning for blog files...');
  const blogFiles = findBlogFiles(blogDir);
  console.log(`📁 Found ${blogFiles.length} blog files`);
  
  let fixedCount = 0;
  let totalCount = 0;
  
  for (const file of blogFiles) {
    totalCount++;
    if (fixTextContrast(file)) {
      fixedCount++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`Total files processed: ${totalCount}`);
  console.log(`Files fixed: ${fixedCount}`);
  console.log(`Files unchanged: ${totalCount - fixedCount}`);
  
  if (fixedCount > 0) {
    console.log('\n🎉 Text contrast issues have been fixed!');
    console.log('The blog articles should now have proper text readability.');
  } else {
    console.log('\n✨ No text contrast issues were found.');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { fixTextContrast, findBlogFiles };

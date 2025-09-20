'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { useVoice } from '@humeai/voice-react';
import { VoiceProvider } from '@/components/VoiceProvider';
import { getClientAccessToken } from '@/utils/getClientAccessToken';

const suggestedQuestions = [
  "What is TalkAI?",
  "How does pricing work?",
  "What are EVI's ethical principles?",
  "Is my data private?",
];

interface Message {
  from: 'user' | 'bot';
  text: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionError extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  start: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

function HelpChatContent({ auth }: { auth: { type: 'accessToken'; value: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { connect, disconnect, status } = useVoice();
  const [isSessionActive, setIsSessionActive] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize browser APIs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Auto-suggest questions on open
  useEffect(() => {
    if (isOpen) {
      setMessages([]); // Clear messages when opening
    }
  }, [isOpen]);

  useEffect(() => {
    // Check sessionActive flag in localStorage
    const checkSession = () => {
      const sessionActive = localStorage.getItem('sessionActive') === 'true';
      // Also check if we're on a session page (additional safety check)
      const isOnSessionPage = window.location.pathname.includes('/session/') || 
                             window.location.pathname.includes('/chat/') ||
                             window.location.pathname.includes('/rechat/');
      setIsSessionActive(sessionActive || isOnSessionPage);
    };
    
    checkSession();
    
    // Listen for localStorage changes
    window.addEventListener('storage', checkSession);
    
    // Listen for URL changes (for single-page app navigation)
    window.addEventListener('popstate', checkSession);
    
    // Also check periodically in case localStorage changes aren't caught
    const interval = setInterval(checkSession, 1000);
    
    return () => {
      window.removeEventListener('storage', checkSession);
      window.removeEventListener('popstate', checkSession);
      clearInterval(interval);
    };
  }, []);

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  // Setup Voice Recognition
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const setup = async () => {
      if (isConnecting) return;
      setIsConnecting(true);
      setConnectionError(null);

      try {
        console.log('🔌 Connecting to Hume Voice...');
        await connect({ auth });
        console.log('✅ Connected to Hume Voice');
        setIsConnecting(false);
      } catch (error) {
        console.error('❌ Connection error:', error);
        setConnectionError(error instanceof Error ? error.message : 'Connection failed');
        setIsConnecting(false);
      }
    };

    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        sendMessage(transcript);
      };
      recognition.onerror = (e: SpeechRecognitionError) => {
        console.error('Speech recognition error:', e);
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: 'Sorry, I couldn\'t hear you. Please try typing instead.' 
        }]);
      };
      recognitionRef.current = recognition;
    }

    setup();
    return () => {
      disconnect();
    };
  }, [isOpen, connect, disconnect, auth]);

  const speak = (text: string) => {
    if (!synthRef.current || !isSpeaking) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synthRef.current.speak(utterance);
  };

  const handleMic = () => {
    if (!recognitionRef.current) {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: 'Voice input is not supported in your browser. Please type your message.' 
      }]);
      return;
    }
    recognitionRef.current.start();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setIsTyping(true); // Show typing indicator

    try {
      // First try vector search
      const vectorRes = await fetch('/api/chat/query-vector-faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });

      if (!vectorRes.ok) {
        throw new Error('Vector search failed');
      }

      const vectorData = await vectorRes.json();
      
      if (vectorData.noMatch) {
        // If no match found, use the fallback message
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: vectorData.match // Use the fallback message
        }]);
      } else {
        // Use the vector search result
        setMessages(prev => [...prev, { from: 'bot', text: vectorData.match }]);
        speak(vectorData.match);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsTyping(false); // Hide typing indicator
    }
  };

  // Hide HelpChat when a session is running or on auth pages
  if (isSessionActive || (typeof window !== 'undefined' && window.location.pathname.startsWith('/auth'))) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full p-4 shadow-lg"
        >
          💬
        </Button>
      ) : (
        <Card className="w-80 sm:w-96 p-4 shadow-lg max-h-[80vh] md:max-h-[600px] flex flex-col">
          <div className="mb-4 flex justify-between">
            <h3 className="text-lg font-semibold">talkAI Support</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSpeaking(!isSpeaking)}
                title={isSpeaking ? "Mute voice" : "Unmute voice"}
                className="text-gray-500 hover:text-gray-700"
              >
                {isSpeaking ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </Button>
            </div>
          </div>
          
          <div className="mb-4 flex-1 overflow-y-auto min-h-0">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-2">
                <div className="text-sm text-gray-600 mb-3">Suggested questions:</div>
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-left justify-start h-auto p-3 whitespace-normal text-xs sm:text-sm"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-3 ${
                      message.from === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className={`text-xs text-muted-foreground mb-1 ${
                      message.from === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.from === 'user' ? 'You' : 'TalkAI Assistant'}
                    </div>
                    <div
                      className={`inline-block rounded-lg p-2 max-w-[85%] text-sm ${
                        message.from === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="mb-3 text-left">
                    <div className="text-xs text-muted-foreground mb-1 text-left">
                      TalkAI Assistant
                    </div>
                    <div className="inline-block rounded-lg p-2 bg-gray-200">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 mt-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage(input);
                }
              }}
              placeholder="Type your message..."
              className="flex-1 text-sm"
            />
            <Button onClick={() => sendMessage(input)} size="sm">Send</Button>
            <Button onClick={handleMic} size="sm">🎤</Button>
          </div>

          {connectionError && (
            <div className="mt-2 text-sm text-red-500">
              {connectionError}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default function HelpChat() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const t = await getClientAccessToken();
        if (mounted) setToken(t);
      } catch (e) {
        console.error('HelpChat: failed to fetch access token', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (!token) return null;

  const auth = { type: 'accessToken', value: token } as const;
  return (
    <VoiceProvider auth={auth}>
      <HelpChatContent auth={auth} />
    </VoiceProvider>
  );
} 
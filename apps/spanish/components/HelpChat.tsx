
'use client';

import { useEffect, useRef, useState } from 'react';

// Use any type to avoid conflicts with existing declarations
type SpeechRecognition = any;
type SpeechRecognitionEvent = any;

const suggestedQuestions = [
  "What is TalkAI?",
  "How does pricing work?",
  "What are EVI's ethical principles?",
  "Is my data private?",
];

const HelpChat = () => {
  const [messages, setMessages] = useState<{ from: 'user' | 'bot', text: string }[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const apiKeyRef = useRef<string | null>(null);
  const synthRef = useRef(window.speechSynthesis);
  const memoryRef = useRef<string[]>([]); // Context memory

  // Auto-suggest questions on open
  useEffect(() => {
    suggestedQuestions.forEach(q => {
      setMessages(prev => [...prev, { from: 'bot', text: `💡 Suggested: ${q}` }]);
    });
  }, []);

  // Setup WebSocket + Voice Recognition
  useEffect(() => {
    const setup = async () => {
      const res = await fetch('/api/get-hume-token');
      const { apiKey } = await res.json();
      apiKeyRef.current = apiKey;

      socketRef.current = new WebSocket('wss://api.hume.ai/v1/evi');

      socketRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data?.output?.text) {
          const reply = data.output.text;
          setMessages(prev => [...prev, { from: 'bot', text: reply }]);
          speak(reply);
        }
      };
    };

    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as unknown as { webkitSpeechRecognition: new () => SpeechRecognition }).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        sendMessage(transcript);
      };
      recognitionRef.current = recognition;
    }

    setup();
    return () => {
      socketRef.current?.close();
    };
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synthRef.current.speak(utterance);
  };

  const handleMic = () => {
    recognitionRef.current?.start();
  };

  const sendMessage = async (msg?: string) => {
    const userInput = msg || input.trim();
    if (!userInput || !socketRef.current || !apiKeyRef.current) return;

    setMessages(prev => [...prev, { from: 'user', text: userInput }]);
    memoryRef.current.push(userInput); // Add to memory
    setInput('');

    const vectorRes = await fetch('/api/query-vector-faq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userInput })
    });

    const { match } = await vectorRes.json();

    socketRef.current.send(JSON.stringify({
      api_key: apiKeyRef.current,
      input: { text: userInput },
      system: {
        prompt: `
You are TalkAI's empathetic support assistant.
Context so far: ${memoryRef.current.join(' | ')}
Related FAQ: ${match}
Be brief, human, and accurate.
        `
      }
    }));
  };

  return (
    <div className="chat-widget">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.from}`}>{msg.text}</div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about TalkAI.im..."
        />
        <button onClick={() => sendMessage()}>Send</button>
        <button onClick={handleMic}>🎙️</button>
      </div>
    </div>
  );
};

export default HelpChat;

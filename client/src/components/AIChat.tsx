import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    puter: any;
  }
}

export default function AIChat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const { toast } = useToast();

  const generateResponse = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await window.puter.ai.chat(prompt, {
        model: 'openrouter:meta-llama/llama-3.1-8b-instruct:free',
        stream: true
      });

      const newMessages = [
        ...messages,
        { role: 'user', content: prompt }
      ];

      let fullResponse = '';
      for await (const part of response) {
        if (part?.text) {
          fullResponse += part.text;
        }
      }

      setMessages([
        ...newMessages,
        { role: 'assistant', content: fullResponse }
      ]);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    generateResponse(input);
    setInput('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
            } max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
          >
            {msg.content}
          </motion.div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Send'}
        </Button>
      </form>
    </div>
  );
}
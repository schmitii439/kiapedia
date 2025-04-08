import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface PerplexityRequest {
  model: string;
  messages: Message[];
  max_tokens?: number;
  temperature: number;
  stream: boolean;
}

interface PerplexityResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  citations?: string[];
}

interface UsePerplexityProps {
  initialPrompt?: string;
  systemMessage?: string;
}

export function usePerplexity({ initialPrompt, systemMessage }: UsePerplexityProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(
    systemMessage
      ? [{ role: 'system', content: systemMessage }]
      : []
  );
  const [citations, setCitations] = useState<string[]>([]);

  // If initialPrompt is provided, add it to messages
  if (initialPrompt && messages.length === (systemMessage ? 1 : 0)) {
    setMessages([
      ...(systemMessage ? [{ role: 'system', content: systemMessage }] : []),
      { role: 'user', content: initialPrompt }
    ]);
  }

  const generateResponse = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    // Add user message to conversation
    const updatedMessages = [
      ...messages,
      { role: 'user', content: prompt }
    ];

    try {
      const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
      
      if (!apiKey) {
        throw new Error("Perplexity API key not found");
      }

      const requestBody: PerplexityRequest = {
        model: "llama-3.1-sonar-small-128k-online",
        messages: updatedMessages,
        temperature: 0.2,
        stream: false,
      };

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from Perplexity');
      }

      const data: PerplexityResponse = await response.json();
      const result = data.choices[0].message.content;

      // Store citations if available
      if (data.citations && data.citations.length > 0) {
        setCitations(data.citations);
      }

      // Update messages with the bot's response
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: result }
      ]);

      setIsLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  const resetConversation = () => {
    setMessages(
      systemMessage
        ? [{ role: 'system', content: systemMessage }]
        : []
    );
    setCitations([]);
    setError(null);
  };

  // Function to add a message manually (for demo without API key)
  const addMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  return {
    messages,
    citations,
    isLoading,
    error,
    generateResponse,
    resetConversation,
    addMessage
  };
}

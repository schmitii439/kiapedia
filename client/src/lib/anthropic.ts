import { useState } from 'react';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025. 
const ANTHROPIC_MODEL = "claude-3-7-sonnet-20250219";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AnthropicRequest {
  model: string;
  messages: Message[];
  system?: string;
  max_tokens: number;
  temperature?: number;
}

interface AnthropicResponse {
  content: { text: string }[];
}

interface UseAnthropicProps {
  initialPrompt?: string;
  systemMessage?: string;
}

export function useAnthropic({ initialPrompt, systemMessage }: UseAnthropicProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(
    initialPrompt ? [{ role: 'user', content: initialPrompt }] : []
  );

  const generateResponse = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    // Add user message to conversation
    const updatedMessages = [
      ...messages,
      { role: 'user', content: prompt }
    ];

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        throw new Error("Anthropic API key not found");
      }

      const requestBody: AnthropicRequest = {
        model: ANTHROPIC_MODEL,
        messages: updatedMessages,
        max_tokens: 1000,
        temperature: 0.7,
      };

      // Add system message if provided
      if (systemMessage) {
        requestBody.system = systemMessage;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from Anthropic');
      }

      const data: AnthropicResponse = await response.json();
      const result = data.content[0].text;

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
    setMessages([]);
    setError(null);
  };

  // Function to add a message manually (for demo without API key)
  const addMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  return {
    messages,
    isLoading,
    error,
    generateResponse,
    resetConversation,
    addMessage
  };
}

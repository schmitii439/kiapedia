import { useState } from 'react';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = "gpt-4o";

interface OpenAIRequest {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: string };
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface UseOpenAIProps {
  initialPrompt?: string;
  systemMessage?: string;
}

export function useOpenAI({ initialPrompt, systemMessage }: UseOpenAIProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    systemMessage
      ? [{ role: 'system', content: systemMessage }]
      : []
  );

  // If initialPrompt is provided, add it to messages
  if (initialPrompt && messages.length === 0) {
    setMessages([
      ...(systemMessage ? [{ role: 'system', content: systemMessage }] : []),
      { role: 'user', content: initialPrompt }
    ]);
  }
  
  // Function to add a message manually (for demo without API key)
  const addMessage = (message: { role: string; content: string }) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const generateResponse = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    // Add user message to conversation
    const updatedMessages = [
      ...messages,
      { role: 'user', content: prompt }
    ];

    try {
      // Use server-side API endpoint instead of direct API call
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          systemMessage: systemMessage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from OpenAI API');
      }

      const data = await response.json();
      const result = data.content;

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
    setError(null);
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

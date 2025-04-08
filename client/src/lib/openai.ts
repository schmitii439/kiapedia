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
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error("OpenAI API key not found");
      }

      const requestBody: OpenAIRequest = {
        model: OPENAI_MODEL,
        messages: updatedMessages,
        temperature: 0.7,
        max_tokens: 1000,
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
      }

      const data: OpenAIResponse = await response.json();
      const result = data.choices[0].message.content;

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

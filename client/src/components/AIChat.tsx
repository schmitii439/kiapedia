import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOpenAI } from '@/lib/openai';
import { useAnthropic } from '@/lib/anthropic';
import { usePerplexity } from '@/lib/perplexity';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

interface AIChatProps {
  topicId?: number;
  initialAnalysis?: string;
}

type AIProvider = 'openai' | 'anthropic' | 'perplexity';

const AIChat: React.FC<AIChatProps> = ({ topicId, initialAnalysis }) => {
  const [question, setQuestion] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai');
  const { toast } = useToast();

  // System message for AI context
  const systemMessage = "Du bist ein kritischer Analytiker für Verschwörungstheorien. Beantworte Fragen sachlich, faktenbasiert und skeptisch. Vermeide Spekulation und verweise auf wissenschaftliche Erkenntnisse wenn möglich.";

  // Initialize AI providers
  const openai = useOpenAI({ systemMessage });
  const anthropic = useAnthropic({ systemMessage });
  const perplexity = usePerplexity({ systemMessage });

  // Handle question submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    try {
      // For demonstration without API keys
      toast({
        title: "KI-Anfrage",
        description: `Die ${selectedProvider.toUpperCase()}-API würde hier verwendet werden, wenn der API-Schlüssel konfiguriert wäre.`,
        duration: 3000,
      });
      
      // Add the question to the UI immediately for better UX
      if (selectedProvider === 'openai') {
        openai.addMessage({ role: 'user', content: question });
        openai.addMessage({ role: 'assistant', content: 'Diese Antwort ist ein Platzhalter. Um echte KI-Antworten zu erhalten, muss ein OpenAI API-Schlüssel konfiguriert werden.' });
      } else if (selectedProvider === 'anthropic') {
        anthropic.addMessage({ role: 'user', content: question });
        anthropic.addMessage({ role: 'assistant', content: 'Diese Antwort ist ein Platzhalter. Um echte KI-Antworten zu erhalten, muss ein Anthropic API-Schlüssel konfiguriert werden.' });
      } else if (selectedProvider === 'perplexity') {
        perplexity.addMessage({ role: 'user', content: question });
        perplexity.addMessage({ role: 'assistant', content: 'Diese Antwort ist ein Platzhalter. Um echte KI-Antworten zu erhalten, muss ein Perplexity API-Schlüssel konfiguriert werden.' });
      }
      
      /* Uncomment this when API keys are provided
      // Select the appropriate AI provider
      let response: string;
      
      switch (selectedProvider) {
        case 'anthropic':
          response = await anthropic.generateResponse(question);
          break;
        case 'perplexity':
          response = await perplexity.generateResponse(question);
          break;
        case 'openai':
        default:
          response = await openai.generateResponse(question);
          break;
      }
      
      // Save chat to backend if user is logged in and topicId is provided
      if (topicId) {
        try {
          await apiRequest('POST', '/api/ai-chats', {
            userId: 1, // This would be the actual user ID when authentication is implemented
            topicId,
            question,
            answer: response,
            aiProvider: selectedProvider
          });
          
          // Invalidate AI chats query to refresh the data
          queryClient.invalidateQueries({ queryKey: [`/api/ai-chats/topic/${topicId}`] });
        } catch (error) {
          console.error('Failed to save chat:', error);
        }
      }
      */
      
      // Clear the input
      setQuestion('');
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Es gab ein Problem bei der Verarbeitung Ihrer Anfrage. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
      console.error('AI chat error:', err);
    }
  };

  // Get state from the active provider
  const getActiveState = () => {
    switch (selectedProvider) {
      case 'anthropic':
        return { 
          messages: anthropic.messages,
          isLoading: anthropic.isLoading,
          error: anthropic.error
        };
      case 'perplexity':
        return { 
          messages: perplexity.messages,
          isLoading: perplexity.isLoading,
          error: perplexity.error,
          citations: perplexity.citations
        };
      case 'openai':
      default:
        return { 
          messages: openai.messages,
          isLoading: openai.isLoading,
          error: openai.error
        };
    }
  };

  const { messages, isLoading, error } = getActiveState();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="material-icons text-primary-600 mr-2">smart_toy</span>
        KI-gestützte Analyse
      </h2>
      
      {/* Initial analysis if provided */}
      {initialAnalysis && (
        <div className="border border-gray-200 rounded-lg p-4 mb-4 dark:border-gray-700">
          <div className="flex items-start mb-4">
            <div className="bg-primary-100 p-3 rounded-full mr-3 dark:bg-primary-900">
              <span className="material-icons text-primary-700 dark:text-primary-300">psychology</span>
            </div>
            <div>
              <p className="text-gray-800 dark:text-gray-200">{initialAnalysis}</p>
              <div className="text-xs text-gray-500 mt-2">Analysiert mit OpenAI GPT-4</div>
            </div>
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {messages.filter(msg => msg.role !== 'system').map((message, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-gray-100 ml-8 dark:bg-gray-700' 
                : 'bg-primary-50 mr-8 dark:bg-primary-900/30'
            }`}
          >
            <div className="flex items-start">
              <div className={`p-2 rounded-full mr-2 ${
                message.role === 'user'
                  ? 'bg-gray-200 dark:bg-gray-600'
                  : 'bg-primary-100 dark:bg-primary-800'
              }`}>
                <span className="material-icons text-sm">
                  {message.role === 'user' ? 'person' : 'smart_toy'}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm dark:bg-red-900/30 dark:text-red-300">
            Fehler: {error}
          </div>
        )}
      </div>

      {/* AI provider selector */}
      <div className="flex mb-4 space-x-2">
        <button
          onClick={() => setSelectedProvider('openai')}
          className={`text-xs px-3 py-1 rounded-full ${
            selectedProvider === 'openai'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          OpenAI
        </button>
        <button
          onClick={() => setSelectedProvider('anthropic')}
          className={`text-xs px-3 py-1 rounded-full ${
            selectedProvider === 'anthropic'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Anthropic
        </button>
        <button
          onClick={() => setSelectedProvider('perplexity')}
          className={`text-xs px-3 py-1 rounded-full ${
            selectedProvider === 'perplexity'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Perplexity
        </button>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex">
        <Input
          type="text"
          placeholder="Stellen Sie eine Frage zu diesem Thema..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={isLoading}
        />
        <Button 
          type="submit"
          className="bg-primary-600 text-white px-4 py-2 rounded-r-lg hover:bg-primary-700 transition-colors flex items-center"
          disabled={isLoading || !question.trim()}
        >
          <span className="material-icons mr-1 text-sm">send</span>
          Senden
        </Button>
      </form>
    </div>
  );
};

export default AIChat;

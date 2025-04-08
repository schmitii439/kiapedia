import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOpenAI } from '@/lib/openai';
import { useAnthropic } from '@/lib/anthropic';
import { usePerplexity } from '@/lib/perplexity';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

// Import Icons
import fireLvl1 from '@assets/fire-level-1.png';
import fireLvl3 from '@assets/fire-level-3.png';
import fireLvl8 from '@assets/fire-level-8.png';

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
      // Add the question to the UI immediately for better UX
      if (selectedProvider === 'openai') {
        try {
          const response = await openai.generateResponse(question);
          
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
        } catch (error) {
          // If API call fails, show error and use placeholder
          console.error('OpenAI API error:', error);
          toast({
            title: "OpenAI-Fehler",
            description: "Es gab ein Problem bei der Anfrage an die OpenAI API.",
            variant: "destructive",
            duration: 3000,
          });
          
          // Add the question and a fallback response for better UX
          openai.addMessage({ role: 'user', content: question });
          openai.addMessage({ role: 'assistant', content: 'Es ist ein Fehler bei der Verbindung mit der OpenAI API aufgetreten. Bitte versuchen Sie es später noch einmal.' });
        }
      } else if (selectedProvider === 'anthropic') {
        // For Anthropic, we'll use placeholder until API key is provided
        toast({
          title: "Anthropic API",
          description: "Anthropic API-Schlüssel ist nicht konfiguriert. Eine Platzhalterantwort wird angezeigt.",
          duration: 3000,
        });
        anthropic.addMessage({ role: 'user', content: question });
        anthropic.addMessage({ role: 'assistant', content: 'Diese Antwort ist ein Platzhalter. Um echte KI-Antworten zu erhalten, muss ein Anthropic API-Schlüssel konfiguriert werden.' });
      } else if (selectedProvider === 'perplexity') {
        // For Perplexity, we'll use placeholder until API key is provided
        toast({
          title: "Perplexity API",
          description: "Perplexity API-Schlüssel ist nicht konfiguriert. Eine Platzhalterantwort wird angezeigt.",
          duration: 3000,
        });
        perplexity.addMessage({ role: 'user', content: question });
        perplexity.addMessage({ role: 'assistant', content: 'Diese Antwort ist ein Platzhalter. Um echte KI-Antworten zu erhalten, muss ein Perplexity API-Schlüssel konfiguriert werden.' });
      }
      
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
    <motion.div 
      className="bg-gray-800/70 rounded-xl border border-cyan-500/20 p-6 backdrop-blur-sm shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
        <img src={fireLvl3} alt="AI" className="w-5 h-5 mr-2" />
        KI-gestützte Analyse
      </h2>
      
      {/* Initial analysis if provided */}
      {initialAnalysis && (
        <motion.div 
          className="border border-cyan-500/20 rounded-lg p-4 mb-6 bg-gray-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-start">
            <div className="bg-cyan-900/50 p-3 rounded-full mr-3 border border-cyan-500/30">
              <img src={fireLvl8} alt="AI Analysis" className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-200">{initialAnalysis}</p>
              <div className="text-xs text-cyan-400 mt-2">Analysiert mit OpenAI GPT-4</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chat messages */}
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {messages.filter(msg => msg.role !== 'system').map((message, index) => (
          <motion.div 
            key={index}
            className={`p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-gray-700/70 ml-8 border border-cyan-500/20' 
                : 'bg-gray-800/70 mr-8 border border-cyan-500/30'
            }`}
            initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start">
              <div className={`p-2 rounded-full mr-2 ${
                message.role === 'user'
                  ? 'bg-gray-600 border border-cyan-500/20'
                  : 'bg-cyan-900/50 border border-cyan-500/30'
              }`}>
                <img 
                  src={message.role === 'user' ? fireLvl1 : fireLvl8}
                  alt={message.role === 'user' ? 'User' : 'AI'} 
                  className="w-4 h-4"
                />
              </div>
              <p className="text-sm text-gray-200">{message.content}</p>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex justify-center p-4">
            <motion.div 
              className="relative w-8 h-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <img src={fireLvl3} alt="Loading" className="w-full h-full" />
            </motion.div>
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
        <motion.button
          onClick={() => setSelectedProvider('openai')}
          className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
            selectedProvider === 'openai'
              ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-500/30'
              : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={fireLvl8} alt="OpenAI" className="w-3 h-3" />
          OpenAI
        </motion.button>
        <motion.button
          onClick={() => setSelectedProvider('anthropic')}
          className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
            selectedProvider === 'anthropic'
              ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-500/30'
              : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={fireLvl3} alt="Anthropic" className="w-3 h-3" />
          Anthropic
        </motion.button>
        <motion.button
          onClick={() => setSelectedProvider('perplexity')}
          className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
            selectedProvider === 'perplexity'
              ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-500/30'
              : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={fireLvl1} alt="Perplexity" className="w-3 h-3" />
          Perplexity
        </motion.button>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex mt-4">
        <Input
          type="text"
          placeholder="Stellen Sie eine Frage zu diesem Thema..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 bg-gray-700/50 border-cyan-500/20 text-white rounded-l-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
          disabled={isLoading}
        />
        <Button 
          type="submit"
          className="bg-cyan-900/60 hover:bg-cyan-800/60 text-white border border-cyan-500/30 px-4 py-2 rounded-r-lg transition-colors flex items-center"
          disabled={isLoading || !question.trim()}
        >
          <img src={fireLvl3} alt="Send" className="w-4 h-4 mr-2" />
          Senden
        </Button>
      </form>
    </motion.div>
  );
};

export default AIChat;

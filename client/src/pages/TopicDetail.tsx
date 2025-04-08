import React, { useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Topic, TopicContent, ExpertOpinion } from '@shared/schema';
import HoverDefinition from '@/components/HoverDefinition';
import AIChat from '@/components/AIChat';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const TopicDetail: React.FC = () => {
  const [match, params] = useRoute<{ id: string }>('/topic/:id');
  const { toast } = useToast();
  const topicId = match ? parseInt(params.id) : undefined;

  // Fetch topic data
  const { data: topic, isLoading: topicLoading } = useQuery<Topic>({ 
    queryKey: [`/api/topics/${topicId}`],
    enabled: !!topicId
  });

  // Fetch topic content
  const { data: topicContent, isLoading: contentLoading } = useQuery<TopicContent>({ 
    queryKey: [`/api/topic-contents/${topicId}`],
    enabled: !!topicId
  });

  // Fetch related topics
  const { data: relatedTopics, isLoading: relatedLoading } = useQuery({ 
    queryKey: [`/api/related-topics/${topicId}`],
    enabled: !!topicId
  });

  // Fetch expert opinions
  const { data: expertOpinions, isLoading: opinionsLoading } = useQuery<ExpertOpinion[]>({ 
    queryKey: [`/api/expert-opinions/${topicId}`],
    enabled: !!topicId
  });

  // Fetch glossary terms for hover definitions
  const { data: glossaryTerms } = useQuery({ 
    queryKey: ['/api/glossary']
  });

  // Show toast if topic not found
  useEffect(() => {
    if (!topicLoading && !topic && topicId) {
      toast({
        title: "Thema nicht gefunden",
        description: "Das angeforderte Thema existiert nicht oder wurde entfernt.",
        variant: "destructive",
      });
    }
  }, [topicLoading, topic, topicId, toast]);

  // Loading state
  if (topicLoading || contentLoading) {
    return (
      <div className="py-8 px-4 max-w-5xl mx-auto">
        <div className="flex items-center text-sm mb-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 mx-2" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 mx-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-48 mt-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  // Handle case where topic doesn't exist
  if (!topic) {
    return (
      <div className="py-8 px-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8 dark:bg-gray-800 dark:border-gray-700 text-center">
          <span className="material-icons text-4xl text-gray-400 mb-4">error_outline</span>
          <h1 className="text-2xl font-semibold mb-2">Thema nicht gefunden</h1>
          <p className="text-gray-600 mb-6 dark:text-gray-300">Das von Ihnen gesuchte Thema existiert nicht oder wurde gelöscht.</p>
          <Link href="/conspiracy-theories">
            <a className="text-primary-600 hover:underline font-medium">Zurück zur Übersicht</a>
          </Link>
        </div>
      </div>
    );
  }

  // Process content to add hover definitions for glossary terms
  const processContent = (content: string) => {
    if (!glossaryTerms || !content) return content;
    
    let processedContent = content;
    
    // Find and replace glossary terms with hover definition components
    glossaryTerms.forEach(term => {
      const regex = new RegExp(`\\b${term.term}\\b`, 'g');
      processedContent = processedContent.replace(regex, `<span class="glossary-term" data-term="${term.term}">${term.term}</span>`);
    });
    
    return processedContent;
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      {/* Navigation breadcrumbs */}
      <div className="flex items-center text-sm mb-6">
        <Link href="/conspiracy-theories">
          <a className="text-primary-600 hover:underline flex items-center">
            <span className="material-icons text-sm mr-1">arrow_back</span>
            Zurück zur Übersicht
          </a>
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600 dark:text-gray-300">{topic.century}. Jahrhundert</span>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium">{topic.title} {topic.firstMentionedYear && `(${topic.firstMentionedYear})`}</span>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Erste Erwähnung im Verschwörungskontext: {topic.firstMentionedYear ? `ca. ${topic.firstMentionedYear}` : 'Unbekannt'}
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
              <span className="material-icons text-gray-600 dark:text-gray-300">bookmark_border</span>
            </button>
            <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
              <span className="material-icons text-gray-600 dark:text-gray-300">share</span>
            </button>
          </div>
        </div>
        
        {topicContent ? (
          <div 
            className="prose max-w-none mb-8 dark:prose-invert" 
            dangerouslySetInnerHTML={{ __html: processContent(topicContent.content) }}
          />
        ) : (
          <div className="prose max-w-none mb-8 dark:prose-invert">
            <p className="text-gray-500 italic dark:text-gray-400">
              Detaillierte Informationen zu diesem Thema werden derzeit zusammengestellt.
            </p>
          </div>
        )}
        
        {topicContent?.factCheck && (
          <div className="bg-gray-50 p-4 rounded-lg my-6 border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <span className="material-icons text-primary-600 mr-2 dark:text-primary-400">fact_check</span>
              KI-gestützte Faktenprüfung
            </h3>
            <p className="text-sm dark:text-gray-300">
              {topicContent.factCheck}
            </p>
          </div>
        )}
        
        {!relatedLoading && relatedTopics && relatedTopics.length > 0 && (
          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Verwandte Theorien</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedTopics.map(relatedTopic => (
                <Link key={relatedTopic.id} href={`/topic/${relatedTopic.id}`}>
                  <a className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
                    <h4 className="font-medium">{relatedTopic.title}</h4>
                    {relatedTopic.shortDescription && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{relatedTopic.shortDescription}</p>
                    )}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* AI Chat Module */}
      <AIChat topicId={topicId} initialAnalysis={topicContent?.aiAnalysis} />
      
      {/* Expert Opinions */}
      {!opinionsLoading && expertOpinions && expertOpinions.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mt-8 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Experten-Einschätzungen</h2>
          
          <div className="space-y-4">
            {expertOpinions.map((opinion, index) => (
              <div 
                key={opinion.id} 
                className={`flex items-start ${index < expertOpinions.length - 1 ? 'border-b border-gray-100 pb-4 dark:border-gray-700' : ''}`}
              >
                {opinion.avatarUrl ? (
                  <img 
                    src={opinion.avatarUrl} 
                    alt={opinion.expertName} 
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full mr-3 bg-gray-200 flex items-center justify-center dark:bg-gray-700">
                    <span className="material-icons text-gray-500 dark:text-gray-400">person</span>
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{opinion.expertName}</h3>
                  <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">{opinion.expertTitle}</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    "{opinion.opinion}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicDetail;

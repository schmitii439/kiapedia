import React, { useEffect, useState, useRef } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Topic, TopicContent, ExpertOpinion } from '@shared/schema';
import HoverDefinition from '@/components/HoverDefinition';
import AIChat from '@/components/AIChat';
import ReactionButtons from '@/components/ReactionButtons';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Import icons for different uses
import fireLvl1 from '@assets/fire-level-1.png'; // Wahr
import fireLvl3 from '@assets/fire-level-3.png'; // Neutral/Unbestätigt
import fireLvl8 from '@assets/fire-level-8.png'; // Unwahr
import uploadIcon from '@assets/upload.png';
import commentIcon from '@assets/comment.png';
import backIcon from '@assets/back.png';
import downloadIcon from '@assets/download.png';
import infoIcon from '@assets/info.png';

// Import theme-specific background images (nur für bestimmte Themen)
import chemtrailsImg from '@assets/DALL·E 2025-04-08 05.09.55 - A subtle, realistic photomontage intended as a website background, depicting a high-altitude airplane dispersing visible chemtrails across a partly cl.webp';
import geoEngineeringImg from '@assets/DALL·E 2025-04-08 05.11.19 - A subtle, realistic photomontage designed for a website background, illustrating the concept of geo-engineering without text. The image features a wid.webp';

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
          <Link href="/conspiracy-theories" className="text-primary-600 hover:underline font-medium">
            Zurück zur Übersicht
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

  // State for file upload and metadata display
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Truth status based on topic id (in real app, would come from database)
  const getTruthStatus = (id: number) => {
    if (id % 3 === 0) return "wahr";
    if (id % 3 === 1) return "unbestätigt";
    return "unwahr";
  };

  // Get topic-specific background image based on topic ID
  const getTopicImage = (id: number) => {
    // Chemtrails topic (ID: 101) uses the Chemtrails image
    if (id === 101) return chemtrailsImg;
    
    // All Geo-Engineering topics (IDs: 101-103) use the Geo-Engineering image
    if (id >= 101 && id <= 103) return geoEngineeringImg;
    
    // Default: no specific image
    return null;
  };

  const truthStatus = topic ? getTruthStatus(topic.id) : "unbestätigt";
  const topicImage = topic ? getTopicImage(topic.id) : null;

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      toast({
        title: "Dateien hochgeladen",
        description: `${newFiles.length} Datei(en) erfolgreich hochgeladen.`,
        duration: 3000,
      });
    }
  };

  // Handle view metadata click
  const handleViewMetadata = (file: File) => {
    setSelectedFile(file);
    setShowMetadata(true);
  };

  // Handle comment click
  const handleCommentClick = () => {
    setIsCommentModalOpen(true);
    toast({
      title: "Kommentare",
      description: "Diese Funktion wird in der nächsten Version implementiert.",
      duration: 3000,
    });
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      {/* Navigation breadcrumbs */}
      <motion.div 
        className="flex items-center text-sm mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/conspiracy-theories" className="text-cyan-400 hover:text-cyan-300 flex items-center transition-colors">
          <img src={backIcon} alt="Back" className="w-4 h-4 mr-1" />
          Zurück zur Übersicht
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-300">{topic.century}. Jahrhundert</span>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-white">{topic.title} {topic.firstMentionedYear && `(${topic.firstMentionedYear})`}</span>
      </motion.div>
      
      <motion.div 
        className="bg-gray-800/70 rounded-xl border border-cyan-500/20 p-6 mb-8 shadow-lg backdrop-blur-sm"
        style={{
          backgroundImage: topicImage ? `linear-gradient(to bottom, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.95)), url(${topicImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">{topic.title}</h1>
            <div className="flex items-center gap-3">
              <p className="text-gray-300">
                Erste Erwähnung: {topic.firstMentionedYear ? `ca. ${topic.firstMentionedYear}` : 'Unbekannt'}
              </p>
              {truthStatus === "wahr" ? (
                <Badge variant="outline" className="bg-green-900/30 border-green-500/30 text-white flex items-center gap-1 px-3 py-1">
                  <img src={fireLvl1} alt="True" className="w-4 h-4" /> Wahr
                </Badge>
              ) : truthStatus === "unbestätigt" ? (
                <Badge variant="outline" className="bg-yellow-900/30 border-yellow-500/30 text-white flex items-center gap-1 px-3 py-1">
                  <img src={fireLvl3} alt="Neutral" className="w-4 h-4" /> Unbestätigt
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-900/30 border-red-500/30 text-white flex items-center gap-1 px-3 py-1">
                  <img src={fireLvl8} alt="False" className="w-4 h-4" /> Widerlegt
                </Badge>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleCommentClick}
              className="bg-gray-700/70 hover:bg-gray-600/70 text-white border border-cyan-500/20"
            >
              <img src={commentIcon} alt="Comment" className="w-5 h-5 mr-2" />
              Kommentieren
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-700/70 hover:bg-gray-600/70 text-white border border-cyan-500/20"
            >
              <img src={uploadIcon} alt="Upload" className="w-5 h-5 mr-2" />
              Datei hochladen
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              multiple 
            />
          </div>
        </div>
        
        {/* Main content section with topic description */}
        {topicContent ? (
          <div className="text-gray-300 mb-8 leading-relaxed group">
            {/* Hover to reveal more detailed content */}
            <div className="prose prose-invert max-w-none mb-8 transition-all duration-300 ease-in-out">
              <p className="group-hover:opacity-100">{topicContent.content || "Keine Beschreibung verfügbar."}</p>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-gray-300 italic">
              Detaillierte Informationen zu diesem Thema werden derzeit zusammengestellt.
            </p>
          </div>
        )}
        
        {/* Truth indicator section */}
        <div className="bg-gray-700/50 p-5 rounded-lg my-6 border border-cyan-500/20 backdrop-blur-sm">
          <h3 className="text-lg font-medium mb-3 flex items-center text-white">
            <img src={fireLvl3} alt="Truth" className="w-5 h-5 mr-2" />
            Wahrheitsbewertung
          </h3>
          
          {truthStatus === "wahr" ? (
            <div className="text-gray-200">
              <p>Diese Verschwörungstheorie gilt als bestätigt. Mehrere unabhängige Quellen und historische Dokumente haben die zentralen Behauptungen verifiziert.</p>
            </div>
          ) : truthStatus === "unbestätigt" ? (
            <div className="text-gray-200">
              <p>Diese Verschwörungstheorie ist weder eindeutig bestätigt noch widerlegt. Es gibt Indizien, die für einige Aspekte sprechen, aber keine abschließenden Beweise.</p>
            </div>
          ) : (
            <div className="text-gray-200">
              <p>Diese Verschwörungstheorie gilt als widerlegt. Die zentralen Behauptungen wurden durch Faktenprüfung und historische Forschung entkräftet.</p>
            </div>
          )}
        </div>
        
        {/* Uploaded files section */}
        {files.length > 0 && (
          <div className="mt-8 border-t border-cyan-500/20 pt-6">
            <h3 className="text-lg font-medium mb-4 text-white flex items-center">
              <img src={uploadIcon} alt="Files" className="w-5 h-5 mr-2" />
              Hochgeladene Dateien
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((file, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-700/50 p-4 rounded-lg border border-cyan-500/10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white">{file.name}</p>
                      <p className="text-sm text-gray-300">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleViewMetadata(file)}
                        variant="outline"
                        className="text-xs py-1 h-auto border-cyan-500/30 text-cyan-400 hover:text-cyan-300"
                      >
                        <img src={fireLvl3} alt="Metadata" className="w-4 h-4 mr-1" />
                        Metadaten
                      </Button>
                      <Button
                        variant="outline"
                        className="text-xs py-1 h-auto border-cyan-500/30 text-cyan-400 hover:text-cyan-300"
                      >
                        <img src={downloadIcon} alt="Download" className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Metadata modal */}
        {showMetadata && selectedFile && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowMetadata(false)}
          >
            <motion.div 
              className="bg-gray-800 p-6 rounded-lg border border-cyan-500/30 w-full max-w-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">Metadaten: {selectedFile.name}</h3>
                <Button 
                  onClick={() => setShowMetadata(false)}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-3 text-gray-300">
                <div className="grid grid-cols-2 gap-2 border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Dateiname:</span>
                  <span>{selectedFile.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Größe:</span>
                  <span>{(selectedFile.size / 1024).toFixed(2)} KB</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Typ:</span>
                  <span>{selectedFile.type || "Unbekannt"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Zuletzt geändert:</span>
                  <span>{selectedFile.lastModified ? new Date(selectedFile.lastModified).toLocaleString() : "Unbekannt"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-gray-700 pb-2">
                  <span className="text-gray-400">MIME-Typ:</span>
                  <span>{selectedFile.type}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {!relatedLoading && relatedTopics && relatedTopics.length > 0 && (
          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Verwandte Theorien</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedTopics.map(relatedTopic => (
                <Link key={relatedTopic.id} href={`/topic/${relatedTopic.id}`} className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 block">
                  <h4 className="font-medium">{relatedTopic.title}</h4>
                  {relatedTopic.shortDescription && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{relatedTopic.shortDescription}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Reaction Buttons */}
        <ReactionButtons postId={topicId || 0} className="mt-6" />
      </motion.div>
      
      {/* AI Chat Module */}
      <AIChat topicId={topicId} initialAnalysis={topicContent?.aiAnalysis} />
      
      {/* Expert Opinions */}
      {!opinionsLoading && expertOpinions && expertOpinions.length > 0 && (
        <motion.div 
          className="bg-gray-800/70 rounded-xl border border-cyan-500/20 p-6 mt-8 shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
            <img src={fireLvl1} alt="Experts" className="w-5 h-5 mr-2" />
            Experten-Einschätzungen
          </h2>
          
          <div className="space-y-4">
            {expertOpinions.map((opinion, index) => (
              <motion.div 
                key={opinion.id} 
                className={`flex items-start ${index < expertOpinions.length - 1 ? 'border-b border-gray-600/30 pb-4' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                {opinion.avatarUrl ? (
                  <img 
                    src={opinion.avatarUrl} 
                    alt={opinion.expertName} 
                    className="w-12 h-12 rounded-full mr-3 object-cover border border-cyan-500/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full mr-3 bg-gray-700 flex items-center justify-center border border-cyan-500/30">
                    <img src={fireLvl3} alt="Expert" className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-white">{opinion.expertName}</h3>
                  <p className="text-sm text-cyan-400 mb-2">{opinion.expertTitle}</p>
                  <p className="text-gray-300">
                    "{opinion.opinion}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TopicDetail;

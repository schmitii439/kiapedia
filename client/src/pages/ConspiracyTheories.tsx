import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import CenturyAccordion from '@/components/CenturyAccordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Import fire level icons
import fireLvl1 from '@assets/fire-level-1.png';
import fireLvl2 from '@assets/fire-level-2.png';
import fireLvl3 from '@assets/fire-level-3.png';
import fireLvl4 from '@assets/fire-level-4.png';
import fireLvl5 from '@assets/fire-level-5.png';
import fireLvl6 from '@assets/fire-level-6.png';
import fireLvl7 from '@assets/fire-level-7.png';
import fireLvl8 from '@assets/fire-level-8.png';
import categoryIcon from '@assets/category.png';

const ConspiracyTheories: React.FC = () => {
  // Fetch all topics for initial statistics
  const { data: topics, isLoading } = useQuery({ 
    queryKey: ['/api/topics']
  });

  // Count topics per century
  const getTopicsCountByCentury = () => {
    if (!topics) return {};
    
    const counts: Record<number, number> = {};
    
    if (Array.isArray(topics)) {
      topics.forEach((topic: any) => {
        if (counts[topic.century]) {
          counts[topic.century]++;
        } else {
          counts[topic.century] = 1;
        }
      });
    }
    
    return counts;
  };

  const topicCounts = getTopicsCountByCentury();

  const { toast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [newTopicYear, setNewTopicYear] = useState('');
  const [newTopicCentury, setNewTopicCentury] = useState(21);
  const [newTopicTruthLevel, setNewTopicTruthLevel] = useState(5);
  
  const handleNewTopicClick = () => {
    setShowNewTopicModal(true);
  };
  
  const handleSubmitNewTopic = () => {
    // In einer echten App würden wir hier die Daten an den Server senden
    toast({
      title: "Thema erstellt",
      description: `'${newTopicTitle}' mit Wahrheitslevel ${newTopicTruthLevel} wurde erfolgreich erstellt.`,
      duration: 3000,
    });
    
    // Formular zurücksetzen
    setNewTopicTitle('');
    setNewTopicDescription('');
    setNewTopicYear('');
    setNewTopicCentury(21);
    setNewTopicTruthLevel(5);
    setShowNewTopicModal(false);
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
    toast({
      title: "Datei-Upload",
      description: "Diese Funktion wird in der nächsten Version implementiert.",
      duration: 3000,
    });
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">Verschwörungstheorien im Kontext</h1>
          <div className="flex space-x-3">
            <Button 
              onClick={handleNewTopicClick}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/30 shadow-md"
            >
              <img src={categoryIcon} alt="New" className="w-5 h-5 mr-2" />
              Neues Thema
            </Button>
            <Button 
              onClick={handleUploadClick}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/30 shadow-md"
            >
              <img src={fireLvl2} alt="Upload" className="w-5 h-5 mr-2" />
              Upload
            </Button>
          </div>
        </div>
        <p className="text-gray-300">
          Eine historische und kritische Betrachtung von Verschwörungstheorien vom 18. bis 21. Jahrhundert.
        </p>
      </motion.div>
      
      {/* Statistics */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-1">18. Jahrhundert</h3>
              <p className="text-3xl font-bold text-primary-600">{topicCounts[18] || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dokumentierte Theorien</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-1">19. Jahrhundert</h3>
              <p className="text-3xl font-bold text-primary-600">{topicCounts[19] || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dokumentierte Theorien</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-1">20. Jahrhundert</h3>
              <p className="text-3xl font-bold text-primary-600">{topicCounts[20] || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dokumentierte Theorien</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-1">21. Jahrhundert</h3>
              <p className="text-3xl font-bold text-primary-600">{topicCounts[21] || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dokumentierte Theorien</p>
            </div>
          </>
        )}
      </div>
      
      {/* Introduction */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Über diese Sammlung</h2>
        <p className="text-gray-600 mb-4 dark:text-gray-300">
          Diese Datenbank sammelt und analysiert Verschwörungstheorien aus über vier Jahrhunderten.
          Jede Theorie wird kritisch betrachtet, mit historischem Kontext versehen und einer
          faktenbasierten Analyse unterzogen. Unser Ziel ist nicht, zu verurteilen oder zu bestätigen,
          sondern zu verstehen, warum diese Theorien entstanden sind und welche sozialen,
          politischen und psychologischen Faktoren zu ihrer Verbreitung beigetragen haben.
        </p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span className="material-icons text-primary-600 mr-2">info</span>
          Klicken Sie auf eine Theorie, um detaillierte Informationen zu erhalten.
        </div>
      </div>
      
      {/* Centuries Accordion */}
      <div className="mb-8">
        <CenturyAccordion />
      </div>
      
      {/* Research note */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="flex items-start">
          <span className="material-icons text-yellow-500 mr-3">lightbulb</span>
          <div>
            <h3 className="font-medium mb-1">Hinweis zur Forschung</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Die hier präsentierten Informationen dienen ausschließlich Bildungszwecken.
              Unsere Analysen stützen sich auf wissenschaftliche Methoden und
              Faktenprüfung durch mehrere unabhängige Quellen.
            </p>
          </div>
        </div>
      </div>
      
      {/* Neues Thema Modal */}
      <Dialog open={showNewTopicModal} onOpenChange={setShowNewTopicModal}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-b from-gray-900 to-gray-800 border border-cyan-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Neues Thema erstellen</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titel
              </Label>
              <Input
                id="title"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                className="col-span-3 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Jahr
              </Label>
              <Input
                id="year"
                value={newTopicYear}
                onChange={(e) => setNewTopicYear(e.target.value)}
                className="col-span-3 bg-gray-800 border-gray-700 text-white"
                placeholder="z.B. 1969"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="century" className="text-right">
                Jahrhundert
              </Label>
              <div className="col-span-3 flex gap-4 items-center">
                <div className="flex-1 grid grid-cols-4 gap-2">
                  {[18, 19, 20, 21].map((century) => (
                    <Button
                      key={century}
                      type="button"
                      onClick={() => setNewTopicCentury(century)}
                      variant={newTopicCentury === century ? "default" : "outline"}
                      className={newTopicCentury === century ? "bg-cyan-600 hover:bg-cyan-700" : ""}
                    >
                      {century}.
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="truthLevel" className="text-right">
                Wahrheitslevel (1-10)
              </Label>
              <div className="col-span-3 space-y-3">
                <div className="flex justify-between">
                  <span>Unwahrscheinlich</span>
                  <span>Gewiss</span>
                </div>
                <div className="flex items-center gap-4">
                  <img src={fireLvl1} alt="Level 1" className="w-6 h-6" />
                  <Slider
                    value={[newTopicTruthLevel]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setNewTopicTruthLevel(value[0])}
                    className="flex-1"
                  />
                  <img 
                    src={
                      newTopicTruthLevel <= 1 ? fireLvl1 :
                      newTopicTruthLevel <= 2 ? fireLvl2 :
                      newTopicTruthLevel <= 3 ? fireLvl3 :
                      newTopicTruthLevel <= 5 ? fireLvl4 :
                      newTopicTruthLevel <= 6 ? fireLvl5 :
                      newTopicTruthLevel <= 7 ? fireLvl6 :
                      newTopicTruthLevel <= 9 ? fireLvl7 :
                      fireLvl8
                    } 
                    alt={`Level ${newTopicTruthLevel}`} 
                    className="w-7 h-7" 
                  />
                </div>
                <div className="text-center font-bold text-xl text-cyan-500">
                  {newTopicTruthLevel}/10
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Beschreibung
              </Label>
              <Textarea
                id="description"
                value={newTopicDescription}
                onChange={(e) => setNewTopicDescription(e.target.value)}
                className="col-span-3 min-h-[120px] bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowNewTopicModal(false)}>
              Abbrechen
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmitNewTopic}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/30 shadow-md"
            >
              Thema erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConspiracyTheories;

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Import images
import fireLvl1 from '@assets/fire-level-1.png';
import fireLvl3 from '@assets/fire-level-3.png';
import fireLvl5 from '@assets/fire-level-5.png';
import fireLvl8 from '@assets/fire-level-8.png';
import categoryIcon from '@assets/category.png';
import infoIcon from '@assets/info.png';

// Import the Chemtrails image
import chemtrailsImg from '@assets/DALL·E 2025-04-08 05.09.55 - A subtle, realistic photomontage intended as a website background, depicting a high-altitude airplane dispersing visible chemtrails across a partly cl.webp';
import geoEngineeringImg from '@assets/DALL·E 2025-04-08 05.11.19 - A subtle, realistic photomontage designed for a website background, illustrating the concept of geo-engineering without text. The image features a wid.webp';

// Define categories with example topics
const verschwörungsKategorien = [
  {
    id: 1,
    title: "Geo-Engineering",
    image: geoEngineeringImg,
    description: "Verschwörungstheorien rund um gezielte großflächige Eingriffe in geochemische Kreisläufe der Erde.",
    topics: [
      { id: 101, title: "Chemtrails", year: 1996, description: "Theorie über angebliche chemische Zusätze in Flugzeugabgasen zur Wetterveränderung oder Bevölkerungskontrolle." },
      { id: 102, title: "Sonnenspiegel", year: 2010, description: "Behauptung, dass riesige Spiegel im Weltall installiert werden, um Sonnenlicht zurück ins All zu reflektieren." },
      { id: 103, title: "Wetterkontrolle", year: 1953, description: "Verschwörungstheorie über staatliche Programme zur künstlichen Kontrolle von Wetterphänomenen." }
    ]
  },
  {
    id: 2,
    title: "Geheimgesellschaften",
    description: "Theorien über angebliche geheime Organisationen, die im Verborgenen die Weltgeschicke lenken.",
    topics: [
      { id: 201, title: "Illuminati", year: 1776, description: "Behauptungen über eine geheime Elite, die im Verborgenen die Weltpolitik steuert." },
      { id: 202, title: "Freimaurer", year: 1717, description: "Verschwörungstheorien über den angeblichen globalen Einfluss der Freimaurerlogen." },
      { id: 203, title: "Bilderberg-Gruppe", year: 1954, description: "Theorie über einen angeblichen geheimen Weltrat aus Wirtschafts- und Politikeliten." }
    ]
  },
  {
    id: 3,
    title: "Technologie-Verschwörungen",
    description: "Verschwörungstheorien im Zusammenhang mit modernen Technologien und deren angeblichen versteckten Zwecken.",
    topics: [
      { id: 301, title: "5G und Gesundheit", year: 2018, description: "Verschwörungstheorie über angebliche gesundheitsschädliche Wirkungen von 5G-Mobilfunktechnologie." },
      { id: 302, title: "RFID-Chips", year: 2005, description: "Behauptungen über Pläne zur Zwangsimplantierung von Funkchips zur Überwachung der Bevölkerung." },
      { id: 303, title: "Künstliche Intelligenz", year: 2010, description: "Theorien über KI-Systeme, die angeblich heimlich die Kontrolle übernehmen sollen." }
    ]
  },
  {
    id: 4,
    title: "Politische Verschwörungen",
    description: "Verschwörungstheorien zu angeblichen geheimen politischen Machenschaften und Manipulationen.",
    topics: [
      { id: 401, title: "Deep State", year: 1960, description: "Theorie über einen angeblichen 'Staat im Staate', der unabhängig von demokratischen Prozessen agiert." },
      { id: 402, title: "Wahlmanipulation", year: 1876, description: "Verschwörungstheorien über systematische Wahlfälschungen in demokratischen Staaten." },
      { id: 403, title: "False Flag Operationen", year: 1898, description: "Behauptungen, dass Regierungen heimlich Terroranschläge inszenieren, um politische Ziele zu erreichen." }
    ]
  }
];

const Categories: React.FC = () => {
  const { toast } = useToast();
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  
  // Simulierte Ladezustand für Demo-Zwecke
  const [isLoading, setIsLoading] = useState(false);
  
  const handleNewCategoryClick = () => {
    setShowNewCategoryModal(true);
  };
  
  const handleSubmitNewCategory = () => {
    toast({
      title: "Kategorie erstellt",
      description: `'${newCategoryName}' wurde erfolgreich erstellt.`,
      duration: 3000,
    });
    
    // Formular zurücksetzen
    setNewCategoryName('');
    setNewCategoryDescription('');
    setShowNewCategoryModal(false);
  };

  const renderTruthIndicator = (id: number) => {
    // Einfache Logik zur Bestimmung des Wahrheitsindikators basierend auf ID
    if (id % 4 === 0) return { icon: fireLvl1, text: "Bestätigt", className: "bg-green-900/30 border-green-500/30" };
    if (id % 4 === 1) return { icon: fireLvl3, text: "Umstritten", className: "bg-yellow-900/30 border-yellow-500/30" };
    if (id % 4 === 2) return { icon: fireLvl5, text: "Unbestätigt", className: "bg-orange-900/30 border-orange-500/30" };
    return { icon: fireLvl8, text: "Widerlegt", className: "bg-red-900/30 border-red-500/30" };
  };

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">Verschwörungskategorien</h1>
          <Button 
            onClick={handleNewCategoryClick}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/30 shadow-md"
          >
            <img src={categoryIcon} alt="New" className="w-5 h-5 mr-2" />
            Neue Kategorie
          </Button>
        </div>
        <p className="text-gray-300 mb-6">
          Hier findest du eine Übersicht aller Verschwörungskategorien in unserer Datenbank, jede mit ihren zugehörigen Theorien.
        </p>
        
        {/* Info Box */}
        <div className="bg-gray-800/70 p-5 rounded-lg mb-10 border border-cyan-500/20 backdrop-blur-sm">
          <div className="flex items-start">
            <img src={infoIcon} alt="Info" className="w-6 h-6 text-cyan-400 mr-3 mt-1" />
            <div>
              <h3 className="font-medium mb-2 text-cyan-400">Hinweis zur Navigation</h3>
              <p className="text-gray-300">
                Klicke auf eine Kategorie, um alle zugehörigen Verschwörungstheorien zu sehen. 
                Jede Theorie wird mit einer Wahrheitsindikation gekennzeichnet, die auf umfangreicher Recherche basiert.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))
        ) : (
          verschwörungsKategorien.map((category) => (
            <motion.div
              key={category.id}
              className="bg-gray-800/70 rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg backdrop-blur-sm flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: category.id * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(6, 182, 212, 0.3)" }}
            >
              <div className="h-48 overflow-hidden relative">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
                    <span className="material-icons text-6xl text-gray-500">category</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{category.title}</h2>
              </div>
              
              <div className="p-4 flex-grow">
                <p className="text-gray-300 mb-4">{category.description}</p>
                
                <h3 className="text-lg font-semibold mb-3 text-white">Beispielthemen:</h3>
                <ul className="space-y-2">
                  {category.topics.slice(0, 3).map((topic) => (
                    <li key={topic.id} className="flex items-start">
                      <span className="bg-gray-700 p-1 rounded-full mr-2 mt-0.5">
                        <img 
                          src={renderTruthIndicator(topic.id).icon} 
                          alt="Truth Level" 
                          className="w-4 h-4" 
                        />
                      </span>
                      <div>
                        <span className="text-white">{topic.title}</span>
                        <span className="text-gray-400 text-sm ml-2">({topic.year})</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link href={`/category/${category.id}`} className="block">
                <Button
                  className="w-full rounded-none bg-gradient-to-r from-cyan-900/50 to-blue-900/50 hover:from-cyan-800/50 hover:to-blue-800/50 text-white border-t border-cyan-500/20"
                >
                  Alle Theorien anzeigen →
                </Button>
              </Link>
            </motion.div>
          ))
        )}
      </div>
      
      {/* New Category Modal */}
      <Dialog open={showNewCategoryModal} onOpenChange={setShowNewCategoryModal}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-gray-900 to-gray-800 border border-cyan-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Neue Kategorie erstellen</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="col-span-3 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="description" className="text-right">
                Beschreibung
              </label>
              <Textarea
                id="description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                className="col-span-3 min-h-[120px] bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowNewCategoryModal(false)}>
              Abbrechen
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmitNewCategory}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/30 shadow-md"
            >
              Kategorie erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
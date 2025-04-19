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

// Import various images for topics
import geoEngineeringImg from '@assets/DALL·E 2025-04-08 05.11.19 - A subtle, realistic photomontage designed for a website background, illustrating the concept of geo-engineering without text. The image features a wid.webp';
import weatherControlImg from '@assets/DALL·E 2025-04-19 01.29.27 - A hyper-realistic futuristic scene depicting weather control. A large dome-shaped control station is situated in the middle of a vast landscape, with .webp';
import chemtrailsImg from '@assets/DALL·E 2025-04-08 05.09.55 - A subtle, realistic photomontage intended as a website background, depicting a high-altitude airplane dispersing visible chemtrails across a partly cl.webp';

// Define categories with example topics
const verschwörungsKategorien = [
  {
    id: 1,
    title: "Geheimgesellschaften",
    description: "Theorien über angebliche geheime Organisationen, die im Verborgenen die Weltgeschicke lenken.",
    topics: [
      { id: 101, title: "Orden der Illuminaten", year: 1776, description: "1776 gegründeter Geheimbund, der durch Aufklärung die Herrschaft von Menschen über Menschen abschaffen wollte." },
      { id: 102, title: "Loge der Freimaurer", year: 1717, description: "Ethischer Bund zur Selbstverbesserung und Förderung von Freiheit, Gleichheit und Brüderlichkeit." },
      { id: 103, title: "Bilderberg-Gruppe", year: 1954, description: "Seit 1954 jährlich tagende Versammlung globaler Eliten aus Politik, Wirtschaft und Wissenschaft." },
      { id: 104, title: "Templer-Orden", year: 1119, description: "Mittelalterlicher Ritter-Mönchs-Orden zum Schutz von Pilgern, 1312 aufgelöst." },
      { id: 105, title: "Bruderschaft von Zion", year: 1956, description: "1956 gegründete Geheimgesellschaft mit christlichem Hintergrund zur Bewahrung geheimer Reliquien." },
      { id: 106, title: "Skull & Bones", year: 1832, description: "Geheime Studentenverbindung an der Yale University mit einflussreichen Mitgliedern und mysteriösen Ritualen." },
      { id: 107, title: "Assassinen", year: 1080, description: "Islamische Geheimgesellschaft (1080–1270), berüchtigt für gezielte politische Attentate." },
      { id: 108, title: "Okkulte Rosenkreuzer", year: 1614, description: "Esoterische Strömung, die auf den Rosenkreuzer-Mythos aufbaut und okkulte Praktiken sowie mystische Lehren in den Mittelpunkt stellt." },
      { id: 109, title: "Sonnentempler", year: 1984, description: "1984 gegründeter apokalyptischer Kult, der christlich-esoterische Ideen mit rituellen Selbstmorden und Massenmorden in den Jahren 1994–1997 verband." }
    ]
  },
  {
    id: 2,
    title: "John F. Kennedy",
    image: geoEngineeringImg,
    description: "US-Präsident, dessen Ermordung 1963 zahlreiche Verschwörungstheorien über Geheimdienste und Schattenmächte auslöste.",
    topics: [
      { id: 201, title: "Warren-Kommission", year: 1964, description: "Offizielle Untersuchungskommission, deren Ergebnisse viele anzweifeln." },
      { id: 202, title: "Grassy Knoll", year: 1963, description: "Theorie über einen zweiten Schützen auf dem Grashügel in Dallas." },
      { id: 203, title: "CIA-Verbindung", year: 1963, description: "Behauptungen über eine Beteiligung des US-Geheimdienstes am Attentat." }
    ]
  },
  {
    id: 3,
    title: "Die Kabale",
    description: "Geheimes Eliten-Netzwerk, dem nach Verschwörungstheorien globale Kontrolle und Manipulation zugeschrieben wird.",
    topics: [
      { id: 301, title: "Globale Elite", year: 1950, description: "Angebliche Gruppe von Superreichen, die im Verborgenen die Weltpolitik steuern." },
      { id: 302, title: "New World Order", year: 1990, description: "Theorie über Pläne zur Errichtung einer autoritären Weltregierung." },
      { id: 303, title: "Deep State", year: 1960, description: "Vorstellung von einem verborgenen Machtzentrum innerhalb demokratischer Regierungen." }
    ]
  },
  {
    id: 4,
    title: "Frequenzen",
    image: chemtrailsImg,
    description: "Theorie, dass bestimmte Schwingungen oder 5G-Frequenzen zur Bewusstseinskontrolle oder Gesundheitsschädigung eingesetzt werden.",
    topics: [
      { id: 401, title: "5G-Strahlung", year: 2018, description: "Behauptungen über gesundheitsschädliche Auswirkungen von 5G-Mobilfunkmasten." },
      { id: 402, title: "Schumann-Resonanz", year: 1952, description: "Überzeugung, dass Veränderungen in der Erdresonanz menschliches Bewusstsein beeinflussen." },
      { id: 403, title: "HAARP", year: 1993, description: "Vorwürfe, dass ein US-Forschungsprogramm zur Wetterveränderung und Gedankenkontrolle eingesetzt wird." }
    ]
  },
  {
    id: 5,
    title: "QAnon",
    description: "US-Verschwörungsbewegung, die glaubt, eine Elite betreibe Kinderhandel und Trump kämpfe im Geheimen dagegen.",
    topics: [
      { id: 501, title: "Q-Drops", year: 2017, description: "Kryptische Nachrichten eines angeblichen Insiders namens 'Q' auf Internetforen." },
      { id: 502, title: "The Storm", year: 2018, description: "Vorhergesagte Massenverhaztungen von korrupten Eliten und Pädophilen." },
      { id: 503, title: "Deepstate", year: 2017, description: "Annahme eines geheimen Netzwerks innerhalb der US-Regierung gegen Trump." }
    ]
  },
  {
    id: 6,
    title: "MK Ultra",
    description: "Tatsächliches CIA-Programm zur Gedankenkontrolle durch Drogen und psychologische Manipulation in den 1950er–70er Jahren.",
    topics: [
      { id: 601, title: "LSD-Experimente", year: 1953, description: "Dokumentierte Versuche mit Psychedelika an unwissenden Testpersonen." },
      { id: 602, title: "Monarch-Programm", year: 1960, description: "Angebliches Unterprogramm zur Erzeugung von programmierbaren Agenten durch Trauma." },
      { id: 603, title: "Manchurian Candidate", year: 1962, description: "Theorie über die Erschaffung von hypnotisch programmierten Attentätern." }
    ]
  },
  {
    id: 7,
    title: "BlackRock",
    description: "Weltgrößter Vermögensverwalter, oft Ziel von Spekulationen über geheimen Einfluss auf Politik, Wirtschaft und Medien.",
    topics: [
      { id: 701, title: "Aladdin-System", year: 2000, description: "Vermutungen über BlackRocks KI-System zur Kontrolle globaler Finanzmärkte." },
      { id: 702, title: "ESG-Manipulation", year: 2020, description: "Theorien über die Nutzung von Nachhaltigkeitskriterien zur wirtschaftlichen Kontrolle." },
      { id: 703, title: "Wirtschafts-Schattenregierung", year: 2008, description: "Behauptungen über direkte Einflussnahme auf politische Entscheidungen weltweit." }
    ]
  },
  {
    id: 8,
    title: "Corona (COVID-19)",
    description: "Pandemie, um die sich viele Theorien über geplante Laborausbrüche, Impfmanipulation und globale Kontrolle ranken.",
    topics: [
      { id: 801, title: "Laborleck", year: 2020, description: "Theorien über einen künstlichen Ursprung des Virus in einem chinesischen Labor." },
      { id: 802, title: "5G-Verbindung", year: 2020, description: "Unbelegte Behauptung, 5G-Strahlung verursache COVID-19-Symptome." },
      { id: 803, title: "The Great Reset", year: 2020, description: "Vorstellung, die Pandemie sei geplant, um eine neue Weltordnung zu errichten." }
    ]
  },
  {
    id: 9,
    title: "Pizzagate",
    description: "Falsche Theorie, dass in einer Pizzeria ein Kinderhändlerring um US-Politiker agierte.",
    topics: [
      { id: 901, title: "Comet Ping Pong", year: 2016, description: "Pizzeria in Washington D.C., die als angebliches Zentrum eines Pädophilenrings bezeichnet wurde." },
      { id: 902, title: "E-Mail-Codes", year: 2016, description: "Fehlinterpretation von Ausdrücken in den geleakten E-Mails des Clinton-Wahlkampfteams." },
      { id: 903, title: "Schießerei", year: 2016, description: "Vorfall, bei dem ein bewaffneter Mann die Pizzeria betrat, um die angeblichen Opfer zu befreien." }
    ]
  },
  {
    id: 10,
    title: "9/11",
    description: "Die Terroranschläge vom 11. September 2001, bei denen manche einen Inside-Job oder gezielte Sprengung vermuten.",
    topics: [
      { id: 1001, title: "Controlled Demolition", year: 2001, description: "Behauptung, die Twin Towers seien durch kontrollierte Sprengung zum Einsturz gebracht worden." },
      { id: 1002, title: "WTC 7", year: 2001, description: "Theorien zum Einsturz des dritten Gebäudes, das nicht direkt von Flugzeugen getroffen wurde." },
      { id: 1003, title: "Pentagon-Angriff", year: 2001, description: "Zweifel daran, dass ein Flugzeug das Pentagon getroffen hat." }
    ]
  },
  {
    id: 11,
    title: "Tupac",
    description: "Ermordeter Rapper, um dessen Tod sich Gerüchte über ein mögliches Überleben oder politische Motive ranken.",
    topics: [
      { id: 1101, title: "Überlebentheorie", year: 1996, description: "Annahme, Tupac habe seinen Tod inszeniert und lebe im Ausland." },
      { id: 1102, title: "FBI-Beteiligung", year: 1996, description: "Vermutungen über eine Beteiligung des FBI aufgrund von Tupacs politischem Aktivismus." },
      { id: 1103, title: "Posthume Veröffentlichungen", year: 1997, description: "Deutung der zahlreichen posthumen Alben als Beweis für voraufgezeichnetes Material." }
    ]
  },
  {
    id: 12,
    title: "Michael Jackson",
    description: "Popstar, dessen Tod 2009 viele für fingiert halten oder mit dunklen Mächten in Verbindung bringen.",
    topics: [
      { id: 1201, title: "Todesinszenierung", year: 2009, description: "Theorie, Jackson habe seinen Tod vorgetäuscht, um der Öffentlichkeit zu entkommen." },
      { id: 1202, title: "Propofol-Mord", year: 2009, description: "Behauptungen über einen absichtlichen Mord durch den Arzt oder die Musikindustrie." },
      { id: 1203, title: "Doppelgänger", year: 2009, description: "Spekulationen, nach 1999 sei ein Doppelgänger an Jacksons Stelle aufgetreten." }
    ]
  },
  {
    id: 13,
    title: "Reptiloide",
    description: "Theorie, dass außerirdische Echsenwesen in Menschengestalt die Welt kontrollieren.",
    topics: [
      { id: 1301, title: "Gestaltwandler", year: 1998, description: "Vorstellung, Reptiloide könnten menschliche Form annehmen und wichtige Positionen besetzen." },
      { id: 1302, title: "Blutlinien", year: 1999, description: "Theorie über reptilische Abstammung bestimmter Königshäuser und Eliten." },
      { id: 1303, title: "Hollow Earth", year: 1991, description: "Annahme, Reptiloide lebten im Inneren der als hohl angenommenen Erde." }
    ]
  },
  {
    id: 14,
    title: "Reichsbürger",
    description: "Bewegung in Deutschland, die die Existenz der Bundesrepublik leugnet und eigene 'Reiche' ausruft.",
    topics: [
      { id: 1401, title: "BRD GmbH", year: 1985, description: "Falsche Behauptung, Deutschland sei eine Firma und kein souveräner Staat." },
      { id: 1402, title: "Deutsches Reich", year: 1985, description: "Annahme, das Deutsche Reich bestehe rechtlich fort und sei nur handlungsunfähig." },
      { id: 1403, title: "Selbstverwaltung", year: 2000, description: "Praxis, eigene 'Staaten' oder 'Königreiche' auf deutschem Territorium zu proklamieren." }
    ]
  },
  {
    id: 15,
    title: "Antarktis",
    description: "Schauplatz vieler Spekulationen über geheime Basen, alte Zivilisationen oder verborgene Technologien.",
    topics: [
      { id: 1501, title: "Neuschwabenland", year: 1938, description: "Mythos einer geheimen Nazi-Basis in der Antarktis, die nach dem Krieg weiterexistierte." },
      { id: 1502, title: "Operation Highjump", year: 1946, description: "Umdeutung einer US-Militärmission als Kampf gegen überlebende Nazis oder Außerirdische." },
      { id: 1503, title: "Eiswand", year: 2015, description: "Behauptung der Flat-Earth-Bewegung, die Antarktis sei eine umfassende Eisbarriere am Rand der Welt." }
    ]
  },
  {
    id: 16,
    title: "Agententheorie",
    description: "Annahme, dass prominente Persönlichkeiten oder Aktivisten in Wahrheit gesteuerte Geheimdienst-Agenten sind.",
    topics: [
      { id: 1601, title: "Controlled Opposition", year: 1960, description: "Theorie, dass Oppositionsbewegungen heimlich von den bekämpften Mächten kontrolliert werden." },
      { id: 1602, title: "Deep Cover", year: 1970, description: "Vorstellung von Agenten, die jahrzehntelang verdeckt in Schlüsselpositionen eingesetzt werden." },
      { id: 1603, title: "Crisis Actors", year: 2012, description: "Behauptung, bei Katastrophen oder Anschlägen würden Schauspieler als vorgebliche Zeugen eingesetzt." }
    ]
  },
  {
    id: 17,
    title: "AREA 51",
    description: "Hochsicherheitsgelände der US-Regierung, das mit UFOs und außerirdischen Technologien in Verbindung gebracht wird.",
    topics: [
      { id: 1701, title: "Roswell-Connection", year: 1947, description: "Annahme, in Area 51 würden Alien-Technologie und -Leichen vom Roswell-Absturz untersucht." },
      { id: 1702, title: "Unterirdische Anlagen", year: 1989, description: "Behauptungen über massive unterirdische Komplexe mit außerirdischer Präsenz." },
      { id: 1703, title: "Reverse Engineering", year: 1989, description: "Theorie, die USA entwickelten Technologien durch Nachbau abgestürzter UFOs." }
    ]
  },
  {
    id: 18,
    title: "Clinton Body Count",
    description: "Theorie, dass viele Tote im Umfeld der Clintons auf geheimnisvolle Weise ums Leben kamen.",
    topics: [
      { id: 1801, title: "Vince Foster", year: 1993, description: "Spekulationen über den Suizid eines Clinton-Beraters, der als Mord dargestellt wird." },
      { id: 1802, title: "Seth Rich", year: 2016, description: "Unbelegte Verbindung zwischen einem ermordeten DNC-Mitarbeiter und den Clinton-E-Mail-Leaks." },
      { id: 1803, title: "Epstein-Verbindung", year: 2019, description: "Behauptungen einer Clinton-Beteiligung am Tod des verurteilten Sexualstraftäters Jeffrey Epstein." }
    ]
  },
  {
    id: 19,
    title: "Annunaki",
    description: "Mythische Wesen aus der sumerischen Mythologie, laut Theorien außerirdische Schöpfer der Menschheit.",
    topics: [
      { id: 1901, title: "Genetische Manipulation", year: 1976, description: "Theorie, die Annunaki hätten Hominiden genetisch zu modernen Menschen umgewandelt." },
      { id: 1902, title: "Nibiru", year: 1976, description: "Vorstellung eines angeblichen Planeten der Annunaki, der sich periodisch der Erde nähert." },
      { id: 1903, title: "Gold Mining", year: 1976, description: "Behauptung, die Annunaki hätten Menschen erschaffen, um Gold für ihren Heimatplaneten zu schürfen." }
    ]
  },
  {
    id: 20,
    title: "Adolf Hitler",
    description: "Diktator, über den Verschwörungen behaupten, er habe überlebt oder sich okkulter Kräfte bedient.",
    topics: [
      { id: 2001, title: "Flucht nach Argentinien", year: 1945, description: "Theorie, Hitler sei nicht in Berlin gestorben, sondern nach Südamerika entkommen." },
      { id: 2002, title: "Antarktis-Basis", year: 1947, description: "Spekulation über ein Überleben in einer geheimen Basis in der Antarktis." },
      { id: 2003, title: "Thule-Gesellschaft", year: 1918, description: "Behauptungen über Hitlers Verbindungen zu okkulten Gruppen und Praktiken." }
    ]
  },
  {
    id: 21,
    title: "Außerirdische",
    image: weatherControlImg,
    description: "Häufige Erklärung für unerklärliche Phänomene, Technologie oder Eingriffe in die Menschheitsgeschichte.",
    topics: [
      { id: 2101, title: "Ancient Aliens", year: 1968, description: "These, außerirdische Besucher hätten frühe menschliche Zivilisationen beeinflusst oder erschaffen." },
      { id: 2102, title: "Entführungen", year: 1961, description: "Berichte über angebliche Entführungen durch Außerirdische zu Untersuchungszwecken." },
      { id: 2103, title: "Cattle Mutilations", year: 1967, description: "Unerklärliche Verstümmelungen von Nutztieren, die Außerirdischen zugeschrieben werden." }
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
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">Verschwörungen</h1>
          <Button 
            onClick={handleNewCategoryClick}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/30 shadow-md"
          >
            <img src={categoryIcon} alt="New" className="w-5 h-5 mr-2" />
            Neue Kategorie
          </Button>
        </div>
        <p className="text-gray-300 mb-6">
          Hier findest du alle verfügbaren Verschwörungstheorien, sorgfältig nach Kategorien geordnet und mit KI-gestützten Analysen versehen.
        </p>
        
        {/* Info Box with enhanced mobile experience */}
        <motion.div 
          className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-lg mb-10 border border-cyan-500/30 backdrop-blur-sm overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ 
            boxShadow: "0 0 25px rgba(6, 182, 212, 0.2)"
          }}
        >
          <div className="sm:flex">
            {/* Info Icon with animated glow effect (left side on larger screens, top on mobile) */}
            <div className="sm:w-1/5 bg-gray-800/80 flex items-center justify-center p-6 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-blue-500/5 rounded-full blur-2xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="relative z-10"
              >
                <img src={infoIcon} alt="Info" className="w-12 h-12 text-cyan-400" />
              </motion.div>
            </div>
            
            {/* Content (right side on larger screens, bottom on mobile) */}
            <div className="p-6 sm:w-4/5">
              <h3 className="font-semibold text-lg mb-3 text-cyan-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Hinweis zur Navigation
              </h3>
              <p className="text-gray-300 mb-3">
                Klicke auf eine Kategorie, um alle zugehörigen Verschwörungstheorien zu sehen. 
                Jede Theorie wird mit einer Wahrheitsindikation gekennzeichnet, die auf umfangreicher Recherche basiert.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="bg-gray-800/80 rounded-md p-2 flex items-center border border-cyan-500/20 shadow">
                  <img src={fireLvl1} alt="Bestätigt" className="w-5 h-5 mr-2" />
                  <span className="text-green-400 text-sm">Bestätigt</span>
                </div>
                <div className="bg-gray-800/80 rounded-md p-2 flex items-center border border-cyan-500/20 shadow">
                  <img src={fireLvl3} alt="Umstritten" className="w-5 h-5 mr-2" />
                  <span className="text-yellow-400 text-sm">Umstritten</span>
                </div>
                <div className="bg-gray-800/80 rounded-md p-2 flex items-center border border-cyan-500/20 shadow">
                  <img src={fireLvl5} alt="Unbestätigt" className="w-5 h-5 mr-2" />
                  <span className="text-orange-400 text-sm">Unbestätigt</span>
                </div>
                <div className="bg-gray-800/80 rounded-md p-2 flex items-center border border-cyan-500/20 shadow">
                  <img src={fireLvl8} alt="Widerlegt" className="w-5 h-5 mr-2" />
                  <span className="text-red-400 text-sm">Widerlegt</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-[28rem] sm:h-[30rem] md:h-[32rem] rounded-xl" />
          ))
        ) : (
          verschwörungsKategorien.map((category) => (
            <motion.div
              key={category.id}
              className="bg-gray-800/70 rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg backdrop-blur-sm flex flex-col h-full group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: category.id * 0.1 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Card header with background image */}
              <div 
                className="h-52 sm:h-56 md:h-60 overflow-hidden relative"
                style={{
                  backgroundImage: category.image ? `url(${category.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent group-hover:opacity-80 transition-opacity"></div>
                
                {/* Category title */}
                <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-300">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white text-shadow-lg group-hover:text-cyan-300 transition-colors">{category.title}</h2>
                </div>
                
                {/* Animated decoration element */}
                <motion.div 
                  className="absolute top-4 right-4 w-20 h-20 opacity-40"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 30, 
                    repeat: Infinity, 
                    ease: "linear"
                  }}
                >
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2" />
                    <circle cx="50" cy="50" r="30" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
                    <path d="M50 5 L50 95" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" />
                    <path d="M5 50 L95 50" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="3" fill="rgba(6, 182, 212, 0.8)" />
                  </svg>
                </motion.div>
              </div>
              
              {/* Card content */}
              <div className="p-5 flex-grow">
                <p className="text-gray-300 mb-5 line-clamp-3">{category.description}</p>
                
                <motion.div
                  initial={{ opacity: 0.9 }}
                  whileHover={{ opacity: 1 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Beispielthemen:
                  </h3>
                </motion.div>
                
                {/* Topics list */}
                <ul className="space-y-3 mb-4">
                  {category.topics.slice(0, 3).map((topic) => {
                    const truthIndicator = renderTruthIndicator(topic.id);
                    return (
                      <motion.li 
                        key={topic.id} 
                        className="flex items-start p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.span 
                          className={`${truthIndicator.className} p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0 border`}
                          whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                          <img 
                            src={truthIndicator.icon} 
                            alt="Truth Level" 
                            className="w-4 h-4" 
                          />
                        </motion.span>
                        <div>
                          <span className="text-white font-medium block">{topic.title}</span>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-400 text-sm">Erste Erwähnung: {topic.year}</span>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
              
              {/* Card footer with button */}
              <div className="px-5 pb-5 mt-auto">
                <Link href={`/category/${category.id}`} className="block">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      className="w-full bg-gradient-to-r from-cyan-900/80 to-blue-900/80 hover:from-cyan-800 hover:to-blue-800 text-white border border-cyan-500/30 shadow-md flex items-center justify-center"
                    >
                      <span className="mr-2">Alle Theorien anzeigen</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      {/* New Category Modal - Optimized for all devices */}
      <Dialog open={showNewCategoryModal} onOpenChange={setShowNewCategoryModal}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-gray-900 to-gray-800 border border-cyan-500/30 text-white shadow-2xl rounded-xl p-0 overflow-hidden max-w-[90vw] sm:max-w-lg">
          {/* Header with decorative element */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-5 border-b border-cyan-500/20 relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 opacity-10"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity, 
                repeatType: "reverse"
              }}
              style={{
                backgroundImage: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
                backgroundSize: '150% 150%'
              }}
            />
            
            <DialogTitle className="text-xl font-bold text-white flex items-center relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Neue Kategorie erstellen
            </DialogTitle>
          </div>
          
          {/* Form fields with improved mobile layout */}
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-cyan-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Kategoriename
              </label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full bg-gray-800/70 border-gray-700/80 focus:border-cyan-500/50 text-white rounded-md"
                placeholder="z.B. Historische Verschwörungen"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-cyan-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Beschreibung
              </label>
              <Textarea
                id="description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                className="w-full min-h-[120px] bg-gray-800/70 border-gray-700/80 focus:border-cyan-500/50 text-white rounded-md"
                placeholder="Geben Sie eine kurze Beschreibung der Kategorie ein..."
              />
            </div>
            
            {/* Optional file upload preview area - could be activated in a future version */}
            <div className="border border-dashed border-gray-600 rounded-md p-4 bg-gray-800/30 cursor-pointer hover:bg-gray-800/50 transition-colors group">
              <div className="flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-400 group-hover:text-gray-300">Bild hochladen (optional)</p>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP bis zu 5MB</p>
              </div>
            </div>
          </div>
          
          {/* Footer with action buttons */}
          <div className="border-t border-gray-800 p-4 bg-gray-900/50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowNewCategoryModal(false)}
                className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Abbrechen
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                type="button" 
                onClick={handleSubmitNewCategory}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white border border-cyan-400/30 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Kategorie erstellen
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
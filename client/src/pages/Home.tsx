import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogle } from '@/lib/firebase';

const Home: React.FC = () => {
  const { toast } = useToast();

  // Handle sign in with Google
  const handleSignIn = async () => {
    try {
      // For demonstration without actual Firebase keys
      toast({
        title: "Firebase-Integration",
        description: "Die Firebase-Authentifizierung würde hier funktionieren, wenn die API-Schlüssel konfiguriert wären.",
        duration: 3000,
      });
      
      // Uncomment this when Firebase keys are provided
      /*
      const user = await signInWithGoogle();
      if (user) {
        toast({
          title: "Erfolgreich angemeldet",
          description: `Willkommen, ${user.displayName || 'Benutzer'}!`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Anmeldung fehlgeschlagen",
          description: "Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      }
      */
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Fehler bei der Anmeldung",
        description: "Es gab ein Problem mit der Firebase-Authentifizierung.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Willkommen zum KI-gestützten Analyse-Forum</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
          Ein Ort für kritische Betrachtung und fundierte Diskussion über Verschwörungstheorien
          mit Unterstützung moderner KI-Technologie.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <span className="material-icons text-4xl text-primary-600 mb-4">psychology_alt</span>
          <h2 className="text-2xl font-bold mb-3">Kritische Analyse</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Verschwörungstheorien werden hier mit einem wissenschaftlichen, 
            skeptischen Ansatz betrachtet. Jedes Thema wird ausführlich, 
            ehrlich und mit echtem menschlichen Verstand angegangen.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <span className="material-icons text-4xl text-primary-600 mb-4">smart_toy</span>
          <h2 className="text-2xl font-bold mb-3">KI-Unterstützung</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Multiple AI-Systeme (OpenAI, Perplexity, Anthropic) helfen bei der 
            Analyse, Kontextualisierung und Faktenprüfung aller Beiträge und Theorien.
          </p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-primary-600 to-blue-500 rounded-2xl p-8 text-white mb-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl font-bold mb-3">Starten Sie noch heute</h2>
            <p className="mb-4">Melden Sie sich an und beginnen Sie Ihre Erkundung historischer und moderner Verschwörungstheorien.</p>
            <Button
              onClick={handleSignIn}
              className="bg-white text-primary-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Anmeldung
            </Button>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl flex-1">
            <h3 className="text-lg font-semibold mb-3">Features:</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="material-icons mr-2 text-sm">check_circle</span>
                Historische Chronologie vom 18. bis 21. Jahrhundert
              </li>
              <li className="flex items-center">
                <span className="material-icons mr-2 text-sm">check_circle</span>
                KI-gestützte Echtheitsprüfung von Informationen
              </li>
              <li className="flex items-center">
                <span className="material-icons mr-2 text-sm">check_circle</span>
                Interaktive Visualisierungen und Zeitlinien
              </li>
              <li className="flex items-center">
                <span className="material-icons mr-2 text-sm">check_circle</span>
                Community-basierte Diskussionen mit KI-Moderation
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Technische Integration</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <span className="material-icons text-2xl text-gray-500 mb-2 dark:text-gray-400">cloud</span>
            <h3 className="font-semibold mb-1">Google Drive & Sheets</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">Daten synchronisieren und speichern</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <span className="material-icons text-2xl text-gray-500 mb-2 dark:text-gray-400">event</span>
            <h3 className="font-semibold mb-1">Google Calendar</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">Ereignisse und Zeitleisten</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <span className="material-icons text-2xl text-gray-500 mb-2 dark:text-gray-400">folder_shared</span>
            <h3 className="font-semibold mb-1">Dropbox</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">Zusätzlicher Dokumentenspeicher</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <span className="material-icons text-2xl text-gray-500 mb-2 dark:text-gray-400">chat</span>
            <h3 className="font-semibold mb-1">OpenAI</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">KI-gestützte Konversation</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <span className="material-icons text-2xl text-gray-500 mb-2 dark:text-gray-400">table_chart</span>
            <h3 className="font-semibold mb-1">Airtable</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">Strukturierte Datenverwaltung</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <span className="material-icons text-2xl text-gray-500 mb-2 dark:text-gray-400">security</span>
            <h3 className="font-semibold mb-1">Firebase</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">Benutzerauthentifizierung</p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Link href="/conspiracy-theories">
          <Button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Theorien erkunden
            <span className="material-icons ml-2">arrow_forward</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

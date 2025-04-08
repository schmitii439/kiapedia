import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState, createContext } from "react";

// Pages
import Home from "@/pages/Home";
import ConspiracyTheories from "@/pages/ConspiracyTheories";
import TopicDetail from "@/pages/TopicDetail";
import Categories from "@/pages/Categories";
import CategoryDetail from "@/pages/CategoryDetail";
import NotFound from "@/pages/not-found";

// Layout
import MainLayout from "@/layouts/MainLayout";

// Define context for user authentication
interface AuthContextType {
  userId: number | null;
  username: string | null;
  setUser: (userId: number | null, username: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  userId: null,
  username: null,
  setUser: () => {},
});

function App() {
  const [location, setLocation] = useLocation();
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // Set user function for context
  const setUser = (userId: number | null, username: string | null) => {
    setUserId(userId);
    setUsername(username);
  };

  useEffect(() => {
    // Set page title based on current route
    let title = "VeriForum - ";
    if (location === "/") {
      title += "KI-gestütztes Forum für Verschwörungstheorien";
    } else if (location.startsWith("/conspiracy-theories")) {
      title += "Verschwörungstheorien im Kontext";
    } else if (location.startsWith("/topic/")) {
      title += "Theorie Details";
    } else if (location.startsWith("/categories")) {
      title += "Verschwörungskategorien";
    } else if (location.startsWith("/category/")) {
      title += "Kategorie Details";
    } else {
      title += "Seite nicht gefunden";
    }
    document.title = title;
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ userId, username, setUser }}>
        <MainLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/conspiracy-theories" component={ConspiracyTheories} />
            <Route path="/topic/:id" component={TopicDetail} />
            <Route path="/categories" component={Categories} />
            <Route path="/category/:id" component={CategoryDetail} />
            <Route component={NotFound} />
          </Switch>
        </MainLayout>
        <Toaster />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default App;

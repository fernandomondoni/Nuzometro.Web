import { useState, useEffect } from "react";
import { LoginScreen } from "./pages/LoginScreen/LoginScreen";
import { HomeScreen } from "./pages/HomeScreen/HomeScreen";
import { CounterScreen } from "./pages/CounterScreen/CounterScreen";
import { ReportsScreen } from "./pages/ReportsScreen/ReportsScreen";
import { SettingsScreen } from "./pages/SettingsScreen/SettingsScreen";
import { BottomNavigation } from "./pages/BottomNavigation/BottomNavigation";

import "@radix-ui/themes/styles.css";

interface User {
  username: string;
  isLoggedIn: boolean;
}

function App() {
  const [user, setUser] = useState<User>({ username: "", isLoggedIn: false });
  const [currentScreen, setCurrentScreen] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    } catch {
      console.warn("Não foi possível salvar as preferências de tema");
    }

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleLogin = (username: string, password: string) => {
    if (username.trim() && password.trim()) {
      setUser({ username, isLoggedIn: true });
      setCurrentScreen("home");
    } else {
      alert("Por favor, preencha todos os campos");
    }
  };

  const handleSignUp = (username: string, password: string) => {
    if (username.trim() && password.trim()) {
      setUser({ username, isLoggedIn: true });
      setCurrentScreen("home");
      alert("Conta criada com sucesso!");
    } else {
      alert("Por favor, preencha todos os campos");
    }
  };

  const handleLogout = () => {
    setUser({ username: "", isLoggedIn: false });
    setCurrentScreen("home");
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setIsDarkMode(enabled);
  };

  if (!user.isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen onNavigate={handleNavigate} username={user.username} />
        );
      case "counter":
        return (
          <CounterScreen username={user.username} onLogout={handleLogout} />
        );
      case "reports":
        return <ReportsScreen username={user.username} />;
      case "settings":
        return (
          <SettingsScreen
            username={user.username}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            onDarkModeToggle={handleDarkModeToggle}
          />
        );
      case "events":
        return (
          <HomeScreen onNavigate={handleNavigate} username={user.username} />
        );
      default:
        return (
          <HomeScreen onNavigate={handleNavigate} username={user.username} />
        );
    }
  };

  return (
    <div
      className={`min-h-screen bg-background transition-colors duration-300 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      {renderScreen()}
      {user.isLoggedIn && (
        <BottomNavigation
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;

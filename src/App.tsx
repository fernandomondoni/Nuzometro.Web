import { useState, useEffect, useRef } from "react";
import { LoginScreen } from "./pages/LoginScreen/LoginScreen";
import { HomeScreen } from "./pages/HomeScreen/HomeScreen";
import { CounterScreen } from "./pages/CounterScreen/CounterScreen";
import { ReportsScreen } from "./pages/ReportsScreen/ReportsScreen";
import { SettingsScreen } from "./pages/SettingsScreen/SettingsScreen";
import { BottomNavigation } from "./pages/BottomNavigation/BottomNavigation";
import { login } from "./services/authService";
import { signUp } from "./services/userService";

import "@radix-ui/themes/styles.css";

interface User {
  username: string;
  isLoggedIn: boolean;
}

function App() {
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [user, setUser] = useState<User>(() => {
    const accessToken = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    if (accessToken && username) {
      return { username, isLoggedIn: true };
    }
    return { username: "", isLoggedIn: false };
  });
  const [currentScreen, setCurrentScreen] = useState("home");
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      console.error("Error saving dark mode preference:", error);
    }
  }, [isDarkMode]);

  useEffect(() => {
    const checkTokens = () => {
      const accessToken = localStorage.getItem("access_token");
      const username = localStorage.getItem("username");

      if (user.isLoggedIn && (!accessToken || !username)) {
        setUser({ username: "", isLoggedIn: false });
        setCurrentScreen("home");
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "username") {
        checkTokens();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(checkTokens, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [user.isLoggedIn]);

  useEffect(() => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    if (error) {
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
        errorTimeoutRef.current = null;
      }, 5000);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = null;
      }
    };
  }, [error]);

  const clearError = () => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
    setError(null);
  };

  const handleLogin = async (username: string, password: string) => {
    if (!username.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const result = await login({ username, password });

      clearError();
      setIsTransitioning(true);

      setTimeout(() => {
        setUser({ username: result.username, isLoggedIn: true });
        setCurrentScreen("home");
        setIsTransitioning(false);
      }, 300);
    } catch (err: any) {
      const errorMessage =
        err.message || "Erro no login. Verifique suas credenciais.";
      console.error("Login error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (
    username: string,
    password: string,
    inviteCode?: string
  ) => {
    if (!username.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (inviteCode !== undefined && !inviteCode.trim()) {
      setError("Por favor, preencha o código de convite");
      return;
    }

    setLoading(true);

    try {
      await signUp({ username, password, inviteCode });
      clearError();

      const result = await login({ username, password });
      setIsTransitioning(true);

      setTimeout(() => {
        setUser({ username: result.username, isLoggedIn: true });
        setCurrentScreen("home");
        setIsTransitioning(false);
      }, 300);
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao criar conta ou fazer login.";
      console.error("SignUp/Login error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");

    if (error) {
      clearError();
    }
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setIsDarkMode(enabled);
  };

  if (!user.isLoggedIn) {
    return (
      <div
        className={`transition-all duration-500 ease-in-out ${
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <LoginScreen
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
      case "events":
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            username={user.username}
            onLogout={handleLogout}
          />
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
      default:
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            username={user.username}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen bg-background transition-all duration-500 ease-in-out ${
        isDarkMode ? "dark" : ""
      } ${
        isTransitioning
          ? "opacity-0 scale-95"
          : "opacity-100 scale-100 animate-in slide-in-from-bottom-3"
      }`}
    >
      <div className="transition-all duration-300 ease-in-out">
        {renderScreen()}
      </div>
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

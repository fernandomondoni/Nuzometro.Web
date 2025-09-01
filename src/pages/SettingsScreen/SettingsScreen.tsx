import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/Card/Card";
import { Switch } from "../../components/Switch/Switch";
import { Button } from "../../components/Button/Button";
import { Logo } from "../../components/Logo/Logo";
import { Icons } from "../../components/Icons/Icons";

interface SettingsScreenProps {
  username: string;
  onLogout: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: (enabled: boolean) => void;
}

export function SettingsScreen({
  username,
  onLogout,
  isDarkMode,
  onDarkModeToggle,
}: SettingsScreenProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <Logo size="sm" />
          <div>
            <h1>Configurações</h1>
            <p className="opacity-80">Ajustes do sistema</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icons.Settings />
              <span>Preferências</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <Icons.Sound className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p>Som da Urna</p>
                  <p className="text-sm text-muted-foreground">
                    Reproduzir som ao registrar
                  </p>
                </div>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <Icons.Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p>Notificações</p>
                  <p className="text-sm text-muted-foreground">
                    Receber alertas do sistema
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <Icons.Moon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p>Modo Escuro</p>
                  <p className="text-sm text-muted-foreground">
                    Tema escuro da interface
                  </p>
                </div>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={onDarkModeToggle} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icons.User className="w-5 h-5" />
              <span>Conta</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">Usuário Logado</p>
                  <p className="text-sm text-muted-foreground">{username}</p>
                </div>
              </div>
            </div>

            <Button
              variant="destructive"
              className="w-full transition-transform hover:scale-105"
              onClick={onLogout}
            >
              <Icons.Logout className="w-4 h-4 mr-2" />
              Fazer Logout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sobre o Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">Nuzometro</p>
              <p className="text-xs mt-1">Versão 1.0.0</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

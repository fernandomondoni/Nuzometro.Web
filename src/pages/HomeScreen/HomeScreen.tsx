import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/Card/Card";
import { Logo } from "../../components/Logo/Logo";
import { Icons } from "../../components/Icons/Icons";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  username: string;
}

export function HomeScreen({ onNavigate, username }: HomeScreenProps) {
  const menuOptions = [
    {
      id: "counter",
      title: "Contador",
      description: "Registrar contagem de eventos",
      icon: Icons.Calculator,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      id: "reports",
      title: "Relatórios",
      description: "Ver relatórios e estatísticas",
      icon: Icons.BarChart,
      color:
        "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      id: "events",
      title: "Eventos",
      description: "Gerenciar eventos e shows",
      icon: Icons.Calendar,
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      id: "settings",
      title: "Configurações",
      description: "Ajustes do sistema",
      icon: Icons.Settings,
      color: "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <Logo size="sm" />
          <div>
            <h1>Sistema de Contagem</h1>
            <p className="opacity-80">Bem-vindo, {username}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card
                key={option.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => onNavigate(option.id)}
              >
                <CardHeader className="pb-2">
                  <div
                    className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center mb-2 transition-colors duration-300`}
                  >
                    <IconComponent />
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

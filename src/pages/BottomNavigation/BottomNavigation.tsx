import { Icons } from "../../components/Icons/Icons";

interface BottomNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNavigation({
  currentScreen,
  onNavigate,
}: BottomNavigationProps) {
  const navItems = [
    { id: "home", label: "Início", icon: Icons.Home },
    { id: "counter", label: "Contador", icon: Icons.Calculator },
    { id: "reports", label: "Relatórios", icon: Icons.BarChart },
    { id: "settings", label: "Config", icon: Icons.Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border transition-colors duration-300">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="mb-1">
                <IconComponent />
              </div>
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

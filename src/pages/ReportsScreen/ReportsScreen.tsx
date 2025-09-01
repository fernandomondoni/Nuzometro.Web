import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/Card/Card";
import { Logo } from "../../components/Logo/Logo";
import { Icons } from "../../components/Icons/Icons";

interface ReportsScreenProps {
  username: string;
}

export function ReportsScreen({ username }: ReportsScreenProps) {
  const stats = [
    {
      label: "Total de Registros",
      value: "1,245",
      icon: Icons.BarChart,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Eventos Ativos",
      value: "8",
      icon: Icons.Calendar,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Usuários",
      value: "12",
      icon: Icons.Users,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Crescimento",
      value: "+15%",
      icon: Icons.ArrowUp,
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <Logo size="sm" />
          <div>
            <h1>Relatórios</h1>
            <p className="opacity-80">Dados e estatísticas</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={index}
                className="transition-all duration-300 hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`${stat.color}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Icons.BarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Relatórios detalhados em desenvolvimento</p>
              <p className="text-sm mt-2">
                Em breve você terá acesso a gráficos e análises avançadas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

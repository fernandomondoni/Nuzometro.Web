import React, { useState, useRef } from "react";
import { Button } from "../../components/Button/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/Card/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/Select/Select";
import { Logo } from "../../components/Logo/Logo";
import { Icons } from "../../components/Icons/Icons";
import { Badge } from "../../components/Badge/Badge";

interface CounterScreenProps {
  username: string;
  onLogout: () => void;
}

interface CountRecord {
  id: string;
  event: string;
  user: string;
  date: string;
  time: string;
}

export function CounterScreen({ username, onLogout }: CounterScreenProps) {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [counter, setCounter] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [records, setRecords] = useState<CountRecord[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const events = [
    { value: "show-rock", label: "Show de Rock" },
    { value: "show-pop", label: "Show de Pop" },
    { value: "festival", label: "Festival" },
    { value: "evento-corporativo", label: "Evento Corporativo" },
  ];

  const playUrnaSound = () => {
    if (!isMuted && audioRef.current) {
      audioRef.current.play().catch(() => {
        console.log("Som da urna tocaria aqui");
      });
    }
  };

  const handleCount = () => {
    if (!selectedEvent) {
      alert("Selecione um evento primeiro!");
      return;
    }

    const newCounter = counter + 1;
    setCounter(newCounter);
    playUrnaSound();

    const now = new Date();
    const newRecord: CountRecord = {
      id: Date.now().toString(),
      event:
        events.find((e) => e.value === selectedEvent)?.label || selectedEvent,
      user: username,
      date: now.toLocaleDateString("pt-BR"),
      time: now.toLocaleTimeString("pt-BR"),
    };

    setRecords([newRecord, ...records]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo size="sm" />
            <div>
              <h1>Contador</h1>
              <p className="opacity-80">{username}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors"
          >
            <Icons.Logout className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="p-4 pb-20 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um evento ou show" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.value} value={event.value}>
                    {event.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Total de Registros</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold text-primary">{counter}</div>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleCount}
                size="lg"
                className="flex-1 max-w-xs transition-transform hover:scale-105"
                disabled={!selectedEvent}
              >
                <Icons.Plus className="h-6 w-6 mr-2" />
                Registrar
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsMuted(!isMuted)}
                className="transition-colors"
              >
                {isMuted ? (
                  <Icons.SoundOff className="h-6 w-6" />
                ) : (
                  <Icons.Sound className="h-6 w-6" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {records.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Últimos Registros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {records.slice(0, 10).map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{record.event}</Badge>
                        <span className="text-sm text-muted-foreground">
                          por {record.user}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {record.date} às {record.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <audio ref={audioRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBj2U2+/HeSs="
          type="audio/wav"
        />
      </audio>
    </div>
  );
}

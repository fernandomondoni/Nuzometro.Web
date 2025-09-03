import { useState, useRef, useEffect, useCallback } from "react";
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
import { Alert, AlertDescription } from "../../components/Alert/Alert";
import {
  registerNu,
  getNu,
  getLocations,
  addLocation,
} from "../../services/nuService";
import { Input } from "../../components/Input/Input";

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
  location?: string;
}

interface NuResult {
  items: Array<{
    username: string;
    location: string;
    date: string;
    amount: number;
    recorded_hours: string[];
  }>;
}

export function CounterScreen({ username, onLogout }: CounterScreenProps) {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [counter, setCounter] = useState(0);
  const [isMuted, setIsMuted] = useState(() => {
    try {
      const saved = localStorage.getItem("urnaSound");
      return saved ? !JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [records, setRecords] = useState<CountRecord[]>([]);
  const [nuResult, setNuResult] = useState<NuResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>(["E OUTROS"]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [addingLocation, setAddingLocation] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const audioRef = useRef<HTMLAudioElement>(null);

  const showAlert = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const fetchLocations = useCallback(async () => {
    setLocationsLoading(true);
    try {
      const data = await getLocations();
      const apiItems = data.items || [];
      const allLocations = ["E OUTROS", ...apiItems];
      setLocations(allLocations);
    } catch (err: any) {
      console.error("Erro ao buscar locations:", err);
      setLocations(["E OUTROS"]);
    } finally {
      setLocationsLoading(false);
    }
  }, []);

  const handleAddLocation = async () => {
    if (!newLocation.trim()) {
      showAlert("Digite um nome para o local!", "error");
      return;
    }

    if (!eventDate.trim()) {
      showAlert("Selecione a data do evento!", "error");
      return;
    }

    if (locations.includes(newLocation.trim())) {
      showAlert("Este local já existe!", "error");
      return;
    }

    setAddingLocation(true);
    try {
      await addLocation(newLocation.trim(), eventDate);
      setLocations((prev) => [...prev, newLocation.trim()]);
      setNewLocation("");
      setEventDate("");
      showAlert("Local adicionado com sucesso!", "success");
    } catch (err: any) {
      const msg = err.message || "Erro ao adicionar local.";
      showAlert(msg, "error");
      console.error("Erro ao adicionar location:", err);
    } finally {
      setAddingLocation(false);
    }
  };

  const playUrnaSound = () => {
    if (!isMuted && audioRef.current) {
      /* audioRef.current.play().catch(() => {
        console.log("Som da urna tocaria aqui");
      }); */
    }
    if (!isMuted) {
      const audio = new Audio("/confirma-urna.mp3");
      audio.play().catch(() => {
        console.log("Áudio externo não disponível");
      });
    }
  };

  const playFreeUrnaSound = () => {
    if (audioRef.current) {
      /* audioRef.current.play().catch(() => {
        console.log("Som da urna tocaria aqui");
      }); */
    }
    const audio = new Audio("/confirma-urna.mp3");
    audio.play().catch(() => {
      console.log("Áudio externo não disponível");
    });
  };

  /* const toggleMute = () => {
    const newMutedState = !isMuted;
    const newSoundEnabled = !newMutedState;
    setIsMuted(newMutedState);

    try {
      localStorage.setItem("urnaSound", JSON.stringify(newSoundEnabled));

      window.dispatchEvent(
        new CustomEvent("urnaSound-changed", {
          detail: { enabled: newSoundEnabled },
        })
      );

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "urnaSound",
          newValue: JSON.stringify(newSoundEnabled),
          oldValue: JSON.stringify(!newSoundEnabled),
        })
      );
    } catch (error) {
      console.error("Erro ao salvar configuração de som:", error);
    }
  }; */

  const fetchNuResults = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getNu(username);
      setNuResult(data as unknown as NuResult);
    } catch (err: any) {
      const msg = err.message || "Falha ao carregar resultados.";
      setError(msg);
      console.error("Erro ao buscar Nu:", msg);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchNuResults();
    fetchLocations();
  }, [fetchNuResults, fetchLocations]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "urnaSound" && e.newValue !== null) {
        try {
          const soundEnabled = JSON.parse(e.newValue);
          setIsMuted(!soundEnabled);
        } catch (error) {
          console.error("Erro ao sincronizar configuração de som:", error);
        }
      }
    };

    const handleCustomSoundChange = (e: CustomEvent) => {
      try {
        const enabled = e.detail.enabled;
        setIsMuted(!enabled);
      } catch (error) {
        console.error("Erro ao sincronizar configuração de som:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "urnaSound-changed",
      handleCustomSoundChange as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "urnaSound-changed",
        handleCustomSoundChange as EventListener
      );
    };
  }, []);

  const handleRegisterNu = async () => {
    if (!selectedEvent) {
      showAlert("Selecione um evento primeiro!", "error");
      return;
    }

    setError(null);
    setLoading(true);

    const payload = {
      username,
      location: selectedEvent,
      date: new Date().toISOString(),
    };

    try {
      await registerNu(payload);

      const newCounter = counter + 1;
      setCounter(newCounter);
      playUrnaSound();

      const now = new Date();
      const newRecord: CountRecord = {
        id: Date.now().toString(),
        event: selectedEvent,
        user: username,
        date: now.toLocaleDateString("pt-BR"),
        time: now.toLocaleTimeString("pt-BR"),
      };

      setRecords([newRecord, ...records]);

      await fetchNuResults();
    } catch (err: any) {
      const msg = err.message || "Erro ao registrar Nu.";
      setError(msg);
      console.error("Erro ao registrar Nu:", msg);
      showAlert(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo size="sm" />
            <div>
              <h1>Registre sua Nú Zé</h1>
              <p className="opacity-80">{username}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="bg-white text-red-600 border-red-600 hover:bg-red-50"
          >
            <Icons.Logout className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="p-4 pb-24 space-y-6">
        {alertMessage && (
          <Alert
            variant={alertType === "error" ? "destructive" : "default"}
            className="animate-in slide-in-from-top-2 duration-300"
          >
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Selecionar Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedEvent}
              onValueChange={setSelectedEvent}
              disabled={locationsLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    locationsLoading
                      ? "Carregando eventos..."
                      : "Escolha um evento ou show"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {locationsLoading ? (
                  <SelectItem value="loading" disabled>
                    Carregando...
                  </SelectItem>
                ) : (
                  locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Adicionar novo local</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Nome do novo local"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  disabled={addingLocation}
                />
                <Input
                  type="date"
                  placeholder="Data do evento"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  disabled={addingLocation}
                />
                <Button
                  onClick={handleAddLocation}
                  disabled={
                    addingLocation || !newLocation.trim() || !eventDate.trim()
                  }
                  size="sm"
                  className="w-full"
                >
                  <Icons.Plus className="h-4 w-4 mr-1" />
                  {addingLocation ? "Adicionando..." : "Adicionar"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Total de Registros</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold text-primary">{counter}</div>
            <div className="flex justify-center space-x-2">
              <Button
                onClick={handleRegisterNu}
                size="lg"
                className="flex-1 max-w-xs transition-transform hover:scale-105"
                disabled={!selectedEvent || loading}
              >
                <Icons.Plus className="h-6 w-6 mr-2" />
                {loading ? "Registrando..." : "Registrar Nu"}
              </Button>
              {/* <Button
                variant="outline"
                size="lg"
                onClick={toggleMute}
                className="transition-colors"
                title={isMuted ? "Ativar som" : "Desativar som"}
              >
                {isMuted ? (
                  <Icons.SoundOff className="h-6 w-6" />
                ) : (
                  <Icons.Sound className="h-6 w-6" />
                )}
              </Button> */}
              <Button
                variant="outline"
                size="lg"
                onClick={playFreeUrnaSound}
                className="transition-colors bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
                title="Tocar som da urna"
              >
                <span className="text-xl text-yellow-400">⭐</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={fetchNuResults}
                disabled={loading}
                className="transition-colors"
                title="Atualizar dados"
              >
                <Icons.BarChart />
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

        {nuResult?.items && nuResult.items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados Nu (Servidor)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nuResult.items.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-muted/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">{item.location}</Badge>
                      <span className="text-lg font-bold text-primary">
                        Total: {item.amount}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground mb-2">
                      <strong>Usuário:</strong> {item.username}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      <strong>Data:</strong>{" "}
                      {new Date(item.date).toLocaleDateString("pt-BR", {
                        timeZone: "UTC",
                      })}
                    </div>

                    {item.recorded_hours && item.recorded_hours.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">
                          Horários Registrados:
                        </h4>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {item.recorded_hours
                            .slice(0, 5)
                            .map((hour, hourIndex) => (
                              <div
                                key={hourIndex}
                                className="text-xs text-muted-foreground bg-muted p-2 rounded"
                              >
                                {new Date(hour)
                                  .toISOString()
                                  .replace("T", ", ")
                                  .substring(0, 20)}
                              </div>
                            ))}
                          {item.recorded_hours.length > 5 && (
                            <div className="text-xs text-muted-foreground italic">
                              ... e mais {item.recorded_hours.length - 5}{" "}
                              registros
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-red-600 text-sm">
                <strong>Erro:</strong> {error}
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

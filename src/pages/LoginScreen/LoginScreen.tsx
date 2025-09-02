import React, { useState } from "react";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { Label } from "../../components/Label/Label";
import { Card, CardContent, CardHeader } from "../../components/Card/Card";
import { Logo } from "../../components/Logo/Logo";
import { Icons } from "../../components/Icons/Icons";
import { Alert, AlertDescription } from "../../components/Alert/Alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/Tooltip/Tooltip";

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
  onSignUp: (username: string, password: string, inviteCode?: string) => void;
  loading?: boolean;
  error?: string | null;
}

export function LoginScreen({
  onLogin,
  onSignUp,
  loading = false,
  error,
}: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (password: string): string | null => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      return;
    }

    if (!password.trim()) {
      return;
    }

    if (isSignUp) {
      if (!inviteCode.trim()) {
        return;
      }

      const passwordValidation = validatePassword(password);
      if (passwordValidation) {
        setPasswordError(passwordValidation);
        return;
      }
      setPasswordError(null);

      onSignUp(username, password, inviteCode);
    } else {
      if (password.length < 3) {
        return;
      }

      onLogin(username, password);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-all duration-500 ease-in-out">
      <Card className="w-full max-w-md transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
        <CardHeader className="text-center space-y-4 transition-all duration-300 ease-in-out">
          <Logo
            size="lg"
            className="mx-auto transition-transform duration-300 ease-in-out hover:scale-110"
          />
          <h1 className="transition-all duration-300 ease-in-out transform">
            {isSignUp ? "Criar Conta" : "Entrar"}
          </h1>
        </CardHeader>
        <CardContent className="transition-all duration-300 ease-in-out">
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 animate-in slide-in-from-top-2 duration-300"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                required
                minLength={2}
                disabled={loading}
                className="transition-all duration-200 ease-in-out focus:scale-[1.02]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) {
                      setPasswordError(null);
                    }
                  }}
                  placeholder="Digite sua senha"
                  required
                  minLength={isSignUp ? 8 : 3}
                  disabled={loading}
                  className="transition-all duration-200 ease-in-out focus:scale-[1.02]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out disabled:opacity-50 hover:scale-110"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <Icons.EyeOff className="h-4 w-4" />
                  ) : (
                    <Icons.Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-4 animate-in slide-in-from-bottom-3 duration-500 ease-in-out">
                <div className="space-y-2">
                  <Label htmlFor="email">Email (desabilitado)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Não utilizado"
                    disabled={true}
                    className="transition-all duration-200 ease-in-out"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Código de Convite</Label>
                  <Input
                    id="inviteCode"
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Digite o código de convite"
                    required
                    disabled={loading}
                    className="transition-all duration-200 ease-in-out focus:scale-[1.02]"
                  />
                </div>
              </div>
            )}

            {passwordError && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2 duration-300"
              >
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95"
              disabled={loading}
            >
              {loading ? "Carregando..." : isSignUp ? "Cadastrar" : "Entrar"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setPassword("");
                  setInviteCode("");
                  setEmail("");
                  setPasswordError(null);
                }}
                className="text-primary hover:underline transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
                disabled={loading}
              >
                {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Cadastrar"}
              </button>
            </div>
          </form>

          <div className="text-center mt-4 pb-4">
            <Tooltip>
              <TooltipTrigger>
                <span className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  v2
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Developers: Rafes, Pedro, Beira e Nathan</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

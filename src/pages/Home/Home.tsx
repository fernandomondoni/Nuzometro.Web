import React, { useEffect, useState } from "react";
import {
  Layout,
  Button,
  message,
  Select,
  Card,
  List,
  Divider,
  Spin,
  Alert,
} from "antd";
import { registerNu, getNu } from "../../services/nuService";
import { useNavigate } from "react-router-dom";
import logoSvg from "../../assets/nuzometro.svg";

import "./Home.css";

const { Content } = Layout;
const { Option } = Select;

const locationOptions = [
  "SELECT",
  "MONSTERS OF ROCK",
  "SAVATAGE & OPETH",
  "JUDAS PRIEST",
  "E OUTROS",
];

const Home: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [location, setLocation] = useState<string>(locationOptions[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "";

  const playAudio = () => {
    if (isMuted) return;
    const audio = new Audio("/confirma-urna.mp3");
    audio.play();
  };

  const fetchResults = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getNu(username);
      setResult(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err.message || "Failed to load results.";
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleRegisterAndFetchNu = async () => {
    if (location === "SELECT") {
      message.warning("Please, select a valid option.");
      return;
    }

    setError(null);
    setLoading(true);
    const payload = {
      username,
      location,
      date: new Date().toISOString(),
    };

    try {
      await registerNu(payload);
      message.success("Nu registered successfully!");
      playAudio();
      await fetchResults();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg =
        err.message || "Something went wrong while registering or fetching Nu.";
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {error && (
        <Alert
          type="error"
          message={error}
          style={{
            position: "fixed",
            top: 20,
            left: 0,
            right: 0,
            margin: "1rem",
            zIndex: 1000,
          }}
        />
      )}

      <Content className="home-wrapper scrollable-content">
        <div className="title-container">
          <img src={logoSvg} alt="nuzometro" className="title-icon" />
        </div>

        {initialLoading ? (
          <Spin tip="Loading results...">
            <div
              style={{
                padding: 24,
                backgroundColor: "#f2f2f2",
                borderRadius: 8,
              }}
            ></div>
          </Spin>
        ) : (
          <>
            <div className="select-container">
              <Select
                value={location}
                onChange={setLocation}
                className="select"
              >
                {locationOptions.map((loc) => (
                  <Option key={loc} value={loc}>
                    {loc}
                  </Option>
                ))}
              </Select>
            </div>

            <Button
              type="default"
              onClick={() => setIsMuted((prev) => !prev)}
              className="mute-button"
              style={{ marginBottom: 8 }}
            >
              {isMuted ? "Unmute" : "Mute"}
            </Button>

            <Button
              type="primary"
              onClick={handleRegisterAndFetchNu}
              loading={loading}
              className="nu-button"
              disabled={location === "SELECT"}
            >
              NU
            </Button>

            {result?.items?.length > 0 && (
              <div className="results">
                <Divider>Results</Divider>
                {result.items.map((item: any, index: number) => (
                  <Card
                    key={index}
                    title={item.location}
                    className="result-card"
                  >
                    <p>
                      <strong>User:</strong> {item.username}
                    </p>
                    <p>
                      <strong>Data:</strong>{" "}
                      {new Date(item.date).toLocaleDateString("pt-BR", {
                        timeZone: "UTC",
                      })}
                    </p>
                    <p>
                      <strong>Total:</strong> {item.amount}
                    </p>

                    <Divider style={{ margin: "12px 0" }}>Registers</Divider>
                    <List
                      dataSource={item.recorded_hours}
                      renderItem={(hour: string) => (
                        <List.Item>
                          {new Date(hour)
                            .toISOString()
                            .replace("T", ", ")
                            .substring(0, 20)}
                        </List.Item>
                      )}
                      bordered
                      size="small"
                    />
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        <Button
          type="default"
          onClick={handleLogout}
          className="back-button"
          block
        >
          Logout
        </Button>
      </Content>
    </Layout>
  );
};

export default Home;

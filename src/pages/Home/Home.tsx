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
} from "antd";
import { registerNu, getNu } from "../../services/nuService";
import { useNavigate } from "react-router-dom";

import "./Home.css";

const { Content } = Layout;
const { Option } = Select;

const locationOptions = [
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
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "";

  const playAudio = () => {
    if (isMuted) return;
    const audio = new Audio("/confirma-urna.mp3");
    audio.play();
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await getNu(username);
      setResult(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      message.error("Failed to load results.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegisterAndFetchNu = async () => {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      message.error("Something went wrong while registering or fetching Nu.");
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
      <Content className="home-wrapper scrollable-content">
        <h1 className="title">Nuzometro</h1>

        {initialLoading ? (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Spin tip="Loading results..." />
          </div>
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
          onClick={() => handleLogout()}
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

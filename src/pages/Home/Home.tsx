import React, { useState } from "react";
import { Layout, Button, message, Select, Card, List, Divider } from "antd";
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
  const [isMuted, setIsMuted] = useState(false);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "";

  const playAudio = () => {
    if (isMuted) return;
    const audio = new Audio("/confirma-urna.mp3");
    //const audio = new Audio("../../../public/confirma-urna.mp3");
    audio.play();
  };

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

      const data = await getNu(username);
      setResult(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      message.error("Something went wrong while registering or fetching Nu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content className="home-wrapper scrollable-content">
        <h1 className="title">Nuzometro</h1>

        <div className="select-container">
          <Select value={location} onChange={setLocation} className="select">
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
              <Card key={index} title={item.location} className="result-card">
                <p>
                  <strong>User:</strong> {item.username}
                </p>
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(item.date).toLocaleDateString("pt-BR")}
                </p>
                <p>
                  <strong>Total:</strong> {item.amount}
                </p>

                <Divider style={{ margin: "12px 0" }}>Registers</Divider>
                <List
                  dataSource={item.recorded_hours}
                  renderItem={(hour: string) => (
                    <List.Item>
                      {new Date(hour).toLocaleString("pt-BR")}
                    </List.Item>
                  )}
                  bordered
                  size="small"
                />
              </Card>
            ))}
          </div>
        )}

        <Button
          type="default"
          onClick={() => navigate(-1)}
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

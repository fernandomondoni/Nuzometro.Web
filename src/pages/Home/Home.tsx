import React, { useState } from "react";
import { Layout, Button, message, Select } from "antd";
import { registerNu, getNu } from "../../services/nuService";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

const locationOptions = [
  "MONSTERS OF ROCK",
  "SAVATAGE & OPETH",
  "JUDAS PRIEST",
];

const Home: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [location, setLocation] = useState<string>(locationOptions[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "";

  const playAudio = () => {
    const audio = new Audio("../../../public/confirma-urna.mp3");
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
      <Content style={{ padding: 24, textAlign: "center" }}>
        <h1>Nuzometro</h1>

        <div style={{ marginBottom: 16 }}>
          <Select
            value={location}
            onChange={setLocation}
            style={{ width: 240 }}
          >
            {locationOptions.map((loc) => (
              <Option key={loc} value={loc}>
                {loc}
              </Option>
            ))}
          </Select>
        </div>

        <Button
          type="primary"
          onClick={handleRegisterAndFetchNu}
          loading={loading}
          style={{ marginBottom: 16 }}
        >
          NU
        </Button>

        {result && (
          <pre style={{ textAlign: "left", marginTop: 16 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        )}

        <Button
          type="default"
          onClick={() => navigate(-1)}
          style={{ marginTop: "1rem" }}
          block
        >
          Back
        </Button>
      </Content>
    </Layout>
  );
};

export default Home;

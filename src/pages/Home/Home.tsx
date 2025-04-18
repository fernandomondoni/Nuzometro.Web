/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Layout, Button, message } from "antd";
import { registerNu, getNu } from "../../services/nuService";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const Home: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "";

  const handleRegisterNu = async () => {
    const payload = {
      username: username,
      location: "Bahia - Brazil",
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const data = await registerNu(payload);
      message.success("Nu registered successfully!");
      setResult(data);
    } catch (err) {
      message.error("Failed to register Nu.");
    }
  };

  const handleGetNu = async () => {
    try {
      const data = await getNu(username);
      setResult(data);
    } catch (err) {
      message.error("Failed to fetch Nu.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: 24, textAlign: "center" }}>
        <h1>Nuzometro</h1>
        <Button
          type="primary"
          onClick={handleRegisterNu}
          style={{ marginRight: 8 }}
        >
          Register Nu
        </Button>
        <Button onClick={handleGetNu}>Get Nu</Button>

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

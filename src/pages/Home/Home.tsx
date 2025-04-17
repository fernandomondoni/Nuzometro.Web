/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Layout, Button, message } from "antd";
import { registerNu, getNu } from "../../services/nuService";

const { Content } = Layout;

const Home: React.FC = () => {
  const [result, setResult] = useState<any>(null);

  const username = "bozo";

  const handleRegisterNu = async () => {
    const payload = {
      user: username,
      location: "bahia",
      date: new Date().toISOString().split("T")[0], // ex: "2025-04-16"
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
      </Content>
    </Layout>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Tooltip } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import logoSvg from "../../assets/nuzometro.svg";
import { login } from "../../services/authService";

import "./Auth.css";

const App: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: { username: string; password: string }) => {
    setError(null);
    setLoading(true);
    try {
      const result = await login(values);

      localStorage.setItem("access_token", result.tokens.access_token);
      localStorage.setItem("id_token", result.tokens.id_token);
      localStorage.setItem("refresh_token", result.tokens.refresh_token);
      localStorage.setItem("username", result.username);

      message.success("Signed in successfully!");
      navigate("/home");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg =
        err.message || "Sign in failed. Please check your credentials.";
      console.error("Login error:", msg);
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    const msg = "Error at sign in. Verify your credentials.";
    message.error(msg);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (localStorage.getItem("access_token")) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      <div className="wrapper">
        <div className="login-container">
          <div className="logo-container">
            <img src={logoSvg} alt="Logo" className="logo" />
          </div>
          <Form
            form={form}
            name="login"
            layout="vertical"
            initialValues={{ username: "", password: "" }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please, input your username!" },
              ]}
            >
              <Input placeholder="Input your username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please, input your password!" },
              ]}
            >
              <Input.Password placeholder="Input your password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Sign in
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="default"
                block
                onClick={() => navigate("/createuser")}
              >
                Sign up
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center", marginTop: 8 }}>
              <Tooltip title="Developers: Rafes, Pedro, Beira e Nathan">
                <span style={{ cursor: "pointer", color: "rgba(0,0,0,0.45)" }}>
                  v1
                </span>
              </Tooltip>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default App;

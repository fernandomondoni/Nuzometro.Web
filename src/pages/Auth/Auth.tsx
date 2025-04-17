import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import logoSvg from "../../assets/nuzometro.svg";
import { login } from "../../services/authService";

import "./Auth.css";

const App: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const result = await login(values);

      console.log(result);

      localStorage.setItem("access_token", result.tokens.access_token);
      localStorage.setItem("id_token", result.tokens.id_token);
      localStorage.setItem("refresh_token", (result.tokens.refresh_token));
      localStorage.setItem("username", (result.username));

      message.success("Signed in successfully!");
      navigate("/home");
    } catch (error: any) {
      console.error(error);
      message.error("Sign in failed. Please check your credentials.");
    }
  };

  const onFinishFailed = () => {
    message.error("Error at sign in. Verify your credentials.");
  };

  return (
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
              { required: true, message: "Please, input your username!" }
            ]}
          >
            <Input placeholder="Input your username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please, input your password!" }]}
          >
            <Input.Password placeholder="Input your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign in
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="default" block onClick={() => navigate("/createuser")}>
              Sign up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default App;

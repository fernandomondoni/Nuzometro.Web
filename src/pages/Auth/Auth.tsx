import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

import "./Auth.css";

/* interface LoginFormValues {
  email: string;
  password: string;
} */

const App: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (/* values: LoginFormValues */) => {
    console.log("Sign in success");
    localStorage.setItem("token", "fake-token");
    navigate("/home");
  };

  const onFinishFailed = () => {
    message.error("Error at sign in. Verify your credentials.");
  };

  return (
    <Form
      form={form}
      name="login"
      layout="vertical"
      initialValues={{ email: "", password: "" }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please, input your email!" },
          { type: "email", message: "The email inserted is not valid!" },
        ]}
      >
        <Input placeholder="Input your email" />
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
  );
};

export default App;

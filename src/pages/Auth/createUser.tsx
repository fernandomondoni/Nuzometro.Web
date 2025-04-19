import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import logoSvg from "../../assets/nuzometro.svg";
import authService from "../../services/userService";

import "./createUser.css";

const CreateUser: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface UserFormValues {
    username: string;
    password: string;
    inviteCode: string;
  }

  const onFinish = async (values: UserFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.signUp({
        username: values.username,
        password: values.password,
        inviteCode: values.inviteCode,
      });
      message.success("Account created successfully!");
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err.message || "Error creating user. Please try again.";
      console.error("Sign-up failed:", msg);
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    const msg = "Error creating account. Please check the fields.";
    message.error(msg);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="wrapper-signup">
      <div className="signup-container">
        <div className="logo-container">
          <img src={logoSvg} alt="Logo" className="logo" />
        </div>
        <Form
          form={form}
          name="signup"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item label="Email (disabled)" name="email">
            <Input placeholder="Not used" disabled />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                message:
                  "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Invitation Code"
            name="inviteCode"
            rules={[
              { required: true, message: "Please enter your invitation code!" },
            ]}
          >
            <Input placeholder="Enter invitation code" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register and Create Account
            </Button>
            <Button
              type="default"
              onClick={() => navigate(-1)}
              style={{ marginTop: "1rem" }}
              block
              disabled={loading}
            >
              Back
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateUser;

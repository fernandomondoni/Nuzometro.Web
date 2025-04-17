import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import logoSvg from "../../assets/nuzometro.svg";
import authService from '../../services/userService';

import "./createUser.css";

const CreateUser: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  interface UserFormValues {
    username: string;
    password: string;
    inviteCode: string;
  }

  const onFinish = async (values: UserFormValues) => {
    setLoading(true);
    try {
      const data = await authService.signUp({
        username: values.username,
        password: values.password,
        inviteCode: values.inviteCode,
      });
      message.success('Account created successfully!');
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      //localStorage.setItem('user', JSON.stringify({ username: values.username }));
      navigate('/login');
    } catch (err: any) {
      console.error('Sign-up failed:', err);
      message.error(err.message || 'Error creating user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    message.error('Error creating account. Please check the fields.');
  };

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
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Email (disabled)"
            name="email"
          >
            <Input placeholder="Not used" disabled />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Invitation Code"
            name="inviteCode"
            rules={[{ required: true, message: 'Please enter your invitation code!' }]}
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
              style={{ marginTop: '1rem' }}
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

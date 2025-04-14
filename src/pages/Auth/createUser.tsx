import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const CreateUser: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  interface UserFormValues {
    username: string;
    email: string;
    password: string;
  }

  const onFinish = (values: UserFormValues) => {
    console.log('User created successfully');
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify(values));
    navigate('/home');
  };

  const onFinishFailed = () => {
    message.error('Error to create account. Please verify the fields.');
  };

  return (
    <Form
      form={form}
      name="signup"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Name"
        name="username"
        rules={[{ required: true, message: 'Please, provide your user name!' }]}
      >
        <Input placeholder="Type your user name" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Provide your email!' },
          { type: 'email', message: 'This email is not valid!' }
        ]}
      >
        <Input placeholder="Type your email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Provide your password!' }]}
      >
        <Input.Password placeholder="Type your password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Register and Sign up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateUser;

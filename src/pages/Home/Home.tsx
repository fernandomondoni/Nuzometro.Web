import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider, Content } = Layout;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    { key: 'home', icon: <PieChartOutlined />, label: 'Home' },
    { key: 'profile', icon: <DesktopOutlined />, label: 'Profile' },
    { key: 'logout', icon: <SettingOutlined />, label: 'Logout' },
  ];

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case 'home':
        navigate('/home');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'logout':
        localStorage.removeItem('token');
        navigate('/');
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} trigger={null}>
        <div style={{ padding: '16px' }}>
          <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['home']}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: '24px' }}>
          <h1 style={{ textAlign: 'center' }}>Nuzometro</h1>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;

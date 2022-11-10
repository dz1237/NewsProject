import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd';
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import Home from './home/Home';
import UserList from './user-manage/UserList';
import RoleList from './right-manage/RoleList';
import RightList from './right-manage/RightList';
import NoPermission from './nopermission/NoPermission';
import  './NewsSandBox.css'
export default function NewsSandBox() {
  const { Content } = Layout;
  return (
    <Layout>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />
        <Content className="site-layout-background" style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/user-manage/list" element={<UserList />} />
            <Route path="/right-manage/role/list" element={<RoleList />} />
            <Route path="/right-manage/right/list" element={<RightList />} />
            <Route path='/' element={<Navigate to="/home" />} exact />
            <Route path="*" element={<NoPermission />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

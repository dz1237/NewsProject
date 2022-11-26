import React, { useEffect } from 'react';
import { Layout } from 'antd';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NewsRouter from '../../components/sandbox/NewsRouter'
export default function NewsSandBox() {
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  })
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
           <NewsRouter/>
        </Content>
      </Layout>
    </Layout>
  )
}

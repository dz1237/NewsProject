import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Dropdown, Menu, Space, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false);
  const { Header } = Layout;
  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))
  const navigate = useNavigate();
  //更改图标
  const changeCollapsed = () => {
    setCollapsed(!collapsed)
  }
  const menu = (
    <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              label: [roleName],
              
            },
            {
              key: '2',
              label: '退出登录',
              danger: true,
              onClick: function(){
                localStorage.removeItem("token");
                navigate("/login");
              }
            }
          ]}
        />
  );
  return (

      <Header
          className="site-layout-background" style={{ padding: "0 26px",}}
        >
          {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })} */}
          {
            collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> : <MenuFoldOutlined onClick={changeCollapsed}/>
          }
          <div style={{float:"right"}}>
            <span>欢迎{username}</span>
            <Dropdown overlay={menu}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar size="large" icon={<UserOutlined />} />
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>

  )
}

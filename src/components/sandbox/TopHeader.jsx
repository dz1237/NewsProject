import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Dropdown, Menu, Space, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import {connect} from 'react-redux';
const  TopHeader = (props) =>  {
  const { Header } = Layout;
  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  //更改图标
  const changeCollapsed = () => {
    props.changeCollapsed();
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
          {
            props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> : <MenuFoldOutlined onClick={changeCollapsed}/>
          }
          <div style={{float:"right"}}>
            <span>欢迎<span style={{ color : "#1890ff"}}>{username}</span></span>
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
const mapStateToProps = ({CollApsedReducer:{isCollapsed}}) => {
  return {
    isCollapsed
  }

}
const mapDispatchToProps =  {
  changeCollapsed(){
    return {
      type:"change_collapsed"
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)

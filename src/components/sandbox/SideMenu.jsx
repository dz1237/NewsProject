import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import {  UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'
import style from './index.module.css';
export default function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();//左侧边栏默认高亮的
  const openKeys = ["/" + location.pathname.split("/")[1]];//左侧边栏默认展开的
  const [menu, setMenu] = useState([])
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then(res => {
      setMenu(res.data);
    })
  }, [])
  const { Sider } = Layout;
  //实现左侧导航栏跳转    router6版本useNavigate代替useHistory
  const handleClick = (e) => {
    // console.log(e);
    navigate(e.key)
  }
  const getItem = (label, key, icon, children, type) => {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const checkPagePermission = (item) => {
    // console.log(item);
    return item.pagepermisson &&  rights.includes(item.key)
  }

  // const renderMenu = (menuList) => {
  //   console.log(rights);
  //   console.log(menuList);
  //   const items = [];
  //   const child =[];
  //   menuList.map((item) => {
  //     if (item.children?.length > 0 && checkPagePermission(item)) {
  //       return items.push(
  //         getItem(item.title, item.key, <PieChartOutlined />, renderMenu(item.children))
  //       )
  //     }
  //     else {
  //       return (
  //         item.pagepermisson && items.push(getItem(item.title, item.key,))
  //       )
  //     }
  //   })
  //   return items
  // }
  const renderMenu = (menuList) => {
    const items = [];
    menuList?.forEach((item) => {
      const child = [];
      if (checkPagePermission(item)) {
        if (item.children?.length > 0) {
          item.children.forEach((itemchildren) => {
            if (checkPagePermission(itemchildren)) {
              child.push(getItem((
                <i style={{ fontStyle: 'normal' }}>
                  {itemchildren.title}
                </i>
              ), itemchildren.key, <UserOutlined />))
            }
          })
          items.push(getItem((
            <i style={{ fontStyle: 'normal' }}>
              {item.title}
            </i>
          ), item.key, <UserOutlined />, child))
        } 
        else {
          items.push(getItem((
            <i style={{ fontStyle: 'normal' }}>
              {item.title}
            </i>
          ), item.key, <UserOutlined />))
        }
      }
    })
    return items
  }
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div className={style.left}>
        <div className={style.logo}>我的发布</div>
        <div className={style.leftMenu}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={location.pathname}
            defaultOpenKeys={openKeys}
            items={renderMenu(menu)}
            onClick={handleClick}
          />
        </div>
      </div>
    </Sider>
  )
}

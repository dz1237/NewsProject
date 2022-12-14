import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import axios from 'axios';
import Home from '../../views/sandbox/home/Home';
import UserList from '../../views/sandbox/user-manage/UserList';
import RoleList from '../../views/sandbox/right-manage/RoleList';
import RightList from '../../views/sandbox/right-manage/RightList';
import NoPermission from '../../views/sandbox/nopermission/NoPermission';
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd';
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft';
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory';
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview';
import Newsupdate from '../../views/sandbox/news-manage/Newsupdate';
import Audit from '../../views/sandbox/audit-manage/Audit';
import AuditList from '../../views/sandbox/audit-manage/AuditList';
import UnPublished from '../../views/sandbox/publish-manage/Unpublished';
import Published from '../../views/sandbox/publish-manage/Published';
import Sunset from '../../views/sandbox/publish-manage/Sunset';
import '../../views/sandbox/NewsSandBox.css';
const LocalRouterMap = {
  "/home": <Home />,
  "/user-manage/list": <UserList />,
  "/right-manage/role/list": <RoleList />,
  "/right-manage/right/list": <RightList />,
  "/news-manage/add": <NewsAdd />,
  "/news-manage/draft": <NewsDraft />,
  "/news-manage/category": <NewsCategory />,
  "/news-manage/preview/:id": <NewsPreview />,
  "/news-manage/update/:id": <Newsupdate />,

  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/unpublished": <UnPublished />,
  "/publish-manage/published": <Published />,
  "/publish-manage/sunset": <Sunset />

}
const  NewsRouter = (props) => {
  const [backRouteList, setbackRouteList] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/rights"),
      axios.get("http://localhost:8000/children")
    ]).then((res) => {
      setbackRouteList([...res[0].data, ...res[1].data])

    })
  }, [])
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }
  return (
    <div>
      <Spin spinning={props.isLoading}>
        <Routes>
          {
            backRouteList.map(item => {
              if (checkRoute(item) && checkUserPermission(item)) {
                return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} exact />
              }
              return null;
            }


            )
          }
          <Route path='/' element={<Navigate to="/home" />} exact />
          {
            backRouteList.length > 0 && <Route path="*" element={<NoPermission />} />
          }
        </Routes>
      </Spin>
    </div>
  )
}
const mapStateToProps = ({LoadingReducer:{isLoading}}) =>({
  isLoading
})
export default connect(mapStateToProps)(NewsRouter)
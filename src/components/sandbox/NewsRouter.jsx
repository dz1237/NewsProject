import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../../views/sandbox/home/Home';
import UserList from '../../views/sandbox/user-manage/UserList';
import RoleList from '../../views/sandbox/right-manage/RoleList';
import RightList from '../../views/sandbox/right-manage/RightList';
import NoPermission from '../../views/sandbox/nopermission/NoPermission';
import  '../../views/sandbox/NewsSandBox.css'
export default function NewsRouter() {
  return (
    <div>
      <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/user-manage/list" element={<UserList />} />
            <Route path="/right-manage/role/list" element={<RoleList />} />
            <Route path="/right-manage/right/list" element={<RightList />} />
            <Route path='/' element={<Navigate to="/home" />} exact />
            <Route path="*" element={<NoPermission />} />
          </Routes>
    </div>
  )
}

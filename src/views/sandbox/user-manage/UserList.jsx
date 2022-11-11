import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover,Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import style from '../right-manage/RightList.module.css';
export default function UserList() {
  const [dataSource, setdataSource] = useState();
  const { confirm } = Modal;
  useEffect(() => {
    axios.get("http://localhost:8000/users?_expand=role").then(res => {
      const list = res.data;
      console.log(list);
      setdataSource(list);
    })
  }, []);
  //页面配置项的开关
  const content = (item) => {
    return (<div className={style.content}>
      <Switch checked = {item.pagepermisson} onChange={()=>switchMethod(item)}/>
    </div>)
  }
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson=== 1 ? 0 : 1;
    setdataSource([...dataSource]);
    item.grade === 1 ? axios.patch(`http://localhost:8000/rights/${item.id}`,{
      pagepermisson:item.pagepermisson
    }) : axios.patch(`http://localhost:8000/children/${item.id}`,{
      pagepermisson:item.pagepermisson
    })
  }
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) =>{
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render:(roleState,item)=>{
        return <Switch checked={roleState} disabled={item.default}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="danger" shape="circle" disabled={item.default} icon={<DeleteOutlined />} onClick={() => {
            confirmMethod(item) 
          }} />
            <Button type="primary" shape="circle" disabled={item.default} icon={<EditOutlined />} />

        </div>
      }
    },
  ];
  const confirmMethod = (item) => {
    confirm({
      title: '您确定删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deletedMethod(item)
      },
      onCancel() {
      },
    });
  }
  const deletedMethod = (item) => {
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id));
      axios.delete(`http://localhost:8000/rights/${item.id}`);
    } else {
      console.log(item.rightId);
      let list = dataSource.filter(data => data.id === item.rightId);
      list[0].children = list[0].children.filter(data => data.id !== item.id);
      setdataSource([...dataSource])
      axios.delete(`http://localhost:8000/children/${item.id}`);
    }
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => { return item.id }}
        pagination={
          {
            pageSize: 5
          }
        }
      />;
    </div>
  )
}

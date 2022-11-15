import React, { useState, useEffect, useRef } from 'react'
import { Table,  Button, Modal, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import  UserForm from "../../../components/user-manage/UserForm"
import style from '../right-manage/RightList.module.css';
export default function UserList() {
  const [dataSource, setdataSource] = useState();
  const [isOpen, setisOpen] = useState(false);//新增用户模态框显示状态哦
  const [roleList, setroleList] = useState([]);
  const [regionList, setregionList] = useState([]);
  const { confirm } = Modal;
  const addFrom = useRef(null)
  useEffect(() => {
    axios.get("http://localhost:8000/users?_expand=role").then(res => {
      const list = res.data;
      console.log(list);
      setdataSource(list);
    })
  }, []);
  useEffect(() => {
    axios.get("http://localhost:8000/regions").then(res => {
      const list = res.data;
      // console.log(list);
      setregionList(list);
    })
  }, []);
  useEffect(() => {
    axios.get("http://localhost:8000/roles").then(res => {
      const list = res.data;
      // console.log(list);
      setroleList(list);
    })
  }, []);
  //页面配置项的开关
  const content = (item) => {
    return (<div className={style.content}>
      <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)} />
    </div>)
  }
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setdataSource([...dataSource]);
    item.grade === 1 ? axios.patch(`http://localhost:8000/rights/${item.id}`, {
      pagepermisson: item.pagepermisson
    }) : axios.patch(`http://localhost:8000/children/${item.id}`, {
      pagepermisson: item.pagepermisson
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
      render: (role) => {
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
      render: (roleState, item) => {
        return <Switch checked={roleState} onChange={()=>{handleChangeSwitch(item)}} disabled={item.default}></Switch>
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
  //处理用户状态的Switch开关
  const handleChangeSwitch = (item) => {
    console.log(item);
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`http://localhost:8000/users/${item.id}`,{roleState:item.roleState})
  }
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
  // 删除
  const deletedMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:8000/users/${item.id}`)
  }
  const onCancel = () => {
    setisOpen(false)
  }
  const handleNewUser = () => {
    setisOpen(true)
  }
  const addFromOK = () => {
    addFrom.current.validateFields().then(value=>{
      setisOpen(false);
      addFrom.current.resetFields()
      axios.post( `http://localhost:8000/users`,{
        ...value,
        "roleState":true, 
        "default":false
      }).then(res=>{
        // console.log(res.data);
        setdataSource([...dataSource,{...res.data,role:roleList.filter(item=>item.id===value.roleId)[0]}])
      })
    }).catch(err=>{
      console.log(err);
    })
  }
  return (
    <div>
      <Button type='primary' onClick={handleNewUser}>新增用户</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => { return item.id }}
        pagination={
          {
            pageSize: 5
          }
        }
      />;
      <Modal
        open={isOpen}
        title="添加用户"
        okText="确定添加"
        cancelText="取消"
        onCancel={onCancel}
        onOk={addFromOK}
      >
       <UserForm  
        regionList={ regionList }
        roleList={ roleList }
        ref= { addFrom }
       ></UserForm>
      </Modal>
    </div>
  )
}

import React, { useState, useEffect, useRef } from 'react'
import { Table,  Button, Modal, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import  UserForm from "../../../components/user-manage/UserForm"
// import style from '../right-manage/RightList.module.css';
export default function UserList() {
  const [dataSource, setdataSource] = useState();
  const [isOpen, setisOpen] = useState(false);//新增用户模态框显示状态哦
  const [roleList, setroleList] = useState([]);
  const [regionList, setregionList] = useState([]);
  const { confirm } = Modal;
  const addFrom = useRef(null);
  const [isUpdateOpen, setisUpdateOpen] = useState(false);
  const updateFrom = useRef(null);
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false);
  const [current, setcurrent] = useState(null);
  const {roleId, region,username} = JSON.parse(localStorage.getItem("token"))
  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3": "editor",
  }
  useEffect(() => {
    axios.get("/users?_expand=role").then(res => {
      const list = res.data;
      console.log(list);
      setdataSource(roleObj[roleId] === "superadmin"?list:[
        ...list.filter(item=>item.username===username),
        ...list.filter(item=>item.region===region&& roleObj[item.roleId] === "editor"),
      ] );
    })
  }, []);
  useEffect(() => {
    axios.get("/regions").then(res => {
      const list = res.data;

      setregionList(list);
    })
  }, []);
  useEffect(() => {
    axios.get("/roles").then(res => {
      const list = res.data;

      setroleList(list);
    })
  }, []);
  //页面配置项的开关
  // const content = (item) => {
  //   return (<div className={style.content}>
  //     <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)} />
  //   </div>)
  // }
  // const switchMethod = (item) => {
  //   item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
  //   setdataSource([...dataSource]);
  //   item.grade === 1 ? axios.patch(`/rights/${item.id}`, {
  //     pagepermisson: item.pagepermisson
  //   }) : axios.patch(`/children/${item.id}`, {
  //     pagepermisson: item.pagepermisson
  //   })
  // }
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters:[
        ...regionList.map(item=>({
          
          text:item.title,
          value:item.value,
        })),
        {
          text:"全球",
          value:"全球"
        }
      ],
      onFilter:(value,item)=>{
        
        if(value === "全球"){
          return  item.region===""
        }else{
          return item.region===value
        }
      },
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
          <Button type="primary" shape="circle" disabled={item.default} icon={<EditOutlined />} onClick={()=>{handleUpdate(item)}} />
        </div>
      }
    },
  ];
  //处理操作中的编辑
  // 问题：会爆出cannot read setFieldsValue
//   react中状态更新不一定是同步的，导致对话框模块还没显示，也就是表单还没挂载就调用了setFieldsValue，所以报错
// 解决：使用async/await和setTimeout。
  const handleUpdate = async(item) => {
    // setTimeout(() => {
      await setisUpdateOpen(true);
      if(item.roleId === 1){
        setisUpdateDisabled(true)
      }
      else{
        setisUpdateDisabled(false)
      }

      updateFrom.current.setFieldsValue(item);
      setcurrent(item)
    // },0)
  }
  //处理用户状态的Switch开关
  const handleChangeSwitch = (item) => {
    console.log(item);
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`/users/${item.id}`,{roleState:item.roleState})
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
    axios.delete(`/users/${item.id}`)
  }
  const onCancel = () => {
    setisOpen(false)
  }
  const onUpdateCancel = () => {
    setisUpdateOpen(false);
    setisUpdateDisabled(!isUpdateDisabled);
  }
  const handleNewUser = () => {
    setisOpen(true)
  }
  const addFromOK = () => {
    addFrom.current.validateFields().then(value=>{
      setisOpen(false);
      addFrom.current.resetFields()
      axios.post( `/users`,{
        ...value,
        "roleState":true, 
        "default":false
      }).then(res=>{

        setdataSource([...dataSource,{...res.data,role:roleList.filter(item=>item.id===value.roleId)[0]}])
      })
    }).catch(err=>{
      console.log(err);
    })
  }
  //确认更新
  const addUpdateFromOK = () => {
    
    updateFrom.current.validateFields().then(value=>{
      setisOpen(false);
      setdataSource(dataSource.map(item=>{
        if(item.id === current.id){
          return {
            ...item,
            ...value,
            role:roleList.filter(item=>item.id===value.roleId)[0]
          }
        }
        return item;
      }))
      setisUpdateOpen(false);
      setisUpdateDisabled(!isUpdateDisabled);
      axios.patch(`/users/${current.id}`,value)
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
      <Modal
        open={isUpdateOpen}
        title="更新用户"
        okText="确定更新"
        cancelText="取消"
        onCancel={onUpdateCancel}
        onOk={addUpdateFromOK}
      >
       <UserForm  
        regionList={ regionList }
        roleList={ roleList }
        ref= { updateFrom }
        isUpdateDisabled={ isUpdateDisabled }
        isUpdate={true}
       ></UserForm>
      </Modal>
    </div>
  )
}

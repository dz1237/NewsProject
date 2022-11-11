import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Switch, Form, Input, Select } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import style from '../right-manage/RightList.module.css';
export default function UserList() {
  const {Option} = Select;
  const [dataSource, setdataSource] = useState();
  const [isOpen, setisOpen] = useState(false);//新增用户模态框显示状态哦
  const [roleList, setroleList] = useState([]);
  const [regionList, setregionList] = useState([]);
  const { confirm } = Modal;
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
  const onCancel = () => {
    setisOpen(false)
  }
  const handleNewUser = () => {
    setisOpen(true)
  }
  const closeNewUser = () => {

    setisOpen(false);//关闭新增用户弹窗
    console.log("加上了");

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
        onOk={closeNewUser}
      >
        <Form
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名！',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="region"
            label="区域"
            rules={[
              {
                required: true,
                message: '请输入区域！',
              },
            ]}
          >
            <Select>
              {
                regionList.map(item =>
                  <Option value={item.value} key={item.id}>{item.title}</Option>
                  )
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="roleId"
            label="角色"
            rules={[
              {
                required: true,
                message: '请输入区域！',
              },
            ]}
          >
            <Select>
              {
                roleList.map(item =>
                  <Option value={item.id} key={item.id}>{item.roleName}</Option>
                  )
              }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

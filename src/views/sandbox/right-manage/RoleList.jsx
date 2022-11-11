import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'antd';
import axios from 'axios';
import { DeleteOutlined, UnorderedListOutlined,ExclamationCircleOutlined } from '@ant-design/icons';

export default function RoleList() {
  const [dataSource, setdataSource] = useState([]);
  const { confirm } = Modal;
  const colums = [
    {
      title:"id",
      dataIndex:"id",
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => {
            confirmMethod(item)
          }} />
          
            <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} disabled ={item.pagepermisson === undefined}/>
          

        </div>
      }
    },
    // {
    //   title: '权限路径',
    //   dataIndex: 'key',
    //   render: (key) => {
    //     return <Tag color='orange'>{key}</Tag>
    //   }
    // },

  ];
  const confirmMethod = (item) => {
    confirm({
      title: '您确定删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deletedMethod(item)
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  const deletedMethod = (item) => {
      setdataSource(dataSource.filter(data => data.id !== item.id));
      axios.delete(`http://localhost:8000/roles/${item.id}`);
  }
  useEffect(() => {
    axios.get("http://localhost:8000/roles").then(res => {
      setdataSource(res.data)
    })
  }, [])
  return (
    <div>
      <Table dataSource={dataSource} columns={colums} rowKey={ (item) => {return item.id}}></Table>
    </div>
  )
}

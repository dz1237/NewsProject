import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tree } from 'antd';
import axios from 'axios';
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export default function RoleList() {
  const [dataSource, setdataSource] = useState([]);
  const [rightList, setrightList] = useState([]);
  const [currentRights, setcurrentRights] = useState([]);
  const [currentId, setcurrentId] = useState(0);
  const [isModalOpen, setisModalOpen] = useState(false);
  const { confirm } = Modal;
  const colums = [
    {
      title: "id",
      dataIndex: "id",
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
          <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={()=>{handleIsModalOpen(item)}} />
        </div>
      }
    },
  ];
  const confirmMethod = (item) => {
    confirm({
      title: '您确定删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deletedMethod(item)``
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
  //角色列表数据
  useEffect(() => {
    axios.get("http://localhost:8000/roles").then(res => {
      setdataSource(res.data)
    })
  }, [])
  //请求角色列表中角色名称对应的权限数据
  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then(res => {
      setrightList(res.data)
    })
  }, [])
  const handleOk = () => {
    setisModalOpen(false);
    //同步数据
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return {
          ...item,
          rights:currentRights
        }
      }
      return item;
    }))
    axios.patch(`http://localhost:8000/roles/${currentId}`,{
      rights:currentRights
    })
  }
  const handleCancel = () => {
    setisModalOpen(!isModalOpen);
  }
  const handleIsModalOpen = (item) => {
    setisModalOpen(true);
    setcurrentRights(item.rights);
    setcurrentId(item.id)
  }
  const onCheck = (checkedKeys) => {
    setcurrentRights(checkedKeys.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={colums} rowKey={(item) => { return item.id }}></Table>
      <Modal title="权限管理" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkStrictly//父子是否关联   false是关联     true不关联
          onCheck={onCheck}
          checkedKeys={currentRights}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}

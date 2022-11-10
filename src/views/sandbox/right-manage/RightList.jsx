import React,{ useState, useEffect } from 'react'
import { Table, Tag, Button, Modal  } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined   } from '@ant-design/icons';
import axios from 'axios';
export default function RightList() {
  const [dataSource, setdataSource] = useState();
  const { confirm }  = Modal;
  useEffect(()=>{
    axios.get("http://localhost:8000/rights?_embed=children").then(res=>{
      const list =res.data;
      list.map((item)=>
        item.children.length === 0 ? item.children = "" : item
      )
      setdataSource(list);
    })
  },[]);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return  <Tag color='orange'>{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return  <div>
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={()=>{
            confirmMethod(item)
          }} />
          <Button type="primary" shape="circle" icon={<EditOutlined />} />
        </div>
      }
    },
    
  ];
  //删除权限列表中的权限提示信息框
  const confirmMethod = (item) =>{
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
  //删除列表权限的方法   当前页面同步删除 +后端也删除===删除成功
  const deletedMethod = (item) => {
    // console.log(111);
    // setdataSource(dataSource.filter(data => data.id !== item.id));
    // axios.delete(`http://localhost:8000/rights/${item.id}`);   
    //删除一级



    //删除二级
    if(item.grade === 1){
      setdataSource(dataSource.filter(data => data.id !== item.id));
      axios.delete(`http://localhost:8000/rights/${item.id}`);   
    }else{
      console.log(item.rightId);
      let list = dataSource.filter(data => data.id === item.rightId);
      list[0].children =list[0].children.filter(data => data.id !== item.id);
      setdataSource([...dataSource])
      axios.delete(`http://localhost:8000/children/${item.id}`);
    }






  }
  
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
       pagination={
        {
          pageSize:5
        }
       }
       />;
    </div>
  )
}

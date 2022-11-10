import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover,Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import style from './RightList.module.css';
export default function RightList() {
  const [dataSource, setdataSource] = useState();
  const { confirm } = Modal;
  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then(res => {
      const list = res.data;
      list.map((item) =>
        item.children.length === 0 ? item.children = "" : item
      )
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
    // if(item.grade === 1){
    //   axios.patch(`http://localhost:8000/rights/${item.id}`,{
    //     pagepermisson:item.pagepermisson
    //   })
    // }
    // else{
    //   axios.patch(`http://localhost:8000/children/${item.id}`,{
    //     pagepermisson:item.pagepermisson
    //   })
    // }
    item.grade === 1 ? axios.patch(`http://localhost:8000/rights/${item.id}`,{
      pagepermisson:item.pagepermisson
    }) : axios.patch(`http://localhost:8000/children/${item.id}`,{
      pagepermisson:item.pagepermisson
    })
  }
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
        return <Tag color='orange'>{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => {
            confirmMethod(item)
          }} />
          <Popover title="页面配置" content={content(item)} trigger={ item.pagepermisson === undefined ? "" : 'click'}>
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled ={item.pagepermisson === undefined}/>
          </Popover>

        </div>
      }
    },

  ];
  //删除权限列表中的权限提示信息框
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
  //删除列表权限的方法   当前页面同步删除 +后端也删除===删除成功
  const deletedMethod = (item) => {
    // console.log(111);
    // setdataSource(dataSource.filter(data => data.id !== item.id));
    // axios.delete(`http://localhost:8000/rights/${item.id}`);   
    //删除一级



    //删除
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
      <Table dataSource={dataSource} columns={columns}
        pagination={
          {
            pageSize: 5
          }
        }
      />;
    </div>
  )
}

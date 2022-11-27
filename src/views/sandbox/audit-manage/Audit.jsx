import React, { useEffect, useState } from 'react';
// import {} from 'react-router-dom'
import { Table, Button, notification } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import axios from 'axios'
export default function Audit() {
  const [dataSource, setdataSource] = useState();
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"));
  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3": "editor",
  }
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      // console.log(res.data);
      const list = res.data;
      console.log(list);
      setdataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor"),
      ]);
    })
  }, [roleId, username, region])

  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category, item) => {
        return <div>
          {category.title}
        </div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" shape="round" onClick={() => { handleAudit(item,2,1) }}><CheckOutlined /></Button>
          <Button type="danger" shape="round" onClick={() => { handleAudit(item,3,0)}}><CloseOutlined /></Button>
        </div>
      }
    },
  ];
  //通过
  const handleAudit = (item, auditState, publishState) => {
    setdataSource(dataSource.filter(data => data.id !== item.id));
    axios.patch( `/news/${item.id}`,{
      auditState,
      publishState
    }).then(res=>{
      notification.info({
        message: `通知`,
        description:
          `您的新闻成功处理`,
        placement: "topRight"
      });
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={
          {
            pageSize: 5
          }
        }
        rowKey={item => item.id}
      />;
    </div>
  )
}

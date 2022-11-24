
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Modal, } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
export default function NewsDraft() {
  const navigate = useNavigate()
  const [dataSource, setdataSource] = useState();
  const { confirm } = Modal;
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      console.log(res);
      const list = res.data;
      console.log(list);
      // list.map((item) =>
      //   // item.children.length === 0 ? item.children = "" : item
      // )
      setdataSource(list);
    })
  }, [username]);
  //页面配置项的开关

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类信息',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => { confirmMethod(item) }} />
          <Button type="primary" shape="circle" icon={<EditOutlined />}  onClick={() => { updateNews(item) }}/>
          <Button type="primary" shape="circle" icon={<UploadOutlined />} />
        </div>
      }
    },

  ];
  const updateNews = (item) => {
    navigate(`/news-manage/update/${item.id}`)
  }
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
    setdataSource(dataSource.filter(data => data.id !== item.id));
    axios.delete(`/news/${item.id}`);
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


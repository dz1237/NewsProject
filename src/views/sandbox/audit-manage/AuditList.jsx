import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
export default function AuditList() {
  const navigate = useNavigate()
  const { username } = JSON.parse(localStorage.getItem("token"));
  const [dataSource, setdataSource] = useState([]);
  useEffect(() => {
    axios(`news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      // console.log(res.data);
      setdataSource(res.data)
    })
  }, [username])
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState, item) => {
        const colorList = ["", 'orange', 'green', 'red']
        const auditList = ["草稿箱", '审核中', '已通过', '未通过']
        return <Tag color={colorList[auditState]}>
          {auditList[auditState]}
        </Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            item.auditState === 1 && <Button type="ghost" onClick={() => { handleRervert(item) }}>撤销</Button>
          }
          {
            item.auditState === 2 && <Button type="danger" onClick={() => { handlePublish(item) }}>发布</Button>
          }
          {
            item.auditState === 3 && <Button type="primary" onClick={() => { handleUpdate(item) }}>更新</Button>
          }
        </div>
      }
    },
  ];
  //撤销     auditState状态改成0 --->  跳转到草稿箱中
  const handleRervert = (item) => {
    console.log(item);
    setdataSource(dataSource.filter(data => data.id !== item.id));
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您的新闻成功撤销到草稿箱`,
        placement: "topRight"
      });

    })
  }
  //更新
  const handleUpdate = (item) => {
    navigate(`/news-manage/update/${item.id}`);
  }
  //发布
  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, {
      publishState: 2
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您的新闻成功发布,可移至【发布管理/已发布】查看`,
        placement: "topRight"
      });
      navigate(`/publish-manage/published`)

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

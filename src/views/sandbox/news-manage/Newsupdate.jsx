
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader, Steps, Button, Select, Form, Input, message, notification } from 'antd';
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor'
import style from './index.module.css'
const items = [
  {
    title: '基本信息',
    description: "新闻标题，新闻分类",
  },
  {
    title: '新闻内容',
    description: "新闻主体内容",
  },
  {
    title: '新闻提交',
    description: "保存草稿或提交审核",
  },
];
const { Option } = Select;

export default function Newsupdate(props) {
  const navigate = useNavigate();
  const [current, setcurrent] = useState(0);
  const [categoryList, setcategoryList] = useState([]);
  const NewsForm = useRef(null);
  const param = useParams();
  const [formInfo, setformInfo] = useState({});
  const [content, setcontent] = useState("");
  const User = JSON.parse(localStorage.getItem("token"))
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        setformInfo(res)
        setcurrent(current + 1)
      }).catch(err => {
        console.log(err);
      })
    }
    else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空！")
      }
      else {
        setcurrent(current + 1)
      }

    }
  }
  const handlePrrevious = () => {
    setcurrent(current - 1)
  }
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  useEffect(() => {
    axios.get('/categories').then(res => {
      setcategoryList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/news/${param.id}?_expand=category&_expand=role`).then(res => {
        let {title, categoryId, content} = res.data;
        NewsForm.current.setFieldsValue({
            title,
            categoryId
        })
        setcontent(content)
    })
  }, [param.id])

  //子组件数据传给父组件的回调函数
  const getContent = (value) => {
    setcontent(value)
    // console.log(value);
  }
  //保存到草稿箱
  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      "content": content,
      "region": User.region?User.region:"全球",
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      "publishTime": 0
    }).then(res => {
      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list');
      notification.info({
        message: `通知`,
        description:
          `您的新闻成功保存到${ auditState === 0 ? "草稿箱":"审核列表"}`,
        placement:"topRight"
      });
    })
  }
  //提交审核
  // const handleSave = () => {

  // }
const goBackPrev = () => {
    navigate(-1)
}
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={goBackPrev}
        title="更新新闻"
        subTitle="This is a subtitle"
      />
      <Steps
        current={current}
        items={items}
      />
      <div className={style.newsAddDiv}>
        <div className={current === 0 ? "" : style.active}>
          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ref={NewsForm}
          // autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: '请输入新闻标题!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: '请选择新闻分类!',
                },
              ]}
            >
              <Select>
                {
                  categoryList.map(item => {
                    return <Option value={item.id} key={item.id}>{item.title}</Option>
                  })
                }
              </Select >
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.active}>
          <NewsEditor getContent={(value) => { getContent(value)  }} content={content}></NewsEditor>
        </div>
        <div className={current === 2 ? "" : style.active}></div>
        <div className={style.newsAddButton} >
          {
            current === 2 && <span>
              <Button type='primary' onClick={() => { handleSave(0) }} >保存到草稿</Button>
              <Button type='danger'  onClick={() => { handleSave(1) }}>提交审核</Button>
            </span>
          }
          {
            current < 2 && <Button type='primary' onClick={handleNext} >下一步</Button>
          }
          {
            current > 0 && <Button onClick={handlePrrevious}>上一步</Button>
          }
        </div>
      </div>

    </div>
  )
}

import React, { useState, useEffect,useRef } from 'react'
import { PageHeader, Steps, Button, Select, Form, Input } from 'antd';
import axios from 'axios';
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
export default function NewsAdd() {
  const [current, setcurrent] = useState(0);
  const [categoryList,setcategoryList] = useState([]);
  const handleNext = () => {
    if(current === 0 ){
      NewsForm.current.validateFields().then(res=>{
        console.log(res);
        setcurrent(current + 1)
      }).catch(err=>{
        console.log(err);
      })
    }
    else{
      setcurrent(current + 1)
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
  useEffect(()=>{
    axios.get('/categories').then(res=>{
      setcategoryList(res.data)
    })
  },[])
  const NewsForm = useRef(null)
  return (
    <div>
      <PageHeader
        className="site-page-header"
        // onBack={() => null}
        title="撰写新闻"
        subTitle="This is a subtitle"
      />
      <Steps
        current={current}
        items={items}
      />
      <div className={style.newsAddDiv}>
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
                categoryList.map(item=>{
                  return <Option value={item.id}  key={item.id}>{item.title}</Option>
                })
              }
            </Select >
          </Form.Item>



        </Form>
        <div className={style.newsAddButton} >
          {
            current === 2 && <span>
              <Button type='primary' >保存到草稿</Button>
              <Button type='danger' >提交审核</Button>
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

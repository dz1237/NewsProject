import React from 'react';
import { Form,  Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import style from './Login.module.css'
export default function Login() {
  const navigate = useNavigate()
  const onFinish = (values) => {
    axios.get(`http://localhost:8000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(
      res=>{
        console.log(res.data);
        if(res.data.length === 0) {
          message.error("账户名或密码不正确")
        }else{
          localStorage.setItem("token", JSON.stringify(res.data[0]));
          navigate("/")
        }
      }
    )
  }
  return (
    <div style={{ background: 'rgba(35,39,65)', height: "100vh" }}>
      <div className={style.formContaier}>
        <div className={style.loginTitle}>我的发布</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入正确的用户名！',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {/* <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
      </div>

    </div>
  )
}

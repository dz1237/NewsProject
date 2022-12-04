import React, { useEffect, useState } from 'react'
import { Card, Col, Row, List, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, PieChartOutlined, BarChartOutlined } from '@ant-design/icons';
import * as echarts from 'echarts/core';
import { GridComponent, TitleComponent, LegendComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import _ from 'lodash';
import axios from 'axios';
import style from './Home.module.css'


export default function Home() {
  const { Meta } = Card;
  const [viewList, setviewList] = useState([]);
  const [staList, setstaList] = useState([]);
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"));
  //用户浏览最多
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=8").then(res => {
      setviewList(res.data)
    })
  }, [])
  //点赞最多
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=8").then(res => {
      setstaList(res.data)
    })
  }, []);
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res => {
      const value = _.groupBy(res.data, item => item.category.title);
      renderBarView(value);
    });
    return () => {
      window.onresize = null
    }


  }, [])
  const renderBarView = (value) => {
    echarts.use([GridComponent, BarChart, CanvasRenderer, TitleComponent, LegendComponent]);
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;
    option = {
      title: {
        text: '新闻分类图示'
      },
      xAxis: {
        type: 'category',
        data: Object.keys(value),
        axisLabel: {
          rotate: "45"
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1

      },
      series: [
        {
          name: "数量",
          data: Object.values(value).map(item => item.length),
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    };


    option && myChart.setOption(option);
    window.onresize = () => {
      myChart.resize()
    }
  }
  return (
    <div><Row gutter={16}>
      <Col span={8}>
        <Card title="用户最常浏览" icon={<BarChartOutlined />} bordered={true}>
          <List
            size="small"
            dataSource={viewList}
            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="用户点赞最多" bordered={true}>
          <List
            size="small"
            dataSource={staList}
            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <PieChartOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={username}
            description={
              <div>
                <b>{region ? region : "全球"}</b>
                <span className={style.roleName}>{roleName}</span>
              </div>
            }
          />
        </Card>
      </Col>
    </Row>

      <div id="main" style={{ height: "700px", marginTop: "30px" }}>

      </div>
    </div>
  )
}

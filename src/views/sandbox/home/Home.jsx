import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, PieChartOutlined, BarChartOutlined } from '@ant-design/icons';
import * as echarts from 'echarts/core';
import {
  GridComponent, TitleComponent, LegendComponent, TooltipComponent
} from 'echarts/components';
import { BarChart, PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { LabelLayout } from 'echarts/features';
import _ from 'lodash';
import axios from 'axios';
import style from './Home.module.css'


export default function Home() {
  const { Meta } = Card;
  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const [allList, setallList] = useState([]);
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"));
  const [visible, setvisible] = useState(false);
  const [pieChart, setpieChart] = useState();
  const pieRef = useRef();
  //用户浏览最多
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=8").then(res => {
      setviewList(res.data)
    })
  }, [])
  //点赞最多
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=8").then(res => {
      setstarList(res.data)
    })
  }, []);
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res => {
      const value = _.groupBy(res.data, item => item.category.title);
      renderBarView(value);
      setallList(res.data)
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
  const renderPieView = (obj) => {
    let currentList = allList.filter(item=>{
      return item.author === username
     })
    let groupObj = _.groupBy(currentList, item=>item.category.title)
    let list = [];
    for(let i in groupObj){
      list.push({
        name:i,
        value:groupObj[i].length,
      })
    }
    echarts.use([
      TitleComponent,
      TooltipComponent,
      LegendComponent,
      PieChart,
      CanvasRenderer,
      LabelLayout
    ]);
    var myChart
    if (!pieChart) {
      myChart = echarts.init(pieRef.current);
      setpieChart(myChart)
    }else{
      myChart = pieChart;
    }

    var option;

    option = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          // name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);

  }
  const handleActions = async () => {
    await setvisible(true)
    renderPieView()
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
            dataSource={starList}
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
            <PieChartOutlined key="setting" onClick={handleActions} />,
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
      <Drawer title="个人新闻分类" placement="right" onClose={() => { setvisible(false) }} open={visible} width="500px" >
        <div ref={pieRef} style={{ height: "700px", marginTop: "30px" }}></div>
      </Drawer>
      <div id="main" style={{ height: "700px", marginTop: "30px" }}>

      </div>
    </div>
  )
}

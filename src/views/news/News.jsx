import React, { useEffect, useState } from 'react'
import { PageHeader, Card, Row, Col, List } from 'antd'
import _ from 'lodash';
import axios from 'axios'
export default function News() {
  const [list, setlist] = useState([])
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then(res => {
      {
        setlist(Object.entries(_.groupBy(res.data, item => item.category.title)))
      }
    })
  }, [])
  return (
    <div style={{
      width: '95%',
      margin: "0 auto",
    }}>
      <PageHeader

        // onBack={() => null}
        title="全球大新闻"
        subTitle="来看新闻"
      />
      <div className="site-card-wrapper">
        <Row gutter={[16, 16]}>
          {
            list.map(item => {
              return <Col span={8} key={item[0]}>
                <Card title={item[0]} hoverable={true} bordered={true}>
                  <List
                    size="small"
                    pagination={{ pageSize: 2 }}
                    bordered
                    dataSource={item[1]}
                    renderItem={(data) => <List.Item>
                      <a href={`#/detail/${data.id}`}>{data.title}</a>
                    </List.Item>}
                  />
                </Card>
              </Col>
            })
          }
        </Row>
      </div>
    </div>
  )
}

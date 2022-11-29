import React from 'react';
import { Button } from 'antd'
import usePublish from "../../../components/publish-manage/usePublish";
import NewsPublish from '../../../components/publish-manage/NewsPublish'
export default function Sunset() {
  const { dataSource, handleDelete } = usePublish(3);
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={
        (id) => 
          <Button danger onClick={() => { handleDelete(id) }}>
            删除
          </Button>
        }/>
    </div>
  )
}

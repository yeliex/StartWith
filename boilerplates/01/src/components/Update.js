import React, { Component } from 'react';
import { success } from './Message';
import { Modal, Icon } from 'antd';
import Sql from '../libs/db';

const updates = require('../../config/app.json').update.reverse();

let i = 0;

const UpdateItem = ({ item }) => (
  <div>
    <br />
    <b>v {item.version}</b>
    <ul>
      {
        (() => {
          const list = Array.isArray(item.description) ? item.description : [item.description];
          return list.map((content) => (<li key={i++}> - {content}</li>))
        })()
      }
    </ul>
  </div>
);

const UpdateList = ({ data }) => (
  <div>
    {
      data.map((item) => (<UpdateItem key={i++} item={item} />))
    }
  </div>
);

export function showUpdates() {
  Modal.info({
    title: '更新历史记录', content: (
      <div>
        <b>最新版本: v{updates[0].version}</b>
        <UpdateList data={updates} />
      </div>
    )
  });
}

export function showUpdateSuccess() {
  let list = [];
  if (updates.length === 1) {
    list = [updates[0]];
  } else {
    list = [updates[0], updates[1]]
  }
  Modal.success({
    title: '更新成功', content: (
      <div>
        <b>最新版本: v{updates[0].version}</b>
        <UpdateList data={list} />
        <br />
        {
          updates.length > 2 ? <a onClick={showUpdates}><Icon type="tag" /> 查看所有更新</a> : ''
        }
      </div>
    )
  });
}

export default function update() {
  const local = Sql.query('version');
  if (updates[0].version === local) {
    // latest
    success('本地环境已是最新版本');
    return;
  }
  // need update
  showUpdateSuccess();
  // update
  Sql.drop('version');
  Sql.update('version', updates[0].version);
}

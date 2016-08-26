/**
 * Creator: yeliex
 * Project: Kratos
 * Description:
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Card, Button, Dropdown, Alert, Modal, Form, Input } from 'antd';
import { setTitle, redirect } from '../../libs/util';

const $ = {
  ajax: require('node.ajax')
};

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

const wechatServer = ({ token, encodingAESKey, _id }) => {
  Modal.info({
    title: '微信服务器配置',
    content: <Form horizontal>
      <Form.Item label="URL">
        <Input type="text" readOnly value={`http://wxs.yeliex.com/api/wechat/${_id}`} />
      </Form.Item>
      <Form.Item label="Token">
        <Input type="text" readOnly value={token} />
      </Form.Item>
      <Form.Item label="EncodingAESKey">
        <Input type="text" readOnly value={encodingAESKey} />
      </Form.Item>
      <Form.Item>
        <a href="#/help" target="_blank">查看帮助</a>
      </Form.Item>
    </Form>
  });
};
const Item = ({ data }) => (
  <Card
    title={data.name}
    extra={data.varified ? <a>微信配置已验证</a> : <a
      onClick={() => wechatServer(data)}
    >查看微信配置</a>}
  >
    <p>应用ID: {data._id}</p>
    <p>公众号类型: {data.service ? '服务号' : '订阅号'} {data.officalVarified ? '已' : '未'}认证</p>
    <p>API地址:</p>
    <pre>
      <code>http://wxs.yeliex.com/api/wechat/{data._id}</code>
    </pre>
  </Card>
);

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null
    }
  }

  componentDidMount() {
    setTitle('所有应用 - WXServices');
    this.getData();
  }

  getData = () => {
    const { mobile, userkey } = this.props;
    this.setState({ loading: true, error: null });
    $.ajax(`${window.api}/app`, 'GET', { mobile, userkey }, (response) => {
      let request = response.responseText;
      try {
        request = JSON.parse(request);
        if (request.status >= 400) {
          this.setState({ loading: false, error: request.error });
        } else {
          this.setState({ loading: false, data: request.data });
        }
      } catch (e) {
        this.setState({ loading: false, error: '未知错误' });
      }
    });
  };

  render() {
    let i = 0;
    return (
      <Card title="所有应用" loading={this.state.loading}>
        {
          this.state.data.length === 0 ? (
            <Alert type="info" message="您还没有应用,快去添加一个吧" />
          ) : this.state.data.map((item) => <Item data={item} key={i++} />)
        }
      </Card>
    )
  }
}

export default connect(({ auth }) => {
  return {
    mobile: auth.mobile,
    userkey: auth.userkey
  }
})(Index);

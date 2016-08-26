import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Card,
  Cascader,
  Button,
  Dropdown,
  Select,
  Row,
  Col,
  Alert,
  Modal,
  Form,
  Menu,
  Input,
  Switch,
  Tabs,
  Checkbox,
  Radio,
  Icon
} from 'antd';
import { setTitle, redirect, className } from '../../libs/util';
import { success, error } from '../../components/Message';
import msgTypes from '../../../config/msgtypes.json';
let appsList = {};

import { actionsWithLabel, actionsWithLabelWithAll, actionsByKeys, defaultAction } from '../../../config/actions';

const $ = {
  ajax: require('node.ajax')
};

@Form.create()
class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null
    };
    this.props.apps.unshift({
      appID: 'all',
      name: '所有应用'
    });
  }

  handleSubmit = () => {
    if (this.state.loading) {
      return;
    }
    const callback = typeof this.props.onChange === 'function' ? this.props.onChange : () => '';
    this.setState({ loading: true });
    const { validateFields } = this.props.form;

    validateFields((errors, values) => {
      callback({ app: values.app, action: values.action.concat().reverse()[0] });
      this.setState({ loading: false });
    });
  };

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    };

    return (
      <Form horizontal>
        <Row>
          <Col sm={12} md={8} xs={24}>
            <Form.Item {...formItemLayout} label="选择应用">
              <Select {...getFieldProps('app', { initialValue: 'all' })}>
                {
                  this.props.apps.map((item) => (
                    <Select.Option disabled={item.disabled} key={item.appID}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col sm={12} md={8} xs={24}>
            <Form.Item {...formItemLayout} label="选择操作">
              <Cascader {...getFieldProps('action', { initialValue: [defaultAction.key] })} options={actionsWithLabelWithAll} expandTrigger="hover" placeholder=" " />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={16} xs={24}>
            <Button type="primary" size="large" loading={this.state.loading} onClick={this.handleSubmit} style={{ float: 'right' }}>提交</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

@Form.create()
class EditorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      isCallback: 'true',
      isCallbackChanged: false
    };
  }

  clearInput = () => {
    const { resetFields } = this.props.form;
    this.setState({ isCallback: 'true', isCallbackChanged: false });
    resetFields();
  };
  handleSubmit = (isEdit = false) => () => {
    if (this.state.loading) {
      return;
    }
    const callback = typeof this.props.onOk === 'function' ? this.props.onOk : () => '';

    this.setState({ error: null, loading: true });
    const { validateFields } = this.props.form;
    validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        values.actionName = values.action.concat().reverse()[0];
        values.content.isCallback = this.state.isCallback;
        $.ajax(`${window.api}/app/action/${this.props.isEdit ? 'update' : 'add'}`, 'POST', Object.assign({}, {
          mobile: this.props.mobile, userkey: this.props.userkey, data: values
        }, isEdit ? {
          id: this.props.editData._id
        } : {}), (response) => {
          let request = response.responseText;
          try {
            request = JSON.parse(request);
            if (request.status >= 400) {
              // 显示错误信息
              this.setState({ loading: false, error: request.error });
            } else {
              success('添加成功');
              this.clearInput();
              this.props.onOk();
            }
          } catch (e) {
            this.setState({ loading: false, error: '未知错误' });
          }
        });
      }
      this
        .setState({ loading: false });
    });
  };
  handleCancel = () => {
    if (!this.state.loading) {
      this.clearInput();
      this.props.onCancel();
    }
  };
  actionTypeChanged = (key) => {
    this.setState({ isCallback: key, isCallbackChanged: true });
  };
  actionValidator = (rule, value, callback) => {
    // 更新isCallback状态
    const isCallback = !this.state.isCallbackChanged && this.props.isEdit ? this.props.editData.content.isCallback : this.state.isCallback;
    switch (rule.field) {
      case 'content.messageContent': {
        if (isCallback !== 'true' && !value) {
          callback('请输入自动回复的内容');
        } else {
          callback();
        }
        break;
      }
      case 'content.callback': {
        if (isCallback === 'true' && !value) {
          callback('请输入回调地址');
        } else {
          callback();
        }
        break;
      }
      default: {
        callback();
      }
    }
  };

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    };
    const apps = [];
    this.props.apps.forEach((l) => {
      if (l.appID === 'all') {
        return;
      }
      apps.push(l);
    });
    const appProps = getFieldProps('appID', {
      rules: [{ required: true, message: '请选择一个应用以指定操作' }],
      initialValue: this.props.isEdit ? this.props.editData.appID : ''
    });
    const actionProps = getFieldProps('action', {
      rules: [{ required: true, message: '请选择要进行的操作', type: 'array' }],
      initialValue: this.props.isEdit ? this.props.editData.action : null
    });
    const nameProps = getFieldProps('name', {
      rules: [{ required: true, message: '请输入操作别名,或者备注' }],
      initialValue: this.props.isEdit ? this.props.editData.name : null
    });
    const callbackProps = getFieldProps('content.callback', {
      rules: [
        {
          required: false,
          message: '请输入正确的回调地址格式',
          type: 'url'
        },
        { validator: this.actionValidator }],
      initialValue: this.props.isEdit ? this.props.editData.content.callback : null
    });
    const messageTypeProps = getFieldProps('content.messageType', {
      initialValue: this.props.isEdit ? this.props.editData.content.messageType : 'text'
    });
    const messageContentProps = getFieldProps('content.messageContent', {
      rules: [
        {
          required: false,
          message: '请输入消息内容',
          type: 'string',
          validateTrigger: 'onChange'
        },
        { validator: this.actionValidator }],
      initialValue: this.props.isEdit ? this.props.editData.content.messageContent : null
    });

    return (
      <Modal title={this.props.isEdit ? `${this.props.editData.name} - 修改操作` : '添加新操作'} visible={this.props.visible} onOk={this.handleSubmit(this.props.isEdit)} confirmLoading={this.state.loading} onCancel={this.handleCancel} maskClosable={false} closable={false}>
        {this.state.error ? <Alert message="添加失败" description={this.state.error} type="error" /> : ''}
        <Form horizontal>
          <Form.Item {...formItemLayout} label="选择应用">
            <Select {...appProps} disabled={this.props.isEdit}>
              {
                apps.map((item) => (
                  <Select.Option disabled={item.disabled} key={item.appID}>{item.name}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item {...formItemLayout} label="选择操作">
            <Cascader {...actionProps} disabled={this.props.isEdit} options={actionsWithLabel} expandTrigger="hover" />
          </Form.Item>
          <Form.Item {...formItemLayout} label="操作别名">
            <Input {...nameProps} type="text" placeholder="备注名称,仅用于帮助识别应用" />
          </Form.Item>
          <Tabs activeKey={(!this.state.isCallbackChanged && this.props.isEdit) ? this.props.editData.content.isCallback : this.state.isCallback} onChange={this.actionTypeChanged}>
            <Tabs.TabPane tab="回调" key="true">
              <Form.Item {...formItemLayout} label="回调地址">
                <Input {...callbackProps} type="url" placeholder="http://domain.com/path" />
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane tab="自动回复" key="false">
              <Form.Item {...formItemLayout} label="消息类型">
                <Select {...messageTypeProps}>
                  {
                    Object.keys(msgTypes).map((k) => (
                      <Select.Option key={k}>{msgTypes[k]}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="消息内容">
                <Input {...messageContentProps} type="text" />
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Modal>
    )
  }
}

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      apps: [],
      error: null,
      showFilter: false,
      editorVisible: false,
      addLoading: false,
      isEdit: false,
      editData: null
    };
  }

  componentDidMount() {
    setTitle('操作管理 - WXServices');
    this.getData();
  }

  getActions = (filters) => {
    const { mobile, userkey } = this.props;
    const request = $.ajax(`${window.api}/app/actions`, 'GET', { ...filters, mobile, userkey });
    if (!request.status) {
      this.setState({ error: request.error, data: [] });
    } else {
      this.setState({ error: request.error, data: request.data });
    }
  };
  getApps = () => {
    appsList = {};
    const { mobile, userkey } = this.props;
    this.setState({ loading: true, error: null });
    $.ajax(`${window.api}/app`, 'GET', { mobile, userkey }, (response) => {
      let request = response.responseText;
      try {
        request = JSON.parse(request);
        if (request.status >= 400) {
          this.setState({ loading: false, error: request.error });
        } else {
          request.data.forEach((item) => {
            appsList[item.appID] = item;
            appsList[item._id] = item;
          });
          this.getActions();
          this.setState({ loading: false, apps: request.data });
        }
      } catch (e) {
        this.setState({ loading: false, error: '未知错误' });
      }
    });
  };
  getData = () => {
    this.getApps();
  };
  toggleFilter = () => {
    this.setState({ showFilter: !this.state.showFilter });
  };
  changeFilter = (...filters) => {
    this.getActions(...filters);
  };
  handleAddVisible = () => {
    this.setState({ editorVisible: true, isEdit: false, editData: null });
  };
  handleEditHide = () => {
    this.setState({ editorVisible: false });
    this.setState({ stamp: ++this.state.stamp });
  };
  handleEdited = () => {
    this.setState({ editorVisible: false, loading: true });
    // 重新加载
    this.getData();
  };
  handleDelete = (id, appID) => {
    $.ajax(`${window.api}/app/action/delete/${id}`, 'GET', {
      mobile: this.props.mobile,
      userkey: this.props.userkey,
      appID
    }, (request) => {
      request = request.responseJSON;
      if (request.status >= 400) {
        error(`删除失败 ${request.error}`);
      } else {
        success('删除成功');
      }
      this.getData();
    });
  };
  handleActions = (data) => ({ key, ...event }) => {
    if (!key) {
      key = event.currentTarget.attributes.key || event.currentTarget.attributes['data-key'].value;
    }
    switch (key) {
      case 'edit': {
        this.setState({ editorVisible: true, isEdit: true, editData: data });
        break;
      }
      case 'delete': {
        Modal.confirm({
          title: '您是否确认要删除这项操作配置',
          content: (<ul>
            <li>操作别名: {data.name}</li>
            <li>应用名称: {appsList[data.appID].name}</li>
            <li>操作名称: {actionsByKeys[data.actionName].value}</li>
            <li>操作描述: {actionsByKeys[data.actionName].description}</li>
            <li>回调: <Radio checked={data.content.isCallback} /></li>
            <li>
              {
                data.content.isCallback ?
                  <span>回调地址: <pre>{data.content.callback}</pre></span> :
                  <span>自动回复: {`${msgTypes[data.content.messageType]} ${data.content.messageContent}`}</span>
              }
            </li>
          </ul>),
          onOk: () => {
            this.handleDelete(data._id, data.appID);
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  };
  actionListColumns = (apps) => [
    {
      title: '应用名称',
      dataIndex: 'appID',
      render: (text) => appsList[text].name
    },
    {
      title: '操作名称',
      dataIndex: 'actionName',
      render: (text) => actionsByKeys[text].value
    },
    {
      title: '操作描述',
      key: 'description',
      dataIndex: 'actionName',
      render: (text) => actionsByKeys[text].description
    },
    {
      title: '操作',
      key: 'content',
      dataIndex: 'content',
      render: (value) => (value.isCallback === 'true' ? value.callback : `${msgTypes[value.messageType]} ${value.messageContent}`)
    },
    {
      title: '别名',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '回调',
      key: 'iscallback',
      dataIndex: 'content',
      render: (value) => <Radio checked={value.isCallback === 'true'} readOnly />
    },
    {
      title: ' ',
      key: 'edit',
      dataIndex: '_id',
      render: (value, options) => (
        <Dropdown
          type="primary"
          overlay={
            <Menu onClick={this.handleActions(options)}>
              <Menu.Item key="delete">删除</Menu.Item>
            </Menu>
          }
        >
          <a className="ant-dropdown-link" data-key="edit" onClick={this.handleActions(options)}>修改 <Icon type="down" /></a>
        </Dropdown>)
    }
  ];

  render() {
    return (
      <Card
        loading={this.state.loading}
        title={<Button type="primary" onClick={this.handleAddVisible}>新增操作</Button>}
        extra={<a onClick={this.toggleFilter}>设置筛选</a>}
      >
        <Card {...className({ hidden: !this.state.showFilter })}>
          <FilterForm apps={this.state.apps} onChange={this.changeFilter} />
        </Card>
        {this.state.error
          ? <Alert message="获取数据失败" description={this.state.error} type="error" /> : (this.state.data.length < 1
          ? <Alert message="没有符合条件的action" type="info" /> :
          (
            <Table loading={this.state.loading} dataSource={this.state.data} columns={this.actionListColumns(this.state.app)} size="middle" />
          ))
        }
        <EditorForm visible={this.state.editorVisible} isEdit={this.state.isEdit} editData={this.state.editData} mobile={this.props.mobile} userkey={this.props.userkey} apps={this.state.apps} exists={this.state.data} onOk={this.handleEdited} onCancel={this.handleEditHide} />
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

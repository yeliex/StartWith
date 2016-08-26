/**
 * Creator: yeliex
 * Project: wxs
 * Description:
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Card, Input, Select, Checkbox, Icon, Button, Modal } from 'antd';
import { redirect, setTitle } from '../../libs/util';
const $ = {
  ajax: require('node.ajax')
};

class CreateAppForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isOrganization: false,
      isService: false
    }
  }

  componentDidMount() {
    setTitle('新建-WXServices');

    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      organization: 'false',
      service: 'false'
    })
  }

  handleOrganizationVarify = (rule, value, callback) => {
    this.setState({ isOrganization: value === 'true' });
    callback();
  };

  handleServiceVarify = (rule, value, callback) => {
    if (value === 'true') {
      const { setFieldsValue } = this.props.form;
      setFieldsValue({
        organization: 'true'
      });
      this.setState({ isService: true, isOrganization: true });
    } else {
      this.setState({ isService: false });
    }
    callback();
  };

  handleSubmit = () => {
    if (this.state.loading) {
      return;
    }

    const { validateFields } = this.props.form;

    validateFields((errors, values) => {
      const showError = (content = '未知错误', title = '添加失败') => {
        Modal.error({
          title,
          content
        });
      };

      if (!errors) {
        this.setState({ loading: true });
        $.ajax(`${window.api}/app/add`, 'POST', {
          ...values,
          mobile: this.props.mobile,
          userkey: this.props.userkey
        }, (response) => {
          let result = response.responseText;
          try {
            result = JSON.parse(result);
            if (result.status < 400) {
              Modal.success({
                title: '添加成功',
                content: (
                  <div>
                    <p>您已成功添加 {values.name}</p>
                    <br />
                    <p>ID: <span style={{ WebkitUserSelect: 'text' }}>{result.data}</span></p>
                    <br />
                    <p>您可以在 "我的应用中" 查看应用信息,请求接口,以及申请上架</p>
                  </div>),
                onOk: () => {
                  redirect('/app');
                }
              })
            } else {
              showError(result.error);
            }
          } catch (e) {
            showError();
          }
          this.setState({ loading: false });
        });
      } else {
        showError(errors instanceof Array ? errors.join(',') : errors);
      }
    });
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };

    const { getFieldProps, setFieldValue } = this.props.form;

    const nameProps = getFieldProps('name', {
      rules: [
        { required: true, message: '请输入应用名称' }
      ]
    });

    const appIDProps = getFieldProps('appID', {
      rules: [
        { required: true, message: '请输入 微信管理后台->基本配置 中的AppID' }
      ]
    });

    const appSecretProps = getFieldProps('appSecret', {
      rules: [
        { required: true, message: '请输入 微信管理后台->基本配置 中的AppSecret' }
      ]
    });

    const officalIDProps = getFieldProps('officalID', {
      rules: [
        { required: true, message: '请输入 微信管理后台->公众号设置 下方的原始ID' }
      ]
    });

    const serviceProps = getFieldProps('service', {
      rules: [
        { required: true, message: '请如实选择公众号类型' },
        { validator: this.handleServiceVarify },
        { initialVale: 'false' }
      ]
    });

    const organizationProps = getFieldProps('organization', {
      rules: [
        { required: true },
        { validator: this.handleOrganizationVarify },
        { initialVale: 'false' }
      ]
    });

    const verifiedProps = getFieldProps('officalVarified');

    return (
      <Form horizontal>
        <Card title="新建">
          <div style={{ maxWidth: 480 }}>
            <Form.Item {...formItemLayout} label="应用名称">
              <Input {...nameProps} type="text" placeholder="微信公众号/项目代号" />
            </Form.Item>
            <Form.Item {...formItemLayout} label="AppID">
              <Input {...appIDProps} type="text" placeholder="微信AppID" />
            </Form.Item>
            <Form.Item {...formItemLayout} label="AppSecret">
              <Input {...appSecretProps} type="text" placeholder="微信AppSecret" />
            </Form.Item>
            <Form.Item {...formItemLayout} label="原始ID">
              <Input {...officalIDProps} type="text" placeholder="微信公众号原始ID" />
            </Form.Item>
            <Form.Item {...formItemLayout} label="类型">
              <Select {...serviceProps}>
                <Select.Option value="false">订阅号</Select.Option>
                <Select.Option value="true">服务号</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item {...formItemLayout} label="主体">
              <Select {...organizationProps} style={{ maxWidth: '60%' }}>
                <Select.Option value="false" disabled={this.state.isService}>个人</Select.Option>
                <Select.Option value="true">企业</Select.Option>
              </Select>
              <Checkbox {...verifiedProps} defaultChecked={false} disabled={!this.state.isService || !this.state.isOrganization} style={{ paddingLeft: '10%' }}>已认证</Checkbox>
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" loading={this.state.loading} onClick={this.handleSubmit}>提交</Button>
            </Form.Item>
          </div>
        </Card>
      </Form>
    )
  }
}

const NewForm = Form.create()(connect(({ auth }) => {
  return {
    mobile: auth.mobile,
    userkey: auth.userkey
  };
})(CreateAppForm));

export default NewForm;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace, goBack } from 'react-router-redux';
import { setTitle, redirect } from '../../libs/util';
import { Form, Input, Button, Card } from 'antd';
import { Nav } from '../../components/Navigation';
import { error } from '../../components/Message';
import { LOGIN_START, LOGIN_LOGOUT } from '../../store/types';

setTitle('login');

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.dispatch({
      type: LOGIN_LOGOUT
    });
  }

  handleLogin = () => {
    const { getFieldValue } = this.props.form;
    const mobile = getFieldValue('user');
    const password = getFieldValue('password');

    if (!mobile.match(/^1[3|4|5|7|8][0-9]\d{4,8}$/) || !password) {
      error('登录失败,用户名或密码不能为空');
      return;
    }

    this.props.dispatch({
      type: LOGIN_START,
      payload: {
        mobile, password
      }
    });
  };
  handleRegister = () => {
    redirect('/auth/register');
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    };

    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;

    const mobileProps = getFieldProps('user', {
      rules: [
        { required: true, message: '请输入正确的手机号' }
      ]
    });

    const passwordProps = getFieldProps('password', {
      rules: [
        { required: true, whitespace: true, message: '请输入密码' }
      ]
    });

    return (
      <div>
        <Nav fixed position="top" />
        <main>
          <Form horizontal form={this.props.form}>
            <Card title="权限验证">
              <Form.Item {...formItemLayout} label="手机号">
                <Input type="tel" {...mobileProps} maxLength="11" defaultValue={this.props.mobile || ''} />
              </Form.Item>
              <Form.Item {...formItemLayout} label="密码">
                <Input type="password" {...passwordProps} />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 22 }}>
                <Button size="large" disabled={this.props.userkey} className="right" type="primary" onClick={this.handleLogin} loading={this.props.onlogin}>登录</Button>
                <Button size="large" className="right" type="ghost" onClick={this.handleRegister}>注册</Button>
              </Form.Item>
            </Card>
          </Form>
        </main>
      </div>
    )
  }
}

const Login = Form.create()(connect(({ auth }) => {
  return {
    userkey: auth.userkey,
    user: auth.user,
    mobile: auth.mobile,
    onlogin: auth.onlogin
  };
})(LoginForm));

export default Login;

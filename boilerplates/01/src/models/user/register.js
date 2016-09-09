import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace, goBack } from 'react-router-redux';
import { setTitle, redirect } from '../../libs/util';
import { Form, Input, Button, Card } from 'antd';
import { Nav } from '../../components/Navigation';
import { REGISTER_START, SMS_SEND } from '../../store/types';

setTitle('register');

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sended: false,
      mobileLength: 0,
      mobileChecked: false,
      varifyLength: 0,
      mobile: '',
      passwordChecked: false
    }
  }

  handleMobileVarify = (rule, value, callback) => {
    if (!value) {
      return;
    }

    this.setState({ mobileLength: value.length });

    if (value.length !== 11 || !value.match(/^1[3|4|5|7|8][0-9]\d{4,8}$/)) {
      this.setState({ mobileChecked: false });
      callback('请输入正确的手机号');
      return;
    }
    this.setState({ mobileChecked: true, mobile: value });

    callback();
  };
  handleLogin = () => {
    redirect('/auth/login');
  };
  handleRegister = (e) => {
    e.preventDefault();
    const { getFieldValue } = this.props.form;
    const { validateFields } = this.props.form;
    // 验证手机号与密码
    validateFields(['passwordVarify', 'user', 'password', 'varify'], { force: true }, (errors, { password, user, varify }) => {
      this.props.dispatch({
        type: REGISTER_START,
        payload: {
          user, password, varify
        }
      });
    });
  };
  handleSend = (mobile = this.state.mobile) => {
    if (this.props.sms.onsending || !!this.props.sms.count) {
      throw new Error('sms on sending');
    }

    if (mobile.preventDefault) {
      mobile.preventDefault();
      mobile = this.state.mobile;
    }

    this.props.dispatch({
      type: SMS_SEND,
      payload: {
        type: 'varify',
        mobile
      }
    });

    this.setState({ sended: true });
  };
  handlePasswordVarify = (rule, value, callback) => {
    const { validateFields } = this.props.form;
    if (value) {
      validateFields(['passwordVarify'], { force: true });
    }
    callback();
  };
  handlePasswordCheck = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;

    this.setState({ passwordChecked: false });

    if (value && value.length >= 6 && value !== getFieldValue('password')) {
      callback('两次输入密码不一致！');
    } else if (value && value.length >= 6) {
      this.setState({ passwordChecked: true });
      callback();
    }
  };
  handleVarifyVarify = (rule, value, callback) => {
    if (value && !value.match(/^\d{6}$/)) {
      this.setState({ varifyLength: value.length });
      callback('请输入6位数字验证码');
    } else {
      this.setState({ varifyLength: 6 });
      callback();
    }
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    };

    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;

    const mobileProps = getFieldProps('user', {
      rules: [
        { required: true, message: '请输入正确的手机号' },
        { validator: this.handleMobileVarify }
      ]
    });
    const passwordProps = getFieldProps('password', {
      rules: [
        { required: true, min: 6, whitespace: true, message: '请输入密码,最少6位,不能有空格' },
        { validator: this.handlePasswordVarify }
      ]
    });
    const varifyPasswordProps = getFieldProps('passwordVarify', {
      rules: [
        { required: true, whitespace: true, message: '请再次输入密码,不能有空格' },
        { validator: this.handlePasswordCheck }
      ]
    });
    const varifyProps = getFieldProps('varify', {
      rules: [
        { required: true, message: '请输入6位数字验证码' },
        { validator: this.handleVarifyVarify }
      ]
    });

    return (
      <div>
        <Nav fixed position="top" />
        <main>
          <Form horizontal form={this.props.form}>
            <Card title="注册">
              <Form.Item {...formItemLayout} label="手机号">
                <Input type="tel" {...mobileProps} maxLength="11" defaultValue={this.props.mobile || ''} />
              </Form.Item>
              <Form.Item {...formItemLayout} label="验证码">
                <Input
                  type="tel"
                  {...varifyProps}
                  addonAfter={(
                    <Button
                      style={{
                        background: 'transparent',
                        border: 'none',
                        paddingLeft: 0
                      }} size="small" disabled={this.state.varifyLength === 6 || this.state.mobileLength !== 11 || !this.state.mobileChecked || this.props.sms.onsending} type="ghost" onClick={this.handleSend} loading={this.props.sms.onsending}
                    >
                      {!!this.props.sms.count ? this.props.sms.count : (this.state.sended ? '重新发送' : '发送验证码')}
                    </Button>
                  )}
                  maxLength="6"
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="密码">
                <Input type="password" {...passwordProps} />
              </Form.Item>
              <Form.Item {...formItemLayout} label="确认密码">
                <Input type="password" {...varifyPasswordProps} />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 22 }}>
                <Button size="large" disabled={this.state.mobileLength !== 11 || !this.state.mobileChecked || this.state.varifyLength !== 6 || !this.state.passwordChecked} className="right" type="primary" onClick={this.handleRegister} loading={this.props.onRegister}>注册</Button>
              </Form.Item>
              <Form.Item wrapperCol={{ span: 22 }}>
                <a size="small" className="right" onClick={this.handleLogin}>已有账号</a>
              </Form.Item>
            </Card>
          </Form>
        </main>
      </div>
    )
  }
}

const Login = Form.create()(connect(({ auth, sms }) => {
  return {
    mobile: auth.user,
    onRegister: auth.onRegister,
    sms
  };
})(LoginForm));

export default Login;

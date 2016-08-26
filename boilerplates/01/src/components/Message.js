/**
 * Creator: yeliex
 * Project: Kratos
 * Description:
 */
import React from 'react';
import { message } from 'antd';

const { config, destroy } = message;

message.config({
  top: '20%'
});

export function success(msg, duration = 1500) {
  return message.success(msg, duration / 1000);
}

export function error(msg, duration = 1500) {
  return message.error(msg, duration / 1000);
}

export function info(msg, duration = 1500) {
  return message.info(msg, duration / 1000);
}

export default info;

export function warning(msg, duration = 1500) {
  return message.warning(msg, duration / 1000);
}

export function loading(msg, duration = 1500, autoClose = false) {
  const Target = message.loading(msg, duration / 1000);
  if (autoClose) {
    setTimeout(Target, duration);
  }

  return Target;
}

export {
  config, destroy
}

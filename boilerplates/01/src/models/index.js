import React, { Component } from 'react';
import { setTitle, redirect } from '../libs/util';

class Index extends Component {
  componentDidMount() {
    setTitle();
  }

  render() {
    return (
      <div>
        wxs
      </div>
    )
  }
}

export default Index;

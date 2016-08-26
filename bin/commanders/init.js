/**
 * Creator: yeliex
 * Project: StartWith
 * Description:
 */

const types = {
  plugin: {
    id: '00',
    description: 'use plugin to init'
  },
  react: {
    description: 'use react to init'
  },
  redux: {
    description: 'use react-redux to init'
  },
  sagas: {
    id: '01',
    description: 'use react-redux-sagas to init'
  }
};

const tar = require('tar-fs');
const fs = require('fs');
const { join } = require('path');
const child = require('child_process');

module.exports = {
  command: 'init',
  desc: 'init project',
  builder: (yargs) => {
    yargs = yargs.usage('Usage: StartWith init [option]').help();

    Object.keys(types).forEach((type, i) => {
      const option = {
        boolean: true,
        description: types[type].description
      };
      if (i === 0) {
        option.alias = 'default';
      }
      yargs = yargs.option(type, option);
    });
    return yargs;
  },
  handler: (yargs) => {
    const selected = (() => {
        if (yargs.sagas) {
          return 'sagas';
        }
        if (yargs.redux) {
          return 'redux';
        }
        if (yargs.react) {
          return 'react';
        }
      })() || 'plugin';

    const id = types[selected].id;

    if (!id) {
      others.help('not defined');
      process.exit();
    }
    console.log(`\n${new Date} 正在获取模板`);
    const templatePath = join(__dirname, `../../depends/${id}.start`);
    if (!fs.statSync(templatePath)) {
      others.help('not defined');
      process.exit();
    }
    console.log(`${new Date} 正在分析路径`);
    // 获取当前路径
    const targetPath = process.env.PWD;
    // 解压文件
    fs.createReadStream(templatePath).pipe(tar.extract(targetPath));

    console.log(`${new Date} 模板释放完成\n`);

    console.log(`${new Date} 解决依赖`);

    const runner = child.spawn('npm', ['install'], {
      stdio: "inherit"
    });

    runner.on('close', () => {
        console.log(`${new Date} 初始化完成\n`);
        openFinder();
      }
    );

    function openFinder() {
      if (require('os').platform() === 'darwin') {
        const openFinder = child.exec('open', [process.cwd()]);
        openFinder.on('close', () => {
          process.exit();
        })
      } else {
        process.exit();
      }
    }


  }
};

#!/usr/bin/env node

const tar = require('tar-fs');
const { join } = require('path');
const fs = require('fs');
const { sync:rimraf } = require('rimraf');

// 读取boilerplates文件夹中的文件
const path = join(__dirname, '../boilerplates');
const outPath = join(__dirname, '../depends');

// 清空outPath
console.log(`${new Date} 删除旧文件`);

rimraf(outPath);

console.log(`${new Date} 分析新模板`);

if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath);
}

const objects = fs.readdirSync(path);

objects.forEach((file) => {
  const current = join(path, file);
  const currentOut = join(outPath, `${file}.start`);
  if (current.match(/\.DS_Store/g)) {
    return;
  }
  // 判断是否是文件夹
  if (!fs.statSync(current).isDirectory()) {
    return;
  }
  tar.pack(current, {
    ignore: (name) => {
      return name === '.DS_Store' || name === '.git' || name === '.idea'
    }
  }).pipe(fs.createWriteStream(currentOut));

  console.log(`${new Date} boilerplates/${file} => depends${file}.tar success`);
});

console.log(`${new Date()} success\n`);
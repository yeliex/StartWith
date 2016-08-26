const fs = require('fs');
const { join } = require('path');
const { sync: rimraf } = require('rimraf');

module.exports = {
  command: 'cleanup',
  desc: 'cleanup the folder',
  builder: (yargs) => yargs
    .usage('Usage: StartWith cleanup -y')
    .help()
    .option('y', {
      alias: 'yes',
      boolean: true,
      description: 'agree to cleanup the folder'
    })
    .option('f', {
      alias: 'force',
      boolean: true,
      description: 'remove folder self as well'
    }),
  handler: (yargs) => {
    if (!yargs.yes) {
      yargs.help();
      process.exit();
    }

    const path = process.env.PWD;
    if (path.match(/StartWith/g)) {
      return;
    }

    const count = {
      file: 0,
      fileSuccess: 0,
      dir: 0,
      dirSuccess: 0
    };

    const remove = (path) => {
      const state = fs.statSync(path);
      if (state.isDirectory()) {
        const files = fs.readdirSync(path);
        files.forEach((file) => {
          remove(join(path, file));
        });
        if (path !== process.env.PWD || yargs.self) {
          count.dir++;
          fs.rmdirSync(path);
          count.dirSuccess++;
        }
        console.log(path, `${'\033[1;32m'}Success${'\033[0m'}`)
      } else {
        count.file++;
        const res = fs.unlinkSync(path);
        if (!res) {
          count.fileSuccess++;
        }
        console.log(path, !res ? `${'\033[1;32m'}Success${'\033[0m'}` : `${'\033[0;31m'}${res}${'\033[0m'}`)
      }
    };

    remove(path);

    console.log(`\nPROCESS FINISHED.\nDelete success ${'\033[4m'}${count.fileSuccess} of ${count.file}${'\033[0m'} files and ${'\033[4m'}${count.dirSuccess} of ${count.dir}${'\033[0m'} directories\n`)
  }
};

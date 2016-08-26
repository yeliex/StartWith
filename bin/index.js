#!/usr/bin/env node

const commander = require('yargs');
const { join } = require('path');

commander
  .commandDir(join(__dirname, 'commanders'), { recurse: true })
  .usage('Usage: StartWith <command> [options]')
  .demand(1)
  .help()
  .showHelpOnFail(true, 'Specify --help for available options\n')
  .argv;

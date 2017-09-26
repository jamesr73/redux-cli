import yargs from 'yargs';

const usage = `Usage:
  $0 <command> [arguments] [options]
  $0 help <command>`;

const parser = yargs
  .usage(usage)
  .commandDir('cmds')
  .alias('help', 'h')
  .alias('version', 'V')
  .global('version', false)
  .demandCommand(1, 'Please specify a command to execute');

export default parser;

import yargs from 'yargs';

const usage = `Usage:
  $0 <command> [arguments] [options]
  $0 help <command>`;

const parser = yargs
  .usage(usage)
  .commandDir('cmds')
  .demandCommand(1, 'Provide a command to run')
  .recommendCommands()
  .strict()
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'V')
  .global('version', false)
  // TODO: add epilogue after renaming repo to blueptint-cli
  //.epilogue('See https://github.com/SpencerCDixon/redux-cli for more info');

export default parser;

import Init from '../../sub-commands/init';

const subCommand = new Init();

module.exports = {
  command: 'init',
  describe: 'Initialize .reduxrc for the current project',
  handler: () => subCommand.run()
};

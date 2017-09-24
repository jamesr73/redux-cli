module.exports = {
  description() {
    return 'Generates a blueprint with desired hooks';
  },

  command: {
    aliases: ['bp'],
    builder: yargs =>
      yargs
        .option('description', {
          alias: 'D',
          describe: 'override default description',
          type: 'boolean'
        })
        .option('command', {
          alias: 'c',
          describe: 'add hook to specify blueprint command options',
          type: 'boolean'
        })
        .option('locals', {
          alias: 'l',
          describe: 'add hook to specify locals',
          type: 'boolean'
        })
        .option('file-map-tokens', {
          alias: 'm',
          describe: 'add hook for fileMapTokens',
          type: 'boolean'
        })
        .option('before-install', {
          alias: 'b',
          describe: 'add hook for beforeInstall',
          type: 'boolean'
        })
        .option('after-install', {
          alias: 'a',
          describe: 'add hook for afterInstall',
          type: 'boolean'
        })
  },

  locals({ entity: { options } }) {
    return options;
  }
};

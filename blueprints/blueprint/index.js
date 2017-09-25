module.exports = {
  description() {
    return 'Generates a blueprint with desired hooks';
  },

  command: {
    aliases: ['bp'],
    builder: (yargs, blueprint) =>
      yargs
        .option('description', {
          alias: 'D',
          describe: 'override default description',
          type: 'boolean',
          default: blueprint.settings.description
        })
        .option('command', {
          alias: 'c',
          describe: 'add hook to specify blueprint command options',
          type: 'boolean'
        })
        .option('aliases', {
          alias: 'A',
          describe: 'specify alias(es) for the command',
          type: 'array',
          default: []
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
        .option('all-hooks', {
          alias: 'H',
          describe: 'shortcut to add all hooks, equivalent to -clmba',
          type: 'boolean'
        })
  },

  locals({ entity: { options } }) {
    return sanitizeOptions(options);
  }
};

function sanitizeOptions(options) {
  // aliases imply command
  if (options.aliases.length) {
    options.command = true;
  }
  // aliases to be rendered as a string
  options.aliases = JSON.stringify(options.aliases);

  // NB: if command was specified but aliases is an empty array it will
  // still be rendered. This is harmless and serves as a reminder
  // to the blueprint author of the supported feature and syntax

  // allHooks?
  if (options.allHooks) {
    options.command = true;
    options.locals = true;
    options.fileMapTokens = true;
    options.beforeInstall = true;
    options.afterInstall = true;
  }

  return options;
}

import Generate from '../../sub-commands/generate';
import Blueprint from '../../models/blueprint';

const subCommand = new Generate();

const usage = `Usage:
  $0 generate <blueprint> <name>
  $0 help generate <blueprint>`;

module.exports = {
  command: 'generate <blueprint> <name>',
  aliases: ['g', 'gen'],
  describe: 'Generate project file(s) from a blueprint',
  builder: yargs => {
    yargs
      .usage(usage)
      .option('dry-run', {
        alias: 'd',
        describe: "List files but don't generate them", // eslint-disable-line
        type: 'boolean'
      })
      .option('verbose', {
        alias: 'v',
        describe: 'Verbose output, including file contents',
        type: 'boolean'
      })
      .group(['dry-run', 'verbose', 'help'], 'Generate Options:')
      .updateStrings({
        'Commands:': 'Blueprints:',
        'Options:': 'Blueprint Options:'
      });
    buildBlueprintCommands(yargs);
  },
  handler: argv => console.log(`Unrecognised blueprint '${argv.blueprint}'`)
};

/*
  Construct yargs sub commands for each available blueprint, allowing additional
  options to be specified in the blueprint itself and in the rc file(s)
*/
const buildBlueprintCommands = yargs => {
  /*
    Build a yargs command module object from options defined in the blueprint
    https://github.com/yargs/yargs/blob/master/docs/advanced.md#providing-a-command-module

    {
      command: 'blueprint <name>',
      aliases: [],
      describe: 'Generates a blueprint',
      builder: yargs => yargs,
      handler: argv => subCommand.run()
    }
  }
  */
  const customCommand = blueprint => {
    let custom = blueprint.command || {};
    let { aliases = [], usage, options, check, examples, sanitize } = custom;

    // mandate the command name to guarantee name is passed to generate task
    let command = `${blueprint.name} <name>`;

    // alert the user to the prescense of options for the command
    if (options) {
      command = command + ' [options]';
    }

    // rc aliases override blueprint configuration
    aliases = [].concat(blueprint.settings.aliases || aliases);

    // default usage
    if (!usage) {
      usage = `Usage:\n  $0 generate ${command}`;
      aliases.forEach(
        alias =>
          (usage += `\n  $0 generate ${command.replace(blueprint.name, alias)}`)
      );
    }

    // default options from settings
    if (options && blueprint.settings) {
      Object.keys(options).forEach(option => {
        if (blueprint.settings[option]) {
          options[option].default = blueprint.settings[option];
        }
      });
    }

    // builder brings together multiple customizations, whilst keeping the
    // options easy to parse for prompting in the init command
    const builder = yargs => {
      if (usage) yargs.usage(usage);
      if (options) yargs.options(options);
      if (check) yargs.check(check, false);
      if (examples) {
        [].concat(examples).forEach(example => yargs.example(example));
      }
      return yargs;
    };

    // handler runs the generate blueprint task
    const handler = argv => {
      // merge command line options into rc options
      let options = { ...blueprint.settings, ...argv };

      // tidy up options before passing them on so that all hooks have access
      // to the clean version
      if (sanitize) options = sanitize(options);

      const cliArgs = {
        entity: {
          name: argv.name,
          options,
          rawArgs: argv
        },
        debug: argv.verbose,
        dryRun: argv.dryRun
      };
      subCommand.run(blueprint.name, cliArgs);
    };

    return {
      command,
      aliases,
      describe: blueprint.description(),
      builder,
      handler
    };
  };

  /*
    Build a command for each of the blueprints found on the search path
  */
  Blueprint.loadRunnable().forEach(blueprint => {
    loadBlueprintSettings(blueprint);
    yargs.command(customCommand(blueprint));
  });

  return yargs;
};

/*
  TODO:
    refactor this into a blueprint loader task (that also replaces
    Blueprint.loadRunnable). Only here to test the concept.
*/
const settings = subCommand.environment.settings.settings || {};
settings.bp = settings.bp || {};
const loadBlueprintSettings = blueprint => {
  const blueprintSettings = getBlueprintSettings(blueprint);
  blueprint.settings = blueprintSettings;
  return blueprintSettings;
};
const getBlueprintSettings = blueprint => ({
  ...settings.bp.common,
  ...settings.bp[blueprint.name]
});

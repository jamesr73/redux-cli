import Generate from '../../sub-commands/generate';
import Blueprint from '../../models/blueprint';

const subCommand = new Generate();

const usage = `Usage:
  $0 generate <blueprint> <name> [options]
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

const buildBlueprintCommands = yargs => {
  const customCommand = blueprint => {
    let custom = blueprint.command || {};
    let builder = custom.builder || {};

    if (typeof builder === 'function' && builder.length === 2) {
      const wrappedBuilder = builder;
      builder = yargs => wrappedBuilder(yargs, blueprint);
      // opportunity here to interrogate yargs for configuration
    }

    // could do more to understand if options have been specified
    // and add [options] to the command usage

    // could also allow the blueprint to define an custom <name> and/or
    // more positional parameters

    return {
      ...custom,
      builder
    };
  };

  const commandHandler = blueprint => argv => {
    // would be nice to flatten this out, i.e. just pass full argv
    // rawArgs doesn't mean much with yargs
    // might be the appropriate place to consilidate .blueprintrc
    //    { ...options[default], ...options[blueprint.name], ...argv }
    // OR { ...blueprint.settings, ...argv }
    const cliArgs = {
      entity: {
        name: argv.name,
        options: argv,
        rawArgs: argv
      },
      debug: argv.verbose,
      dryRun: argv.dryRun
    };
    subCommand.run(blueprint.name, cliArgs);
  };

  const blueprintCommands = Blueprint.loadRunnable().map(blueprint => ({
    ...customCommand(blueprint),
    command: `${blueprint.name} <name>`, // can we customise <name>?
    describe: blueprint.description(),
    handler: commandHandler(blueprint)
  }));

  blueprintCommands.forEach(blueprint => yargs.command(blueprint));

  return yargs;
};

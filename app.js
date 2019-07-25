const figlet = require('figlet');
const arg = require('arg');
const fs = require('fs');
const WRITE_COMMAND_FILE_PATH = './commands/';
// const APP_ROOT

const introMessage = figlet.textSync('AuditBoard', {
  font: 'Slant',
  horizontalLayout: 'default',
  verticalLayout: 'default',
});
console.log(introMessage);

// arg parsing

function parseArgs(rawArgs) {
  const args = arg(
    {
      // 'make:command': String,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
    },
    {
      argv: rawArgs.slice(3),
    }
    );
    
    return {
      commandName: args['make:command'],
      git: args['--git'] || false,
      template: args._[0],
      runInstall: args['--install'] || false,
    };
  }
  
  function parseCommand(command) {
    // some
    const fileName = command.replace(':', '_');
    const commandExists = fs.existsSync(`./commands/${fileName}.js`);
    if (commandExists) {
      const callback = require(`./commands/make_command`);
      console.log("HOPEFULLY A FN", callback);
      // validate
      // look for command file
      // return command function
      return callback;
    }
    else {
      throw new Error('dummy');
    }
  }
  
  module.exports = function cli(args) {
    const options = parseArgs(args);
    const inputCommandString = args[2];
    const command = parseCommand(inputCommandString);
    command(options);
    // console.log(command);
    
  // if (args['make:command'] && !args['make:command'].includes(':')) {
  //   throw new Error("New commands must be prefixed with a namespace, eg 'auditboard make:command generate:model'");
  // }
  
};
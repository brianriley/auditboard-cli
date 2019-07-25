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

function parseArgs(rawArgs, commandOptions, requiredParameters) {
  const args = arg(commandOptions.args, { argv: rawArgs.slice(3) });

  
  return args._;
}
  
  function parseCommand(command) {
    // some
    const fileName = command.replace(':', '_');
    const commandExists = fs.existsSync(`${WRITE_COMMAND_FILE_PATH}${fileName}.js`);
    if (commandExists) {
      const callback = require(`${WRITE_COMMAND_FILE_PATH}${fileName}`);

      // validate
      // look for command file
      // return command function
      return callback;
    }
    else {
      throw new Error('dummy');
    }
  }
  
module.exports = function cli(rawArgs) {
  const inputCommandString = rawArgs[2];
  const { command, commandOptions, requiredParameters = [] } = parseCommand(inputCommandString);
  const options = parseArgs(rawArgs, commandOptions);
  console.log(options)
  // const options = parseArgs(rawArgs, commandOptions.args);
  
  command(options);
};
const path = require('path');
const homedir = require('os').homedir();

module.exports = {
  // will have to fix to work for using in the app root
  APP_COMMAND_FILE_PATH: path.resolve('./ab-cli-commands'),
  LOCAL_FILE_PATH: path.resolve('./node_modules/auditboard-cli/ab-cli-commands'),
  USER_FILE_PATH: path.resolve(homedir + '/.ab-cli-commands'),
};
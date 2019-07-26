const path = require('path');

module.exports = {
  // will have to fix to work for using in the app root
  APP_COMMAND_FILE_PATH: path.resolve('../../cli-commands'),
  LOCAL_FILE_PATH: path.resolve('./commands'),
};
/**
 * This helper is for fetching the command files.
 * They either live here in the local directory or
 * in the `/ab-cli-commands` file in root of the installed
 * application. You can also install commands globally.
 * They get installed in `~/.ab-cli-commands`
 */

const fs = require('fs');
const {
	USER_FILE_PATH,
	APP_COMMAND_FILE_PATH,
	LOCAL_FILE_PATH
} = require('../config');
const path = require('path');
const isGlobalNpmInstall = require('is-installed-globally');

const isFolder = (folderName) => {
	try {
		return fs.lstatSync(folderName);
	}
	catch (err) {
		if (err.code === 'ENOENT') {
			return false;
		}
		throw err;
	}
}

const isFile = (fileName) => {
	try {
		const lstat = fs.lstatSync(fileName);
		return lstat && lstat.isFile();
	}
	catch (err) {
		if (err.code === 'ENOENT') {
			return false;
		}
		throw err;
	}
}


module.exports = {
	getCommandAbsolutePaths() {
		let commandAbsolutePaths = [];
		// If package is installed globally read commands from USER_FILE_PATH and LOCAL_FILE_PATH
		const commandPaths = [USER_FILE_PATH, LOCAL_FILE_PATH];

		// if installed in a project then add APP_COMMAND_FILE_PATH to paths to check for commands
		if (!isGlobalNpmInstall) {
			commandPaths.push(APP_COMMAND_FILE_PATH);
		}

		// get all command paths
		for (const folderPath of commandPaths) {
			if (isFolder(folderPath)) {
				for (const fileName of fs.readdirSync(folderPath)) {
					// it's a real file
					if (isFile(path.join(folderPath, fileName))) {
						// absolute paths
						commandAbsolutePaths.push(path.join(folderPath, fileName));
					}
				}
			}
		}

		return commandAbsolutePaths;
	}
};

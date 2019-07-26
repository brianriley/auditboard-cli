/**
 * This helper is for fetching the command files.
 * They either live here in the local directory or
 * in the `/cli-commands` file in root of the installed
 * application.
 */

const fs = require('fs');
const { USER_FILE_PATH, APP_COMMAND_FILE_PATH, LOCAL_FILE_PATH } = require('../config');
const path = require('path');

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

		// get all command paths
		for (const folderPath of [USER_FILE_PATH, APP_COMMAND_FILE_PATH, LOCAL_FILE_PATH]) {
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
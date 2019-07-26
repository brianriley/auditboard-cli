const fs = require('fs');
const mkpath = require('mkpath');
const { promisify } = require('util');
const makePathAsync = promisify(mkpath);
const { APP_COMMAND_FILE_PATH } = require('../config');

const newCommandTemplate =
`module.exports = {
	/**
	 * args get defined by the commandOptions interface below
	 * {
	 *   "firstParam": "users", <-- required params
	 *   "options": 11 <-- optional params
	 * }
	 */
	async command(args) {
		console.log("HELLO WORLD From my new command", args);
	},
	commandOptions: {
		description: "This is your command description",
		required: [
			/**
			 * This is where you put required params
			 * arguments are parsed sequentially
			 * example: ./auditboard make:command users -o 11
			 *
			 * This segment is how it got to this 
			 */
			{
				name: "firstParam", // <-- this value will be users
				message: 'Something went wrong...', // <-- failure message if param does not exist
			},
			// ... more required params
		],
		args: {
			// these are optional parameters
			// https://www.npmjs.com/package/args
			'--option': Number,
			'-o': '--option',
		}
	}
};`;

module.exports = {
	/**
	 * args get defined by the commandOptions interface below
	 * {
	 *   "firstParam": "users", <-- required params
	 *   "options": 11 <-- optional params
	 * }
	 */
	async command(args) {
		// check if file path exists
		if (!fs.existsSync(APP_COMMAND_FILE_PATH)) {
			// write folder
			await makePathAsync(APP_COMMAND_FILE_PATH, 0700);
		}

		const commandName = args.commandName;
		const commandFileName = commandName.replace(':', '_') + '.js'


		fs.writeFileSync(`${APP_COMMAND_FILE_PATH}/${commandFileName}`, newCommandTemplate);
	},
	commandOptions: {
		description: "Create commands that will get executed by the cli",
		required: [
			{
				name: "commandName", // <-- this value will be users
				message: 'You need a command name to create a command... duh', // <-- failure message if param does not exist
			},
		],
		args: {}
	}
};
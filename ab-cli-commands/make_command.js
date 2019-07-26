const fs = require('fs');
const mkpath = require('mkpath');
const { promisify } = require('util');
const makePathAsync = promisify(mkpath);
const { APP_COMMAND_FILE_PATH, USER_FILE_PATH } = require('../config');

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
		return "Return a message and the cli will log it!";
	},
	commandOptions: {
		help: "This help string supports markdown!",
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
				message: 'Something went wrong...', // <-- (optional) failure message if param does not exist
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
const helpContent = `
# Great help should be written here.

And you can use **markdown** as you please, even though you're a \`terminal\` lover.

# Parameters:
* -g, --global Creates the command under your HOME folder, allowing it to be used anywhere (in your machine)
`;

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
		const folderPath = args.global ? USER_FILE_PATH : APP_COMMAND_FILE_PATH;
		if (!fs.existsSync(folderPath)) {
			// write folder
			await makePathAsync(folderPath, parseInt("0700", 8));
		}

		const commandName = args.commandName;
		const commandFileName = commandName.replace(/\:/g, '_') + '.js'
		const newCommandPath = `${folderPath}/${commandFileName}`;

		fs.writeFileSync(newCommandPath, newCommandTemplate);

		return `Your new command: ${commandName} was successfully created. \n Edit ${newCommandPath} to customize it.`;
	},
	commandOptions: {
		description: "Create commands that will get executed by the cli",
		help: helpContent,
		required: [
			{
				name: "commandName", // <-- this value will be users
				message: 'You need a command name to create a command... duh', // <-- failure message if param does not exist
			},
		],
		args: {
			"--global": Boolean,
			"-g": "--global"
		}
	}
};

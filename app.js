#!/usr/bin/env node

const figlet = require('figlet');
const arg = require('arg');
const fs = require('fs');
const { APP_COMMAND_FILE_PATH } = require('./config');
const LOCAL_COMMAND_PATH = './commands';

const introMessage = figlet.textSync('AuditBoard', {
	font: 'Slant',
	horizontalLayout: 'default',
	verticalLayout: 'default',
});
console.log(introMessage);

function parseArgs(rawArgs, commandOptions) {
	const args = arg(commandOptions.args, { argv: rawArgs.slice(3) });

	// loop through args._ and extract non '--' things
	const result = {};
	const failures = [];
	let index = 0;

	// if there are required parameters
	if (commandOptions.required && commandOptions.required.length) {
		// if there is no params provided
		if (!args._.length) {
			failures.push(...commandOptions.required.map(r => r.message));
		}

		for (const key of Object.keys(commandOptions.required)) {
			if (!args._[index]) {
				failures.push(commandOptions.required[index].message);
			}
			result[commandOptions.required[index].name] = args._[index];
	
			index++;
		}
	}
	
	// parse optional args
	for (const key of Object.keys(args)) {
		if (key.startsWith('--')) {
			result[key.replace('--', '')] = args[key];
		}
	}

	// throw errors
	if (failures.length) {
		console.error("Error(s) while executing command: \n", failures.join('\n'));
		process.exit(1);
	}

	return result;
}
	
function parseCommand(commandString) {
	// some
	const fileName = commandString.replace(':', '_');
	// stopgap for running make command
	console.log("LOCALFILE PATH", `${LOCAL_COMMAND_PATH}/${fileName}.js`);
	const commandExists = fs.existsSync(`${LOCAL_COMMAND_PATH}/${fileName}.js`);
	console.log("commandExists")

	if (commandExists) {
		/**
		 * {
		 *  command: function ...,
		 *  commandOptions: {
		 *    required: [
		 *      {
		 *        name: String argument name,
		 *        message: String Failure message
		 *      }
		 *    ],
		 *    // Optional params
		 *    args: {
		 *      '--option': Number,
		 *    }
		 *  }
		 * }
		 */
		const commandInterface = require(`${LOCAL_COMMAND_PATH}/${fileName}`);

		// validate
		// look for command file
		// return command function
		return commandInterface;
	}
	else {
		throw new Error('dummy');
	}
}

async function cli(rawArgs) {
  let inputCommandString = rawArgs[2];
  if (!inputCommandString) {
    inputCommandString = 'list';
  }
	const { command, commandOptions } = parseCommand(inputCommandString);
	const options = parseArgs(rawArgs, commandOptions);

	try {
		await command(options);
	}
	catch (err) {
		// do something else with error handling
		console.error(err);
		process.exit(1);
	}
};

const [,, ...rawArgs] = process.argv
cli(rawArgs);

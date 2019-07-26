#!/usr/bin/env node

const figlet = require('figlet');
const arg = require('arg');
const commandHelper = require('./utils/command');
const path = require('path');

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
	const commandPaths = commandHelper.getCommandAbsolutePaths();

	for (const item of commandPaths) {
		const commandName = path.basename(item).replace('_', ':').replace('.js', '');
		const moduleName = path.normalize(item).replace('.js', '');
		if (commandString === commandName) {
			// found the command
			return require(moduleName);
		}
	}

	throw new Error('Command not found will handle better later');
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

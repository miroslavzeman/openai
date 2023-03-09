import { Command } from 'commander';
import { request } from './request';
import { loadConfiguration, saveConfiguration } from './configuration';

const program = new Command();

/**
 * Initialize the program and load the configuration
 */
program.version('1.0.0').description('A simple ChatGPT CLI tool');

/**
 * Make sure the configuration is loaded before any action except init
 */
program.hook('preAction', (thisCommand, actionCommand) => {
  if (actionCommand.name() !== 'init') loadConfiguration();
});

/**
 * Initialize the configuration file with the API key
 */
program
  .command('init')
  .description('Initialize the tool with your API key')
  .option('-k, --apiKey <apiKey>', 'Your API key')
  .action(({ apiKey }) => saveConfiguration(apiKey));

/**
 * Handle the message to send to the AI
 */
program
  .argument('<message>', 'The message to send to the AI')
  .option('-u, --usage', 'Show the usage and price per request')
  .action((message, { usage }) => request(message, usage));

/**
 * Pass the arguments to the program
 */
program.parse(process.argv);

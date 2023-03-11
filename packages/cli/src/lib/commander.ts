import { Command } from 'commander';
import {
  loadConfiguration,
  saveConfiguration,
  updateConfiguration,
} from './configuration';
import { request } from './request';
import { clearMessages } from './messages';

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
  .description('Initialize tool configuration')
  .option('-k, --apiKey <apiKey>', 'set ChatGPT API key')
  .option('-p, --prompt <prompt>', 'set default prompt')
  .option('-l, --limit <limit>', 'set conversation history limit', '20')
  .option('-u, --usage', 'show usage and price for each message')
  .action((options) => saveConfiguration(options));

/**
 * Allow to change the default prompt message
 */
program
  .command('update')
  .description('Update tool configuration')
  .option('-k, --apiKey <apiKey>', 'update ChatGPT API key')
  .option('-p, --prompt <prompt>', 'update default prompt')
  .option('-l, --limit <limit>', 'update conversation history limit', '20')
  .option('-u, --usage', 'show usage and price for each message')
  .action((options) => updateConfiguration(options));

/**
 * Clear messages so new default prompt to be set
 */
program
  .command('clear')
  .description('Clear conversation history, so new default prompt to be set')
  .action(() => clearMessages());

/**
 * Handle the message to send to the AI
 */
program
  .argument('<message>', 'The message to send to the AI')
  .action((message) => request(message));

/**
 * Pass the arguments to the program
 */
program.parse(process.argv);

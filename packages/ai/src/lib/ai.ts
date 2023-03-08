import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();
const configPathname = path.join(__dirname, 'key.json');

/**
 * Initialize the program
 */
program.version('1.0.0').description('A simple ChatGPT CLI tool');

/**
 * Load the configuration from the file with each command
 */
program.action((_, context) => {
  if (fs.existsSync(configPathname)) {
    // Load the configuration from the file
    const fileContent = fs.readFileSync(configPathname, 'utf8');
    const loadedConfig = JSON.parse(fileContent);

    // Save the configuration to the context
    context.key = loadedConfig.key;

    if (context.key) return;
  }

  console.error(
    'No configuration file found. You must initialize the tool with your API key before you start using it.'
  );

  process.exit(1);
});

/**
 * Initialize the configuration file with the API key
 */
program
  .command('init')
  .option('-k, --key <key>', 'Your API key')
  .description('Initialize the tool with your API key')
  .action(({ key }) => {
    if (!key) {
      console.error(
        'No API key found. You must provide one with the --key option before you start using the tool.'
      );

      process.exit(1);
    }

    // Store the configuration in the file
    const config = JSON.stringify({ key });

    fs.writeFileSync(configPathname, config);
  });

/**
 * Pass the arguments to the program
 */
program.parse(process.argv);

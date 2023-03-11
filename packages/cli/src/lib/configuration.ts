import * as path from 'path';
import * as fs from 'fs';

/**
 * Persistent configuration interface
 */
export interface Configuration {
  apiKey?: string;
  prompt?: string;
  usage?: boolean;
}

const configPathname = path.join(__dirname, 'cli.configuration.json');

/**
 * Load the configuration from the file
 */
export const loadConfiguration = (): Configuration => {
  if (fs.existsSync(configPathname)) {
    // Load the configuration from the file
    const fileContent = fs.readFileSync(configPathname, 'utf8');

    return JSON.parse(fileContent);
  } else {
    console.error(
      'No configuration file found. You must initialize the tool with your API key before you start using it.'
    );

    process.exit(1);
  }
};

/**
 * Save the configuration to the file
 * @param configuration
 */
export const saveConfiguration = (configuration: Configuration) => {
  if (!configuration.apiKey) {
    console.error(
      'No API key found. You must provide one with the --apiKey option before you start using the tool.'
    );

    process.exit(1);
  }

  // Store the configuration in the file
  fs.writeFileSync(configPathname, JSON.stringify(configuration));
};

/**
 * Save the configuration to the file
 * @param configuration
 */
export const updateConfiguration = (configuration: Configuration) => {
  const updatedConfig = { ...loadConfiguration(), ...configuration };

  // Store the configuration in the file
  fs.writeFileSync(configPathname, JSON.stringify(updatedConfig));
};

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { Configuration, OpenAIApi } from 'openai';
import { ChatCompletionRequestMessage } from 'openai/api';

/**
 * The context of the program
 */
const context = {
  apiKey: undefined,
};

/**
 * The path to the configuration file
 */
const configPathname = path.join(__dirname, 'key.json');
const messagesPathname = path.join(__dirname, 'messages.json');

/**
 * Load the configuration from the file
 */
const loadConfiguration = () => {
  if (fs.existsSync(configPathname)) {
    // Load the configuration from the file
    const fileContent = fs.readFileSync(configPathname, 'utf8');
    const loadedConfig = JSON.parse(fileContent);

    // Save the configuration to the context
    context.apiKey = loadedConfig.apiKey;

    if (context.apiKey) return;
  } else {
    console.error(
      'No configuration file found. You must initialize the tool with your API key before you start using it.'
    );

    process.exit(1);
  }
};

/**
 * Save the configuration to the file
 * @param apiKey
 */
const saveConfiguration = (apiKey: string) => {
  if (!apiKey) {
    console.error(
      'No API key found. You must provide one with the --apiKey option before you start using the tool.'
    );

    process.exit(1);
  }

  // Store the configuration in the file
  const config = JSON.stringify({ apiKey });

  fs.writeFileSync(configPathname, config);
};

/**
 * Return conversation messages if they exists.
 * If not return a terminal configuration message
 */
const loadMessages = () => {
  if (fs.existsSync(messagesPathname)) {
    // Load the configuration from the file
    const fileContent = fs.readFileSync(messagesPathname, 'utf8');
    return JSON.parse(fileContent);
  } else {
    return [
      {
        role: 'system',
        content:
          'I want you to act as a linux terminal. I will ask questions and you will reply with command for terminal. I want you to only reply with the terminal command nothing else. do not write explanations. do not type commands unless I instruct you to do so. When I need to tell you something in English, I will do so by putting text inside curly brackets {like this}.',
      },
    ];
  }
};

const saveMessages = (messages: ChatCompletionRequestMessage[]) => {
  // Check amount of messages, if larger than limit, remove the oldest one.
  const limit = 10;
  const start = Math.max(0, messages.length - limit);
  const limitMessages = messages.slice(start);

  // Store the configuration in the file
  const config = JSON.stringify({ messages: limitMessages });

  fs.writeFileSync(messagesPathname, config);
};

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
  .action(async (message) => {
    const { apiKey } = context;

    const configuration = new Configuration({
      organization: 'org-nkQjz99zFnaYc9zwnMbfBoAP',
      apiKey,
    });

    const openai = new OpenAIApi(configuration);

    const messages = loadMessages();
    const newMessages = [
      ...messages,
      {
        role: 'user',
        content: message,
      },
    ];

    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: newMessages,
      });

      saveMessages(newMessages);

      console.log(response.data.choices[0].message?.content);
    } catch (err) {
      console.error(err);
    } finally {
      //loading false
    }
  });

/**
 * Pass the arguments to the program
 */
program.parse(process.argv);

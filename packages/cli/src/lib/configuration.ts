import { ChatCompletionRequestMessage } from 'openai/api';
import * as path from 'path';
import * as fs from 'fs';

interface Context {
  apiKey: string | undefined;
  showUsage: boolean;
}

/**
 * The context of the program
 */
export const context: Context = {
  apiKey: undefined,
  showUsage: false,
};

/**
 * Initial configuration message
 */
export const configurationMessage: ChatCompletionRequestMessage = {
  role: 'system',
  content:
    'I want you to act as a linux terminal. I will ask questions and you will reply with command for terminal. I want you to only reply with the terminal command nothing else. do not write explanations. do not type commands unless I instruct you to do so. When I need to tell you something in English, I will do so by putting text inside curly brackets {like this}.',
};

/**
 * The path to the configuration file
 */
const configPathname = path.join(__dirname, 'key.json');
const messagesPathname = path.join(__dirname, 'messages.json');

/**
 * Load the configuration from the file
 */
export const loadConfiguration = () => {
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
export const saveConfiguration = (apiKey: string) => {
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
export const loadMessages = () => {
  if (fs.existsSync(messagesPathname)) {
    // Load the configuration from the file
    const fileContent = fs.readFileSync(messagesPathname, 'utf8');
    return JSON.parse(fileContent);
  } else {
    return [configurationMessage];
  }
};

/**
 * Save messages history to the file to keep the chat history state.
 * @param messages
 */
export const saveMessages = (messages: ChatCompletionRequestMessage[]) => {
  // Check amount of messages, if larger than limit, remove the oldest one.
  const limit = 20;
  let limitMessages = messages;

  if (messages.length >= limit) {
    const start = Math.max(0, limitMessages.length - limit);
    limitMessages = [configurationMessage, ...messages.slice(start)];
  }

  // Store the configuration in the file
  const config = JSON.stringify(limitMessages);

  fs.writeFileSync(messagesPathname, config);
};

import * as fs from 'fs';
import * as path from 'path';
import { ChatCompletionRequestMessage } from 'openai/api';
import { loadConfiguration } from './configuration';

const context = loadConfiguration();

/**
 * Initial configuration message
 */
const DEFAULT_PROMPT_CONFIGURATION =
  'I want you to act as a linux terminal. I will ask questions and you will reply with command for terminal. I want you to only reply with the terminal command nothing else. do not write explanations. do not type commands unless I instruct you to do so. When I need to tell you something in English, I will do so by putting text inside curly brackets {like this}.';

const DEFAULT_PROMPT_CONFIGURATION_MESSAGE: ChatCompletionRequestMessage = {
  role: 'system',
  content: context.prompt || DEFAULT_PROMPT_CONFIGURATION,
};

const messagesPathname = path.join(__dirname, 'cli.messages.json');

/**
 * Return conversation messages if they exist.
 * If not return a terminal configuration message
 */
export const loadMessages = (): ChatCompletionRequestMessage[] => {
  if (hasMessageFile()) {
    const fileContent = fs.readFileSync(messagesPathname, 'utf8');
    return JSON.parse(fileContent);
  } else {
    return [DEFAULT_PROMPT_CONFIGURATION_MESSAGE];
  }
};
/**
 * Save messages history to the file to keep the chat history state.
 * @param messages
 */
export const saveMessages = (
  messages: ChatCompletionRequestMessage[]
): void => {
  // Check amount of messages, if larger than limit, remove the oldest one.
  const limit = 20;
  let limitMessages = messages;

  if (messages.length >= limit) {
    const start = Math.max(0, limitMessages.length - limit);
    limitMessages = [
      DEFAULT_PROMPT_CONFIGURATION_MESSAGE,
      ...messages.slice(start),
    ];
  }

  // Store the configuration in the file
  const config = JSON.stringify(limitMessages);

  fs.writeFileSync(messagesPathname, config);
};

/**
 * Clear messages history so that the chat history state is reset and new prompts
 * can be used.
 */
export const clearMessages = () => {
  if (hasMessageFile()) {
    fs.unlinkSync(messagesPathname);
  }
};

/**
 * Helper utility to check if messages exists
 */
const hasMessageFile = () => fs.existsSync(messagesPathname);

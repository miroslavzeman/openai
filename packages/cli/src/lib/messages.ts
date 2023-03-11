import * as fs from 'fs';
import * as path from 'path';
import { ChatCompletionRequestMessage } from 'openai/api';
import { loadConfiguration } from './configuration';

/**
 * Default messages limit for the chat history
 */
const DEFAULT_MESSAGES_LIMIT = 20;

/**
 * Default configuration message
 */
const DEFAULT_PROMPT_CONFIGURATION =
  'I want you to act as a linux terminal. I will ask questions and you will reply with command for terminal. I want you to only reply with the terminal command nothing else. do not write explanations. do not type commands unless I instruct you to do so. When I need to tell you something in English, I will do so by putting text inside curly brackets {like this}.';

const getDefaultPromptConfigurationMessage = (
  customPrompt: string | undefined
): ChatCompletionRequestMessage => ({
  role: 'system',
  content: customPrompt || DEFAULT_PROMPT_CONFIGURATION,
});

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
    const { prompt } = loadConfiguration();

    return [getDefaultPromptConfigurationMessage(prompt)];
  }
};
/**
 * Save messages history to the file to keep the chat history state.
 * Also limit the number of messages so the queue won't grow indefinitely,
 * keeps the newest chat history state, and it's context.
 * @param messages
 */
export const saveMessages = (
  messages: ChatCompletionRequestMessage[]
): void => {
  const { prompt, messagesLimit } = loadConfiguration();

  const limit = messagesLimit || DEFAULT_MESSAGES_LIMIT;

  if (messages.length >= limit) {
    const start = Math.max(0, messages.length - limit);
    const slicedMessages = messages.slice(start);

    messages = [
      getDefaultPromptConfigurationMessage(prompt),
      ...slicedMessages,
    ];
  }

  // Store the configuration in the file
  const config = JSON.stringify(messages);

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

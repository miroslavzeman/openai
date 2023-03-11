import { Configuration, OpenAIApi } from 'openai';
import { printUsage } from './utils/price-calculator';
import { loadMessages, saveMessages } from './messages';
import { loadConfiguration } from './configuration';
import { ChatCompletionRequestMessage } from 'openai/api';

/**
 * Process the request to ChatGPT API
 * @param message
 */
export const request = async (message: string) => {
  const { apiKey, usage } = loadConfiguration();

  const configuration = new Configuration({
    apiKey,
  });

  const openai = new OpenAIApi(configuration);

  const messages: ChatCompletionRequestMessage[] = [
    ...loadMessages(),
    {
      role: 'user',
      content: message,
    },
  ];

  try {
    // loading on???

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    const answer = response.data.choices[0].message;

    if (answer) {
      saveMessages([...messages, answer]);

      console.log(answer.content);

      if (usage && response.data.usage) {
        console.log('');
        console.log(printUsage(response.data.usage));
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    // loading off???
  }
};

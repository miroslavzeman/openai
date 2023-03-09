import { Configuration, OpenAIApi } from 'openai';
import { printUsage } from './utils/price-calculator';
import { context, loadMessages, saveMessages } from './configuration';

/**
 * Process the request to ChatGPT API
 * @param message
 * @param usage
 */
export const request = async (message: string, usage: boolean) => {
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
    // loading on???

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: newMessages,
    });

    const answer = response.data.choices[0].message;

    if (answer) {
      saveMessages([...newMessages, answer]);

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

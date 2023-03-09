import { CreateCompletionResponseUsage } from 'openai/api';

/**
 * The const holding price per 1000 tokens in $
 */
const PRICE_PER_1000_TOKENS = 0.0002;

/**
 * Calculate the price of the usage
 * @param usage
 */
export const calculatePrice = (usage: CreateCompletionResponseUsage) => {
  const { total_tokens } = usage;

  return (total_tokens / 1000) * PRICE_PER_1000_TOKENS;
};

/**
 * Print the usage string with used tokens and price per request
 * @param usage
 */
export const printUsage = (usage: CreateCompletionResponseUsage) => {
  const price = calculatePrice(usage);
  const { prompt_tokens, completion_tokens, total_tokens } = usage;

  return `Prompt: ${prompt_tokens}, Completion: ${completion_tokens}, Total: ${total_tokens}, Price: ${price}$`;
};

# OpenAI CLI

Leverage the power of OpenAI's ChatGPT API directly from the CLI and have a smart assistant in your favourite terminal or IDE! 🚀

## Installation

```console
$ npm install -g @miroslavzeman/openai-cli
$ yarn global add @miroslavzeman/openai-cli
```

## Usage

### Initialization

Before using the tool you have to initialize your API key. You can get your API key from [OpenAI](https://platform.openai.com/account/api-keys).

```console
$ ai init -k YOUR_API_KEY

Usage: ai init [options]

Initialize tool configuration

Options:
  -k, --apiKey <apiKey>  set ChatGPT API key
  -p, --prompt <prompt>  set default prompt
  -l, --limit <limit>    set conversation history limit (default: "20")
  -u, --usage            show usage and price for each message
  -h, --help             display help for command
```

### Update configuration

You can update your API key, default prompt and other configuration options via `update` command.

> **Note:** When you update the default prompt, don't forget to use `ai clear` command to clear the conversation history, so you start up a new conversation with the new prompt setup.

```console
$ ai update

Usage: ai update [options]

Update tool configuration

Options:
  -k, --apiKey <apiKey>  update ChatGPT API key
  -p, --prompt <prompt>  update default prompt
  -l, --limit <limit>    update conversation history limit (default: "20")
  -u, --usage            show usage and price for each message
  -h, --help             display help for command
```

#### Default prompt

The tool has a default prompt configuration to act like a linux terminal. You may override the system prompt with `update` command.

> I want you to act as a linux terminal. I will ask questions and you will reply with command for terminal. I want you to only reply with the terminal command nothing else. Do not write explanations. do not type commands unless I instruct you to do so. When I need to tell you something in English, I will do so by putting text inside curly brackets {like this}.


#### Pricing and token usage

In case you update configuration with `--usage` flag, the tool will show you how many tokens you have spent on the request and how much it cost you.

```conosle
$ ai "How much does ChatGPT API costs to use the tool?"

The ChatGPT API pricing details can be found on the official website of ChatGPT.
Here is the link to the pricing section: https://openai.com/pricing

Prompt: 352, Completion: 40, Total: 392, Price: 0.00007840000000000001$
```

### Clear conversation history

When you update default prompt, make sure you clear the conversation history. Otherwise, the tool will continue to use the old prompt.

```console
$ ai clear
```

# OpenAI CLI

Have you ever wanted to use OpenAI's ChatGPT from the command line? Well now you can!

## Installation

```console
// yarn 
yarn global add ADD_PACKAGE_NAME

// npm
npm install -g ADD_PACKAGE_NAME
```

## Usage

### Initialize the CLI 🛠️

Before using the tool you have to initialize your API key. You can get your API key from [OpenAI](https://platform.openai.com/account/api-keys).

```console
$ ai init -k YOUR_API_KEY

Usage: index init [options]

Initialize the tool with your API key

Options:
  -k, --apiKey <apiKey>  Your API key
  -h, --help             display help for command
```

### Use the tool! 🚀

Once you setup your API key you're ready to go!

```console
ai "Hey! Isn't it amazing to talk to you through my terminal? Finally, I don't have to go away from my IDE!"
```

## Additional options

### Usage calculation

You can use the `-u` or `--usage` flag to see how many tokens you have spent and how much it cost you.

```console
$ ai -u "How much does it cost to use the tool?"

That depends...

Prompt: 149, Completion: 43, Total: 192, Price: 0.000038400000000000005$
```

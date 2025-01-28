# Quad Agent Framework

A TypeScript library for creating AI agents powered by DeepSeek technology.

## Installation

Install the package using npm:

bash
npm install @quad/agent-framework


## Basic Usage

Here's a simple example of how to create and run an agent:

\`\`\`typescript
import { Agent } from '@quad/agent-framework';

const agent = new Agent({
  apiKey: 'YOUR_API_KEY',
  model: 'deepseek-chat',
});

const result = await agent.run('Your prompt here');
console.log(result);
\`\`\`

## Configuration

The \`Agent\` constructor accepts the following configuration options:

- \`apiKey\`: Your DeepSeek API key (required)
- \`model\`: The DeepSeek model to use (default: \`'deepseek-chat'\`)

## Advanced Usage

For more complex scenarios, you can provide a preamble and custom actions:

\`\`\`typescript
import { Agent } from '@quad/agent-framework';
import { actions } from './your-actions-file';

const preamble = \`Your agent's instructions here\`;

const agent = new Agent(
  {
    apiKey: 'YOUR_API_KEY',
    model: 'deepseek-chat',
  },
  preamble,
  actions
);

const result = await agent.run('Your prompt', chatHistory);
\`\`\`

## Actions

You can define custom actions for your agent. Here's an example structure:

\`\`\`typescript
export const actions = (wallet, imageBlob) => ({
  customAction: async (params) => {
    // Your action logic here
  },
  // More actions...
});
\`\`\`

## API Reference

### Agent

#### Constructor

\`\`\`typescript
new Agent(config: AgentConfig, preamble?: string, actions?: Actions)
\`\`\`

#### Methods

- \`run(prompt: string, chatHistory?: ChatMessage[]): Promise<string>\`  
  Runs the agent with the given prompt and optional chat history.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

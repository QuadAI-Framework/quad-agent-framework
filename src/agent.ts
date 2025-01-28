import { DeepSeekProvider } from "./deepseek";
import { Action, ChatMessage, DeepSeekConfig, IAgent } from "./types";

export class Agent implements IAgent {
  deepseek: DeepSeekProvider;
  personality: string;
  temperature?: number;
  maxTokens?: number;
  additionalParams?: Record<string, any>;
  actions?: Record<string, Action>;

  constructor(
    deepseekConfig: DeepSeekConfig,
    personality: string,
    actions?: Record<string, any>
  ) {
    this.deepseek = new DeepSeekProvider(deepseekConfig);
    this.personality = personality;
    this.actions = actions;
  }

  setPersonality(personality: string): this {
    this.personality = personality;
    return this;
  }

  setTemperature(temperature: number): this {
    this.temperature = temperature;
    return this;
  }
  setMaxTokens(maxTokens: number): this {
    this.maxTokens = maxTokens;
    return this;
  }
  setAdditionalParams(additionalParams: Record<string, any>): this {
    this.additionalParams = additionalParams;
    return this;
  }

  async run(prompt: string, chatHistory: ChatMessage[] = []): Promise<string> {
    try {
      const response = await this.deepseek.completion({
        prompt,
        personality: this.personality,
        chatHistory,
        documents: [],
        actions: this.actions,
        temperature: this.temperature || 0.5,
        maxTokens: this.maxTokens || 150,
        additionalParams: this.additionalParams || {},
      });

      if (response.choice === "message") {
        return response.message;
      } else {
        const { actionName, rawResponse, toolCallId, args } = response;

        if (!this?.actions?.[actionName]) return "Action not found";

        const result = await this.actions[actionName].handler(args);

        return await this.run("format the tool call response", [
          ...chatHistory,
          { ...rawResponse.choices[0].message } as ChatMessage,
          { role: "tool", tool_call_id: toolCallId, content: result },
        ]);
      }
    } catch (error) {
      throw new Error("Failed to generate chat response");
    }
  }
}

export const createAgent = (
  deepseekConfig: { model: string; apiKey: string },
  personality: string,
  actions: Record<string, any>
) => {
  return new Agent(deepseekConfig, personality, actions);
};

import { DeepSeekProvider } from "./deepseek";
import { Action, DeepSeekConfig, IAgent } from "./types";

export class Agent implements IAgent {
  deepseek: DeepSeekProvider;
  personality: string;
  temperature?: number;
  maxTokens?: number;
  additionalParams?: Record<string, any>;
  actions: Record<string, Action>;

  constructor(
    deepseekConfig: DeepSeekConfig,
    personality: string,
    actions: Record<string, any>
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

  async run(
    prompt: string,
    chatHistory: { role: string; content: string }[] = []
  ): Promise<string> {
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
        const { actionName: name, args } = response;
        return this.actions[name].handler(args);
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

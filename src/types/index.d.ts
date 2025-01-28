import { DeepSeekProvider } from "..";

export interface Action {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, string>;
  };
  handler: (args: Record<string, any>) => Promise<string>;
}

export interface Actions {
  [key: string]: Action;
}

type ChatMessage = {
  role: "assistant" | "tool" | "user" | "system";
  content: string;
  tool_call_id?: string;
};

export interface DeepSeekConfig {
  model: string;
  apiKey: string;
}

export interface ChatHistoryItem {
  role: string;
  content: string;
}

export interface CompletionResponse {
  choice: "message" | "action";
  message?: string;
  actionName?: string;
  args?: any;
}

export interface IAgent {
  deepseek: DeepSeekProvider;
  personality: string;
  temperature?: number;
  maxTokens?: number;
  additionalParams?: Record<string, any>;
  actions?: Record<string, Action>;
  setPersonality(personality: string): this;
  setTemperature(temperature: number): this;
  setMaxTokens(maxTokens: number): this;
  setAdditionalParams(additionalParams: Record<string, any>): this;

  run(prompt: string, chatHistory?: ChatHistoryItem[]): Promise<string>;
}

export interface AgentOptions {
  deepseekConfig: DeepSeekConfig;
  personality: string;
  actions: Record<string, Action>;
  initialContext?: Record<string, any>;
  temperature?: number;
  maxTokens?: number;
  additionalParams?: Record<string, any>;
}

export interface CompletionParams {
  prompt: string;
  personality: string;
  chatHistory: ChatHistoryItem[];
  documents: any[];
  actions?: Record<string, Action>;
  temperature: number;
  maxTokens: number;
  additionalParams: Record<string, any>;
}
export interface IDeepSeekProvider {
  completion(params: CompletionParams): Promise<CompletionResponse>;
}

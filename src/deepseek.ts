import { CompletionParams, IDeepSeekProvider } from "./types";
import OpenAI from "openai";
import {
  ChatCompletionCreateParamsBase,
  ChatCompletionDeveloperMessageParam,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";

export class DeepSeekProvider implements IDeepSeekProvider {
  private client: OpenAI;
  private model: string;

  constructor(config: { model: string; apiKey: string }) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: "https://api.deepseek.com/v1", // For DeepSeek API, its totally compatible with openai lib
    });
    this.model = "deepseek-chat";
  }

  async completion(request: CompletionParams): Promise<any> {
    const messages = this.buildFullHistory(request);

    try {
      const completionRequest: ChatCompletionCreateParamsBase = {
        model: this.model,
        messages: messages as ChatCompletionMessageParam[],
        temperature: request.temperature,
        stream: false,
      };

      if (request.actions) {
        const actions = Object.values(request.actions);
        if (actions.length > 0) {
          completionRequest.tools = Object.values(request.actions).map(
            (action) => ({
              type: "function",
              function: {
                name: action.function.name,
                description: action.function.description,
                parameters: action.function.parameters as Record<
                  string,
                  unknown
                >,
              },
            })
          );
          completionRequest.tool_choice = "auto";
        }
      }

      if (request.additionalParams) {
        Object.assign(completionRequest, request.additionalParams);
      }

      const response = (await this.client.chat.completions.create(
        completionRequest
      )) as OpenAI.ChatCompletion;

      console.log(`DeepSeek completion response:`, response.choices[0]);
      if (response.usage) {
        console.log(`DeepSeek token usage:`, response.usage);
      }

      return this.parseCompletionResponse(response);
    } catch (error) {
      console.error("Error calling DeepSeek API:", error);
      throw error;
    }
  }

  private buildFullHistory(request: CompletionParams): Array<{
    role: string;
    content: string;
  }> {
    const messages: Array<{ role: string; content: string }> = [];

    messages.push({
      role: "system",
      content: request.personality,
    });

    if (request.chatHistory) {
      messages.push(...request.chatHistory);
    }

    messages.push({ role: "user", content: request.prompt });

    return messages;
  }

  private parseCompletionResponse(response: OpenAI.Chat.ChatCompletion) {
    const choice = response.choices[0];

    if (choice.message?.tool_calls?.[0]?.function) {
      const functionCall = choice.message.tool_calls[0].function;
      return {
        choice: "action",
        actionName: functionCall.name,
        args: JSON.parse(functionCall.arguments),
        usage: response.usage,
        rawResponse: response,
      };
    } else {
      return {
        choice: "message",
        message: choice.message?.content || "",
        usage: response.usage,
        rawResponse: response,
      };
    }
  }
}

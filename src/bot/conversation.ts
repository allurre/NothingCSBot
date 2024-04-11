import { type Conversation as DefaultConversation } from "@grammyjs/conversations";
import { Context } from "./context.js";

export type Conversation = DefaultConversation<Context>;

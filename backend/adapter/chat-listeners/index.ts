import { PaymentsChatListener } from "./payments-chat-listener";
import { StatsChatListener } from "./stats-chat-listener";
import { WelcomeChatListener } from "./welcome-chat-listener";

export const chatListeners = [
  PaymentsChatListener,
  StatsChatListener,
  WelcomeChatListener,
];

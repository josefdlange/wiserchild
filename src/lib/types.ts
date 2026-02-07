export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface AppState {
  loggedIn: boolean;
  screenName: string;
  apiKey: string;
  chatOpen: boolean;
  messages: ChatMessage[];
}

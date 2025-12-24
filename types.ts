
export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}

export interface AudioConfig {
  sampleRate: number;
  channels: number;
}

export interface AvatarState {
  mouthOpen: number; // 0 to 1
  isBlinking: boolean;
  emotion: 'neutral' | 'happy' | 'thinking';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Wish {
  id: string;
  name: string;
  email: string;
  phone: string;
  text: string;
  timestamp: Date;
  status: 'pending' | 'fulfilled';
  sponsors: number;
}

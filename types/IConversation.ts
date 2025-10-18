export interface IConversationsResponse {
  code: number;
  message: string;
  data: IConversationsDatum[];
}

export interface IConversationsDatum {
  conversationId: string;
  lastMessage: string;
  lastMessageType: string;
  lastMessageAt: string;
  unreadCount: number;
  participant: IConversationsParticipant;
}

export interface IConversationsParticipant {
  _id: string;
  fullName: string;
  profileImage: string;
  userType: string;
}

// Single chat details
export interface ISingleChatResponse {
  code: number;
  message: string;
  data: ISingleChatData;
}

export interface ISingleChatData {
  conversationId: string;
  participant: ISingleChatParticipant;
  messages: ISingleChatMessage[];
}

export interface ISingleChatMessage {
  messageId: string;
  message: string;
  type: string;
  attachments: string[];
  isSender: boolean;
  sender: ISingleChatSender;
  sentAt: Date;
}

export interface ISingleChatSender {
  _id: string;
  fullName: string;
  userType: string;
  profileImage: string;
}

export interface ISingleChatParticipant {
  _id: string;
  fullName: string;
  profileId: string;
  profile: ISingleChatProfile;
}

export interface ISingleChatProfile {
  _id: string;
  profilePicUrl: string;
}


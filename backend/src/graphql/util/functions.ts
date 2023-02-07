import { ConversationUserPopulated } from './../../types/conversation';
export function userInChat(chatUsers: ConversationUserPopulated[], userId: string): boolean {
  return chatUsers.some((chatUser) => chatUser.userId === userId)
}
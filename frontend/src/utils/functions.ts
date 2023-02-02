import type { ConversationUserPopulated } from "../../../backend/src/types/conversation";


export const formatUsernames = (
  participants: ConversationUserPopulated[],
  myUserId: string
): string => {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);

  return usernames.join(", ");
};
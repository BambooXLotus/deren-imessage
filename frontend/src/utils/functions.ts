import { formatRelative, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

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

export function generateObjectId() {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const objectId = timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
    return Math.floor(Math.random() * 16).toString(16);
  }).toLowerCase();

  return objectId;
}

// const formatRelativeLocale = {
//   lastWeek: 'eeee',
//   yesterday: "'Yesterday",
//   today: 'p',
//   other: 'MM/dd/yy',
// }

// export function getChatDate(chatDate: Date) {
//   console.log(chatDate)

//   return formatRelative(parseISO(chatDate.toString()), new Date(), {
//     locale: {
//       ...enUS,
//       formatRelative: (token) =>
//         formatRelativeLocale[token as keyof typeof formatRelativeLocale],
//     },
//   })
// }
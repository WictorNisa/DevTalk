import type { Message } from "@/stores/useChatStore"
import avatarOne from '../assets/img/avatar-1.jpg'
import avatarTwo from '../assets/img/avatar-2.jpg'
import avatarThree from '../assets/img/avatar-3.jpg'
import avatarFour from '../assets/img/avatar-4.jpg'


export const mockMessages: Message[] = [
  {
    id: "msg-1",
    user: "Pedro",
    avatar: avatarOne,
    text: "Hello im under the water pls help me",
    timestamp: new Date(Date.now() - (60 * 1000 * 15)).toISOString()
  },
  {
    id: "msg-2",
    user: "Steven",
    avatar: avatarTwo,
    text: "Can someone help me with my js bug",
    timestamp: new Date(Date.now() - (60 * 1000 * 13)).toISOString()
  },
  {
    id: "msg-3",
    user: "Carl",
    avatar: avatarThree,
    text: "No you suck, git gud",
    timestamp: new Date(Date.now() - (60 * 1000 * 11)).toISOString()
  },
  {
    id: "msg-4",
    user: "Juan",
    avatar: avatarFour,
    text: "Como estas?",
    timestamp: new Date(Date.now() - (60 * 1000 * 9)).toISOString()
  },
]
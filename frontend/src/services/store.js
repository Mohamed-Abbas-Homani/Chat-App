import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      users: [],
      recipient: { ID: 0, Username: "Everyone" },
      unseenMessages: {},
      addUnseenMsg: (id) =>
        set({
          unseenMessages: {
            ...get().unseenMessages,
            [id]: Number(get().unseenMessages[id]) + 1,
          },
        }),
      resetUnseenMsg: (id) =>
        set({ unseenMessages: { ...get().unseenMessages, [id]: 0 } }),
      setLogin: (user, token) => set({ user, token }),
      setLogout: () => set({ user: null, token: null }),
      setUsers: (users) => set({ users }),
      setRecipient: (recipient) => {
        set({ recipient });
      },
    }),
    {
      name: "chat-app",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useStoreWithoutStorage = create(
  persist(
    (set, get) => ({
      messages: [],
      setMessages: (messages) => set({ messages }),
      addMessage: (message) => set({ messages: [...get().messages, message] }),
    }),
    {
      name: "chat-app2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useUser = () => useStore((state) => state.user);
export const useToken = () =>
  useStore((state) => (state.user ? state.token : null));
export const useSetLogin = () => useStore((state) => state.setLogin);
export const useSetLogout = () => useStore((state) => state.setLogout);
export const useUsers = () => useStore((state) => state.users);
export const useSetUsers = () => useStore((state) => state.setUsers);
export const useMessages = () =>
  useStoreWithoutStorage((state) => state.messages);
export const useSetMessages = () =>
  useStoreWithoutStorage((state) => state.setMessages);
export const useAddMessage = () =>
  useStoreWithoutStorage((state) => state.addMessage);
export const useRecipient = () => useStore((state) => state.recipient);
export const useSetRecipient = () => useStore((state) => state.setRecipient);
export const useUnseenMessages = () =>
  useStore((state) => state.unseenMessages);
export const useAddUnseenMsg = () => useStore((state) => state.addUnseenMsg);
export const useResetUnseenMsg = () =>
  useStore((state) => state.resetUnseenMsg);

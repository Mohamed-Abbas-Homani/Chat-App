import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      isDarkMode: false,
      toggleDarkMode: () =>
        set({ isDarkMode: get().isDarkMode ? false : true }),
      user: null,
      token: null,
      users: [],
      recipient: { ID: 0, Username: "Everyone" },

      setLogin: (user, token) => set({ user, token }),
      setLogout: () => set({ user: null, token: null }),
      setUsers: (users) => set({ users }),
      updateUserStatus: (message) =>
        set({
          users: [
            ...get().users.map((u) => {
              if (u.ID == message.sender_id) {
                u.status = message.content;
                u.last_seen = message.status;
              }
              return u;
            }),
          ],
        }),
      updateUser: (data) => {
        set({
          users: [
            ...get().users.map((u) => {
              if (u.ID == data.ID) {
                return { ...u, ...data };
              }
              return u;
            }),
          ],
        });
        console.log(data);
      },
      setRecipient: (recipient) => {
        console.log(recipient.status);
        set({ recipient });
      },
      updateRecipient: (data) => {
        set({ recipient: { ...get().recipient, ...data } });
      },
    }),
    {
      name: "chat-app",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useStoreWithoutStorage = create((set, get) => ({
  ws: null,
  setWs: (ws) => set({ ws }),
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
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set({ messages: [...get().messages, message] }),
  markDelivredMsg: (message) =>
    set({
      messages: [
        ...get().messages.map((m) => {
          if (m.ID == message.ID) {
            m.status = "delivred";
          }
          return m;
        }),
      ],
    }),

  markSeenMsg: (message, currendID) =>
    set({
      messages: [
        ...get().messages.map((m) => {
          if (
            m.sender_id == message.recipient_id &&
            m.recipient_id == message.sender_id
          ) {
            m.status = "seen";
          }
          return m;
        }),
      ],
    }),
  deleteMsg: (id) => {
    set({
      messages: [...get().messages.filter((m) => m.ID != id)],
    });
  },
  updateMsg: (msg) =>
    set({
      messages: [
        ...get().messages.map((m) => {
          if (m.ID == msg.ID) {
            m.content = msg.content;
          }
          return m;
        }),
      ],
    }),
}));


export const useIsDarkMode = () => useStore((state) => state.isDarkMode);
export const useToggleDarkMode = () => useStore((state) => state.toggleDarkMode);
export const useUser = () => useStore((state) => state.user);
export const useToken = () =>
  useStore((state) => (state.user ? state.token : null));
export const useSetLogin = () => useStore((state) => state.setLogin);
export const useSetLogout = () => useStore((state) => state.setLogout);
export const useUsers = () => useStore((state) => state.users);
export const useSetUsers = () => useStore((state) => state.setUsers);
export const useUpdateUserStatus = () =>
  useStore((state) => state.updateUserStatus);
export const useUpdateUser = () => useStore((state) => state.updateUser);
export const useMessages = () =>
  useStoreWithoutStorage((state) => state.messages);
export const useSetMessages = () =>
  useStoreWithoutStorage((state) => state.setMessages);
export const useAddMessage = () =>
  useStoreWithoutStorage((state) => state.addMessage);
export const useRecipient = () => useStore((state) => state.recipient);
export const useSetRecipient = () => useStore((state) => state.setRecipient);
export const useUnseenMessages = () =>
  useStoreWithoutStorage((state) => state.unseenMessages);
export const useAddUnseenMsg = () =>
  useStoreWithoutStorage((state) => state.addUnseenMsg);
export const useResetUnseenMsg = () =>
  useStoreWithoutStorage((state) => state.resetUnseenMsg);
export const useMarkDelivredMsg = () =>
  useStoreWithoutStorage((state) => state.markDelivredMsg);
export const useMarkSeenMsg = () =>
  useStoreWithoutStorage((state) => state.markSeenMsg);
export const useWs = () => useStoreWithoutStorage((state) => state.ws);

export const useSetWs = () => useStoreWithoutStorage((state) => state.setWs);
export const useUpdateMsg = () =>
  useStoreWithoutStorage((state) => state.updateMsg);
export const useDeleteMsg = () =>
  useStoreWithoutStorage((state) => state.deleteMsg);
export const useUpdateRecipient = () =>
  useStore((state) => state.updateRecipient);

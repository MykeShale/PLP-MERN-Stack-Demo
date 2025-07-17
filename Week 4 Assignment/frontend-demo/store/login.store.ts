import { create } from "zustand";
import { persist } from "zustand/middleware";


const useLoginStore = create()(
  persist(
    (set) => ({
      login: false,
      setLogin: (value) => set({ login: value }),
    }),
    {
      name: "login_storage",
    },
  ),
);

export default useLoginStore;

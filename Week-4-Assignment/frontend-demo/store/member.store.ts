import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useMemberStore = create()(
  devtools(
    persist(
      (set) => ({
        member: null,
        changeMemberInformation:(newMemberData) => {
          set({ member: newMemberData });
        },
        clearMemberInformation: () => {
          set({ member: null });
        },
      }),
      { name: "flowforge-member" },
    ),
  ),
);

export default useMemberStore;

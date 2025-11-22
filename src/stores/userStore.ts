import { create } from "zustand"; 
import { persist } from "zustand/middleware"; 

interface UserStore {
    user_id: string;
    setUser: (user_id: string) => void;
}
export const useUserStore = create<UserStore, [["zustand/persist", UserStore]]>( 
    persist( 
        (set) => 
            ({ user_id: "", 
                setUser: (user_id: string) => set({ user_id }), }), 
                
    { name: "user-store" }) );
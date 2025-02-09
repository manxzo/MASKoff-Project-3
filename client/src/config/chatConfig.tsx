import React, { createContext, useState, ReactNode } from "react";

interface Credentials {
  username: string;
  password: string;
}

interface ChatIDs {
  userID: string;
  partyID: string;
}

interface UserInfo {
  username: string;
  userID: string;
  chats: ChatIDs[];
}

interface UserContextType {
  user: UserInfo | null;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

import { ReactNode, useState } from "react";
import { AppContext } from "./AppContext";


const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentRole, setCurrentRole] = useState<"User" | "Admin" | undefined>((localStorage.getItem('currentRole') as "User" | "Admin" | undefined ));
  const [appUserId, setAppUserId] = useState<string | undefined>(localStorage.getItem('appUserId') ?? undefined);

  const contextValue = {
    currentRole,
    setCurrentRole,
    appUserId,
    setAppUserId,
  } 

  return (
    <AppContext.Provider value={contextValue} >
      { children }
    </AppContext.Provider>
  )
}

export default AppContextProvider;
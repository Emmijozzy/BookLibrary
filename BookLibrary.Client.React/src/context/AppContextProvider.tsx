import { ReactNode, useState } from "react";
import { AppContext } from "./AppContext";


const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentRole, setCurrentRole] = useState<"User" | "Admin" | undefined>((localStorage.getItem('currentRole') as "User" | "Admin" | undefined ) ?? "User");

  const contextValue = {
    currentRole,
    setCurrentRole,
  } 

  return (
    <AppContext.Provider value={contextValue} >
      { children }
    </AppContext.Provider>
  )
}

export default AppContextProvider;
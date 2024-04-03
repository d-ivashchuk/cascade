"use client";

import * as React from "react";

import { DateRangePicker } from "../date-range-picker";

interface UserTableContextProps {
  enableAdvancedFilter: boolean;
  setEnableAdvancedFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFloatingBar: boolean;
  setShowFloatingBar: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserTableContext = React.createContext<UserTableContextProps>({
  enableAdvancedFilter: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setEnableAdvancedFilter: () => {},
  showFloatingBar: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setShowFloatingBar: () => {},
});

export function useUserTable() {
  const context = React.useContext(UserTableContext);
  if (!context) {
    throw new Error("useUserTable must be used within a UserTableProvider");
  }
  return context;
}

export function UserTableProvider({ children }: React.PropsWithChildren) {
  const [enableAdvancedFilter, setEnableAdvancedFilter] = React.useState(false);
  const [showFloatingBar, setShowFloatingBar] = React.useState(false);

  return (
    <UserTableContext.Provider
      value={{
        enableAdvancedFilter,
        setEnableAdvancedFilter,
        showFloatingBar,
        setShowFloatingBar,
      }}
    >
      <DateRangePicker triggerSize="sm" triggerClassName="w-60" align="end" />
      {children}
    </UserTableContext.Provider>
  );
}

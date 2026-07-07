import { createContext, useContext, useState } from 'react';

export interface TopbarConfig {
  left: React.ReactNode;
  right?: React.ReactNode;
}

interface TopbarContextValue {
  config: TopbarConfig;
  setConfig: (config: TopbarConfig) => void;
}

const TopbarContext = createContext<TopbarContextValue>({
  config: { left: null },
  setConfig: () => undefined,
});

export const TopbarProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const [config, setConfig] = useState<TopbarConfig>({ left: null });

  return (
    <TopbarContext.Provider value={{ config, setConfig }}>
      {children}
    </TopbarContext.Provider>
  );
};

export const useTopbarContext = (): TopbarContextValue => useContext(TopbarContext);

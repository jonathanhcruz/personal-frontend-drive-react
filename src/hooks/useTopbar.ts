import { useLayoutEffect } from 'react';
import { useTopbarContext, type TopbarConfig } from '../layouts/DashboardLayout/TopbarContext';

export const useTopbar = (config: TopbarConfig): void => {
  const { setConfig } = useTopbarContext();

  useLayoutEffect(() => {
    setConfig(config);
  });
};

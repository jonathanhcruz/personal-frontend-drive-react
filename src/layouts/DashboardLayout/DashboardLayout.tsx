import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { AppTopbar } from '../../components/AppTopbar';
import { TopbarProvider, useTopbarContext } from './TopbarContext';
import styles from './DashboardLayout.module.scss';

const LayoutShell = (): React.JSX.Element => {
  const { config } = useTopbarContext();

  return (
    <div className={styles['dashboard-layout']}>
      <Sidebar />
      <div className={styles['dashboard-layout__main']}>
        <AppTopbar left={config.left} right={config.right} />
        <Outlet />
      </div>
    </div>
  );
};

export const DashboardLayout = (): React.JSX.Element => (
  <TopbarProvider>
    <LayoutShell />
  </TopbarProvider>
);

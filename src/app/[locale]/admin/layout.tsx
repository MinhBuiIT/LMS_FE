import Header from '@/src/components/admin/header';
import Sidebar from '@/src/components/admin/sidebar';
import AuthWrapper from '@/src/hoc/AuthWrapper';
import PermissionWrapper from '@/src/hoc/PermissionWrapper';
import { NextPage } from 'next';

type TProps = {
  children: React.ReactNode;
};

const AdminLayout: NextPage<TProps> = ({ children }) => {
  return (
    <AuthWrapper guestGuard={false} authGuard={true}>
      <PermissionWrapper permissionGuard="admin">
        <div className="bg-white  dark:bg-black   relative min-h-[100vh] ">
          <Header />
          <div className="w-full h-full flex">
            <div className="">
              <Sidebar />
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </PermissionWrapper>
    </AuthWrapper>
  );
};
export default AdminLayout;

'use client';

import { useLogoutUserMutation } from '@/src/redux/api/authApi';
import { RootState } from '@/src/redux/store';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { CgProfile } from 'react-icons/cg';
import { IoLogOutOutline } from 'react-icons/io5';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { useSelector } from 'react-redux';

type TProps = {
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
};

const SidebarProfile: React.FC<TProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const [logoutAction, logoutResult] = useLogoutUserMutation();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (logoutResult.isSuccess) {
      router.push('/login');
      toast.success(t('LogoutSuccess'));
    } else if (logoutResult.isError) {
      toast.error(t('LogoutFail'));
    }
  }, [logoutResult.isSuccess, logoutResult.isError]);

  const handleLogout = async () => {
    await signOut();
    await logoutAction();
  };

  return (
    <div className="w-1/4 800px:w-[250px] h-[450px] bg-[#b1a9a952] dark:bg-[#021017] bg-opacity-90 border border-[#ffffff1d] rounded-[5px] shadow-sm  mb-[80px] ">
      <div
        className={`flex items-center gap-4 px-4 justify-start text-black cursor-pointer dark:text-white  pb-4 pt-6 ${
          activeTab === 1 ? 'dark:bg-[#b1a9a91c] bg-[#ffffff86]' : ''
        }`}
        onClick={() => setActiveTab(1)}
      >
        <CgProfile size={25} />
        <div className="hidden 800px:inline-block text-lg">{t('MyAccount')}</div>
      </div>

      <div
        className={`flex items-center gap-4 px-4 justify-start text-black cursor-pointer dark:text-white py-4 ${
          activeTab === 2 ? 'dark:bg-[#b1a9a91c] bg-[#ffffff86]' : ''
        }`}
        onClick={() => setActiveTab(2)}
      >
        <RiLockPasswordLine size={25} />
        <div className="hidden 800px:inline-block text-lg">{t('ChangePassword')}</div>
      </div>

      <div
        className={`flex items-center gap-4 px-4 justify-start text-black dark:text-white cursor-pointer py-4           ${
          activeTab === 3 ? 'dark:bg-[#b1a9a91c] bg-[#ffffff86]' : ''
        }`}
        onClick={() => setActiveTab(3)}
      >
        <SiCoursera size={25} />
        <div className="hidden 800px:inline-block text-lg">{t('Enrolled')}</div>
      </div>
      {user?.role === 'admin' && (
        <div
          className={`flex items-center gap-4 px-4 justify-start text-black dark:text-white cursor-pointer py-4           ${
            activeTab === 6 ? 'dark:bg-[#b1a9a91c] bg-[#ffffff86]' : ''
          }`}
          onClick={() => router.push('/admin/dashboard')}
        >
          <SiCoursera size={25} />
          <div className="hidden 800px:inline-block text-lg">{t('AdminDashboard')}</div>
        </div>
      )}

      <div
        className={`flex items-center gap-4 px-4 justify-start text-black dark:text-white cursor-pointer py-4           ${
          activeTab === 4 ? 'dark:bg-[#b1a9a91c] bg-[#ffffff86]' : ''
        }`}
        onClick={handleLogout}
      >
        <IoLogOutOutline size={25} />
        <div className="hidden 800px:inline-block text-lg">{t('LogOut')}</div>
      </div>
    </div>
  );
};

export default SidebarProfile;

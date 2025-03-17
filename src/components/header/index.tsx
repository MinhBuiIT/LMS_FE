'use client';

/*----MUI---*/
import { Avatar, Popover, Typography } from '@mui/material';

/*----Next---*/
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

/*----i18next---*/
import { useTranslation } from 'react-i18next';
import '../../configs/i18next';
/*----Icons---*/
import { CgProfile } from 'react-icons/cg';
import { CiLight } from 'react-icons/ci';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { IoIosLogOut } from 'react-icons/io';
import { MdOutlineDarkMode } from 'react-icons/md';
import { RiMenu3Line } from 'react-icons/ri';

/*----Components---*/
import { IUser } from '@/src/@types/user';
import { useLogoutUserMutation } from '@/src/redux/api/authApi';
import { RootState } from '@/src/redux/store';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import userAvatarDefault from '../../../public/user-avatar-default.jpg';
import ButtonLanguage from '../button-language';
import NavItems from '../nav-items';

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState<number>(0);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [clientUser, setClientUser] = useState<IUser | null>(null);
  const [logoutAction, logoutResult] = useLogoutUserMutation();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (path === '/profile') {
      setActiveItem(-1);
    }
  }, []);

  useEffect(() => {
    setClientUser(user); // Chỉ cập nhật trên client
  }, [user]);

  const [anchorElUser, setAnchorElUser] = React.useState<HTMLButtonElement | null>(null);

  const handleClickUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!clientUser) {
      router.push('/login');
      return;
    }
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const openUserMenu = Boolean(anchorElUser);
  //End MUI Menu

  useEffect(() => setMounted(true), []);

  const handleCloseSidebar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    if (target.id === 'screen') {
      setOpenSidebar(false);
    }
  };
  const handleLogout = async () => {
    await signOut();
    await logoutAction();
  };
  useEffect(() => {
    if (logoutResult.isSuccess) {
      router.push('/login');
      toast.success(t('LogoutSuccess'));
    } else if (logoutResult.isError) {
      toast.error(t('LogoutFail'));
    }
  }, [logoutResult.isSuccess, logoutResult.isError]);

  return (
    <header
      className={`w-full h-[80px] px-3 py-4  border-b-[2px] border-[#ffffff1c] z-50 shadow transition-all duration-150 backdrop-blur-lg backdrop-saturate-150 fixed top-0 `}
    >
      <div className="w-[95%] h-full mx-auto flex items-center justify-between">
        <div className="text-[25px] text-black dark:text-white font-Poppins">
          <Link href={'/'}>
            <span className="cursor-pointer">Elearning</span>
          </Link>
        </div>
        <div className="flex items-center space-x-8">
          <NavItems activeItem={activeItem} setActiveItem={setActiveItem} isMobile={false} />
          <div className="flex items-center space-x-4">
            {mounted && (
              <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
                {resolvedTheme === 'dark' ? (
                  <CiLight className="dark:text-white text-black" size={25} />
                ) : (
                  <MdOutlineDarkMode className="dark:text-white text-black" size={25} />
                )}
              </button>
            )}
            <ButtonLanguage />
            <div className="flex items-center justify-center">
              <button onClick={handleClickUserMenu}>
                {clientUser ? (
                  <Avatar sx={{ border: `${activeItem === -1 ? '3px solid #37b668' : 'none'}` }}>
                    <Image
                      src={clientUser.avatar?.url || userAvatarDefault}
                      alt={clientUser.name}
                      width={300}
                      height={300}
                    />
                  </Avatar>
                ) : (
                  <HiOutlineUserCircle
                    className="dark:text-white text-black cursor-pointer 800px:block hidden"
                    size={25}
                  />
                )}
              </button>
              <Popover
                id="user-menu"
                open={openUserMenu}
                anchorEl={anchorElUser}
                onClose={handleCloseUserMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center'
                }}
              >
                <div className="flex items-center gap-2 pl-[16px] hover:text-[#37b668] text-black duration-150  cursor-pointer">
                  <CgProfile size={25} />
                  <Typography
                    sx={{ p: 2 }}
                    className={`  flex-1 whitespace-nowrap`}
                    onClick={() => router.push('/profile')}
                  >
                    {t('Profile')}
                  </Typography>
                </div>
                <div
                  className="flex items-center gap-2 pl-[16px] hover:text-[#37b668] text-black duration-150 cursor-pointer"
                  onClick={handleLogout}
                >
                  <IoIosLogOut size={25} />
                  <Typography sx={{ p: 2 }} className={`  flex-1 whitespace-nowrap`}>
                    {t('Logout')}
                  </Typography>
                </div>
              </Popover>
            </div>

            <RiMenu3Line
              className="dark:text-white text-black cursor-pointer 800px:hidden block"
              size={25}
              onClick={() => setOpenSidebar(true)}
            />
          </div>
        </div>
      </div>
      {openSidebar && (
        <div
          className="fixed top-0 left-0 w-full h-full  bg-opacity-50 z-[9999] dark:bg-[unset] bg-[#00000024]"
          id="screen"
          onClick={(e) => handleCloseSidebar(e)}
        >
          <div className="400px:w-[46%] w-full h-full bg-white z-[9999999] dark:bg-slate-900 dark:bg-opacity-90 shadow-lg fixed top-0 right-0 flex flex-col items-center justify-center">
            <NavItems activeItem={activeItem} setActiveItem={setActiveItem} isMobile={true} />
            <HiOutlineUserCircle className="dark:text-white text-black cursor-pointer mt-8" size={25} />
            <div className="text-black dark:text-white mt-8 text-sm">Copyright 2024 Elearning</div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

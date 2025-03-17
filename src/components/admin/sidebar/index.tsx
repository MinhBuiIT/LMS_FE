'use client';
import { useLogoutUserMutation } from '@/src/redux/api/authApi';
import { RootState } from '@/src/redux/store';
import { Box, IconButton, Typography } from '@mui/material';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight, FaHome, FaRegNewspaper } from 'react-icons/fa';
import { IoIosLogOut, IoMdPeople } from 'react-icons/io';
import { IoAnalyticsSharp } from 'react-icons/io5';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import { MdLiveTv, MdOutlineVideoCall } from 'react-icons/md';
import { SiGoogleanalytics } from 'react-icons/si';
import { TbCategory, TbReportAnalytics } from 'react-icons/tb';
import { Menu, MenuItem, ProSidebar } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { useSelector } from 'react-redux';
import userAvatarDefault from '../../../../public/user-avatar-default.jpg';

type ItemProps = {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: (value: string) => void;
};

const Item: React.FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => {
  const router = useRouter();
  const path = usePathname();
  const isActive = useMemo(() => {
    if (path) {
      let pathEnd = path.split('/').pop();
      pathEnd = pathEnd?.replaceAll('-', ' ').toLowerCase();

      return pathEnd === title.toLowerCase();
    }
  }, [path]);

  return (
    <MenuItem
      active={isActive}
      className="text-[#141414] dark:text-[#e0e0e0]"
      onClick={() => {
        setSelected(title);
        router.push(to);
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('Dashboard');
  const user = useSelector((state: RootState) => state.auth.user);
  const [logoutAction, logoutResult] = useLogoutUserMutation();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (logoutResult.isSuccess) {
      router.push('/login');
      toast.success(t('LogoutSuccess'));
    } else if (logoutResult.isError) {
      toast.error(t('LogoutFail'));
    }
  }, [logoutResult.isSuccess, logoutResult.isError]);

  return (
    <>
      <Box
        className="bg-[#f2f0f0] dark:bg-[#1F2A40] !h-full"
        sx={{
          '& .pro-sidebar-inner': {
            backgroundColor: 'transparent !important'
          },
          '& .pro-icon-wrapper': {
            backgroundColor: 'transparent !important'
          },
          '& .pro-inner-item': {
            padding: '5px 35px 5px 20px !important'
          },
          '& .pro-inner-item:hover': {
            color: '#868dfb !important'
          },
          '& .pro-menu-item.active': {
            color: '#6870fa !important'
          }
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            {/* LOGO AND MENU ICON */}
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={
                isCollapsed ? <FaChevronRight size={22} className="text-[#141414] dark:text-[#e0e0e0]" /> : undefined
              }
              style={{
                margin: '10px 0 20px 0'
              }}
              className="text-[#141414] dark:text-[#e0e0e0]"
            >
              {!isCollapsed && (
                <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                  <Typography className="text-[#141414] dark:text-[#e0e0e0] !text-[24px]">ELEARNING</Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <FaChevronLeft size={22} className="text-[#141414] dark:text-[#e0e0e0]" />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Image
                    alt="profile-user"
                    width={100}
                    height={100}
                    src={user?.avatar?.url || userAvatarDefault}
                    style={{ borderRadius: '50%' }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    className="text-[#141414] dark:text-[#e0e0e0] !text-[28px]"
                    fontWeight="bold"
                    sx={{ m: '10px 0 0 0' }}
                  >
                    {user?.name}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box paddingLeft={isCollapsed ? undefined : '10%'}>
              <Item
                title="Dashboard"
                to="/admin/dashboard"
                icon={<FaHome size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
                selected={selected}
                setSelected={setSelected}
              />

              {!isCollapsed && (
                <Typography className="text-[#3d3d3d] dark:text-[#a3a3a3] text-[20px]" sx={{ m: '15px 0 5px 20px' }}>
                  Data
                </Typography>
              )}

              <Item
                title="Users"
                to="/admin/users"
                icon={<IoMdPeople size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Invoices"
                to="/admin/invoices"
                icon={<LiaFileInvoiceSolid size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
                selected={selected}
                setSelected={setSelected}
              />

              {!isCollapsed && (
                <Typography className="text-[#3d3d3d] dark:text-[#a3a3a3] text-[20px]" sx={{ m: '15px 0 5px 20px' }}>
                  Content
                </Typography>
              )}

              <Item
                title="Create Course"
                to="/admin/create-course"
                icon={<MdOutlineVideoCall size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Live Course"
                to="/admin/live-course"
                icon={<MdLiveTv size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
                selected={selected}
                setSelected={setSelected}
              />

              {!isCollapsed && (
                <Typography className="text-[#3d3d3d] dark:text-[#a3a3a3] text-[20px]" sx={{ m: '15px 0 5px 20px' }}>
                  Customization
                </Typography>
              )}

              <Item
                title="Hero"
                to="/admin/hero"
                icon={<FaRegNewspaper size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
                selected={selected}
                setSelected={setSelected}
              />
              {/* <Item
                title="FAQ"
                to="/admin/faq"
                icon={<FaQuestion size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
                selected={selected}
                setSelected={setSelected}
              /> */}
              <Item
                title="Categories"
                to="/admin/category"
                icon={<TbCategory size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
                selected={selected}
                setSelected={setSelected}
              />
              {/* {!isCollapsed && (
                <Typography className="text-[#3d3d3d] dark:text-[#a3a3a3] text-[20px]" sx={{ m: '15px 0 5px 20px' }}>
                  Controllers
                </Typography>
              )}

              <Item
                title="Manage Team"
                to="/line"
                icon={<MdManageAccounts size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
                selected={selected}
                setSelected={setSelected}
              /> */}
              {!isCollapsed && (
                <Typography className="text-[#3d3d3d] dark:text-[#a3a3a3] text-[20px]" sx={{ m: '15px 0 5px 20px' }}>
                  Analytics
                </Typography>
              )}

              <Item
                title="Courses Analytics"
                to="/admin/courses-analytics"
                icon={<SiGoogleanalytics size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Order Analytics"
                to="/admin/order-analytics"
                icon={<TbReportAnalytics size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="User Analytics"
                to="/admin/user-analytics"
                icon={<IoAnalyticsSharp size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
                selected={selected}
                setSelected={setSelected}
              />

              {!isCollapsed && (
                <Typography className="text-[#3d3d3d] dark:text-[#a3a3a3] text-[20px]" sx={{ m: '15px 0 5px 20px' }}>
                  Controllers
                </Typography>
              )}

              <MenuItem
                className="text-[#141414] dark:text-[#e0e0e0]"
                onClick={async () => {
                  await signOut();
                  await logoutAction();
                }}
                icon={<IoIosLogOut size={22} className="text-[#141414] dark:text-[#e0e0e0]" />}
              >
                <Typography>Logout</Typography>
              </MenuItem>
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </>
  );
};

export default Sidebar;

'use client';
import { getSocketContext } from '@/src/hoc/socket';
import {
  useGetNotiApiQuery,
  useUpdateStatusAllNotiApiMutation,
  useUpdateStatusNotiApiMutation
} from '@/src/redux/api/notiApi';
import { Badge, IconButton, Menu, MenuItem } from '@mui/material';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoIosNotifications } from 'react-icons/io';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { format } from 'timeago.js';

const AUDIO_NOTIFICATION =
  'https://res.cloudinary.com/appcloudmbdev/video/upload/v1741682992/notification-18-270129_ykqrty.mp3';
const LIMIT = 5;
const Notification = () => {
  const socket = getSocketContext();
  const [page, setPage] = useState(1);
  const [audio] = useState(new Audio(AUDIO_NOTIFICATION));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [updateStatusNotiAction] = useUpdateStatusNotiApiMutation();
  const [updateStatusAllNotiAction] = useUpdateStatusAllNotiApiMutation();
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    handlePlayAudio();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handlePlayAudio = useCallback(() => {
    audio.play();
  }, [audio]);

  const { data, refetch } = useGetNotiApiQuery({ page, limit: LIMIT });
  const notiList = data?.data?.notiList || [];

  const totalPage = data ? Math.ceil(data?.data.total / data?.data.limit) : 0;

  const handleMarkRead = (id: string) => {
    updateStatusNotiAction({ id })
      .unwrap()
      .then(() => {
        refetch();
      })
      .catch(() => {
        toast.error('Mark as read failed');
      });
  };

  const handleMarkAllRead = () => {
    updateStatusAllNotiAction()
      .unwrap()
      .then(() => {
        setPage(1);
        refetch();
      })
      .catch(() => {
        toast.error('Mark all as read failed');
      });
  };

  useEffect(() => {
    if (socket) {
      socket.connect();

      socket.on('newNotification', () => {
        if (refetch) {
          handlePlayAudio();
          setPage(1);
          refetch();
        }
      });
    }
  }, [socket, refetch, handlePlayAudio]);

  return (
    <>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={data?.data.total || 0} color="primary">
          <IoIosNotifications className="text-[#141414] dark:text-[#e0e0e0]" />
        </Badge>
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        sx={{
          width: '400px'
        }}
      >
        {notiList.length > 0 && (
          <div className="flex justify-end w-full my-2 pe-5">
            <button className="text-[16px] font-semibold" onClick={handleMarkAllRead}>
              Mark all as read
            </button>
          </div>
        )}

        {notiList.length > 0 ? (
          notiList.map((noti, index) => (
            <MenuItem key={index} sx={{ width: '400px' }}>
              <div className="text-gray-700 mb-[10px] pe-[12px] w-full">
                <div className="text-[16px] capitalize font-semibold">{noti.title}</div>
                <div className="text-[14px] text-wrap max-w-[90%]">{noti.message}</div>
                <div className="flex justify-between items-center pe-[30px]  w-full">
                  <div className="text-[15px] text-gray-600">{format(new Date(noti.createdAt))}</div>
                  <button onClick={() => handleMarkRead(noti._id)} className=" text-[16px] font-semibold">
                    {noti.status}
                  </button>
                </div>
              </div>
            </MenuItem>
          ))
        ) : (
          <div className="flex justify-center items-center w-[400px] h-[200px] text-gray-600 italic">
            No notification
          </div>
        )}

        {notiList.length > 0 && (
          <div className="flex justify-center gap-4 pb-2">
            <button
              disabled={page == 1}
              className="w-[30px] h-[30px] rounded-[50%] bg-slate-300 flex justify-center items-center"
              onClick={() => {
                if (page > 1) setPage(page - 1);
              }}
            >
              <IoChevronBack size={16} className="text-gray-700" />
            </button>
            <button
              disabled={page == totalPage}
              className="w-[30px] h-[30px] rounded-[50%] bg-slate-300 flex justify-center items-center"
              onClick={() => {
                if (page < totalPage) setPage(page + 1);
              }}
            >
              <IoChevronForward size={16} className="text-gray-700" />
            </button>
          </div>
        )}
      </Menu>
    </>
  );
};

export default Notification;

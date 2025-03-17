'use client';
import { Popover, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GrLanguage } from 'react-icons/gr';

const ButtonLanguage = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className="flex items-center justify-center">
      <button onClick={handleClick}>
        <GrLanguage className="dark:text-white text-black" size={20} />
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Typography
          sx={{ p: 2 }}
          className={`${i18n.language === 'vi' ? 'text-[#37b668]' : 'text-black'} cursor-pointer`}
          onClick={() => {
            i18n.changeLanguage('vi');
            handleClose();
          }}
        >
          {t('Vietnamese')}
        </Typography>
        <Typography
          sx={{ p: 2 }}
          className={`${i18n.language === 'en' ? 'text-[#37b668]' : 'text-black'} cursor-pointer`}
          onClick={() => {
            i18n.changeLanguage('en');
            handleClose();
          }}
        >
          {t('English')}
        </Typography>
      </Popover>
    </div>
  );
};

export default ButtonLanguage;

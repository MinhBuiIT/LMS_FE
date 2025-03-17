'use client';

import { useChangePasswordApiMutation } from '@/src/redux/api/userApi';
import { isBadRequestError, isNotFoundRequestError } from '@/src/utils/predicate-type';
import { changePasswordSchema, TChangePasswordSchema } from '@/src/utils/schema-validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { GiConfirmed } from 'react-icons/gi';
import { LuLoader } from 'react-icons/lu';
import { MdOutlineWifiProtectedSetup } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import Input from '../input';

type TProps = {};

const ChangePassword: React.FC<TProps> = () => {
  const { data } = useSession();
  const { t } = useTranslation();

  const [changePasswordAction, changePasswordResult] = useChangePasswordApiMutation();
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors }
  } = useForm<TChangePasswordSchema>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (dataForm: TChangePasswordSchema) => {
    if (data === null) {
      if (!dataForm.oldPassword) {
        setError('oldPassword', {
          type: 'manual',
          message: 'Old password is required'
        });
        return;
      }
    }
    if (!dataForm.newPassword) {
      setError('newPassword', {
        type: 'manual',
        message: 'New password is required'
      });
      return;
    }

    const body = {
      oldPassword: dataForm.oldPassword || '',
      newPassword: dataForm.newPassword
    };
    await changePasswordAction(body);
  };

  useEffect(() => {
    if (changePasswordResult.isSuccess) {
      reset();
    } else if (changePasswordResult.isError) {
      if (isBadRequestError(changePasswordResult.error) || isNotFoundRequestError(changePasswordResult.error)) {
        toast.error(changePasswordResult.error.data.message);
      }
    }
  }, [changePasswordResult]);

  return (
    <div className="w-full flex items-center justify-center flex-col">
      <Typography className="dark:text-white text-dark" variant="h4">
        {t('ChangePassword')}
      </Typography>
      <form className="mt-8 800px:w-[400px] w-[85%]" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8">
          <div className="text-black dark:text-white mb-3 text-lg">{t('OldPassword')}</div>
          <Controller
            control={control}
            name="oldPassword"
            render={({ field }) => (
              <Input
                icon={RiLockPasswordLine}
                type="password"
                placeholder={t('OldPassword')}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.oldPassword?.message}
              />
            )}
          />
        </div>

        <div>
          <div className="text-black dark:text-white mb-3 text-lg">{t('NewPassword')}</div>
          <Controller
            control={control}
            name="newPassword"
            render={({ field }) => (
              <Input
                icon={MdOutlineWifiProtectedSetup}
                type="password"
                placeholder={t('NewPassword')}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.newPassword?.message}
              />
            )}
          />
        </div>

        <div>
          <div className="text-black dark:text-white mb-3 text-lg">{t('ConfirmPassword')}</div>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <Input
                icon={GiConfirmed}
                type="password"
                placeholder={t('ConfirmPassword')}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.confirmPassword?.message}
              />
            )}
          />
        </div>
        <motion.button
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
        >
          {changePasswordResult.isLoading ? (
            <LuLoader size={20} color="white" className="animate-spin mx-auto" />
          ) : (
            t('Update')
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default ChangePassword;

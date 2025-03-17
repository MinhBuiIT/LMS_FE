'use client';
import Input from '@/src/components/input';
import { useResetPasswordUserMutation } from '@/src/redux/api/authApi';
import { isNotFoundRequestError, isUnauthorizedRequestError } from '@/src/utils/predicate-type';
import { resetPasswordSchema, TResetPasswordSchema } from '@/src/utils/schema-validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { NextPage } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaShieldAlt } from 'react-icons/fa';

type TProps = {};

const ResetPasswordPage: NextPage<TProps> = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [resetPasswordAction, resetPasswordResult] = useResetPasswordUserMutation();

  if (!token) {
    router.push('/forgot-password');
  }

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TResetPasswordSchema>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: ''
    }
  });

  const onSubmit = (data: TResetPasswordSchema) => {
    if (!token) {
      toast.error('Token not found');
      return;
    }
    resetPasswordAction({ newPassword: data.newPassword, token });
  };

  useEffect(() => {
    if (resetPasswordResult.isSuccess) {
      toast.success(t('ResetPasswordSuccess'));
      router.push('/login');
    } else if (resetPasswordResult.isError) {
      if (isNotFoundRequestError(resetPasswordResult.error) || isUnauthorizedRequestError(resetPasswordResult.error)) {
        toast.error(resetPasswordResult.error.data.message);
      }
    }
  }, [resetPasswordResult, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" bg-gray-800 backdrop-filter bg-opacity-50  backdrop-blur-lg rounded-lg shadow-lg w-full max-w-lg overflow-hidden"
    >
      <div className="px-10 py-6">
        <motion.div className="from-green-400 text-center bg-gradient-to-r  to-emerald-500 text-transparent bg-clip-text text-3xl font-bold">
          {t('ResetPassword')}
        </motion.div>

        <div className="mt-5 text-gray-400 text-center text-sm">{t('ResetPasswordSub')}</div>
        <form className="mt-8" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="newPassword"
            render={({ field }) => (
              <Input
                icon={FaShieldAlt}
                type="password"
                placeholder="New Password"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.newPassword?.message}
              />
            )}
          />
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                  font-bold rounded-lg shadow-lg hover:from-green-600
                  hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                   focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            {t('Confirm')}
            {/* {forgotPasswordResult.isLoading ? (
              <LuLoader size={20} color="white" className="animate-spin mx-auto" />
            ) : (
              t('Confirm')
            )} */}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;

'use client';
import { NextPage } from 'next';
/* ----Framer Motion ---- */
import Input from '@/src/components/input';
import { useForgotPasswordUserMutation } from '@/src/redux/api/authApi';
import { isBadRequestError, isNotFoundRequestError } from '@/src/utils/predicate-type';
import { forgotPasswordSchema, TForgotPasswordSchema } from '@/src/utils/schema-validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { CiMail } from 'react-icons/ci';
import { LuLoader } from 'react-icons/lu';

type TProps = {};

const ForgotPasswordPage: NextPage<TProps> = () => {
  const { t } = useTranslation();
  const [forgotPasswordAction, forgotPasswordResult] = useForgotPasswordUserMutation();

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TForgotPasswordSchema>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (data: TForgotPasswordSchema) => {
    forgotPasswordAction(data);
  };

  useEffect(() => {
    if (forgotPasswordResult.isSuccess) {
      toast.success(t('ForgotPasswordSuccess'));
    } else if (forgotPasswordResult.isError) {
      if (isBadRequestError(forgotPasswordResult.error) || isNotFoundRequestError(forgotPasswordResult.error)) {
        toast.error(forgotPasswordResult.error.data.message);
      }
    }
  }, [forgotPasswordResult, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" bg-gray-800 backdrop-filter bg-opacity-50  backdrop-blur-lg rounded-lg shadow-lg w-full max-w-lg overflow-hidden"
    >
      <div className="px-10 py-6">
        <motion.div className="from-green-400 text-center bg-gradient-to-r  to-emerald-500 text-transparent bg-clip-text text-3xl font-bold">
          {t('ForgotPasswordTitle')}
        </motion.div>

        <div className="mt-5 text-gray-400 text-center text-sm">{t('ForgotPasswordSub')}</div>
        <form className="mt-8" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                icon={CiMail}
                type="text"
                placeholder="Email"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.email?.message}
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
            {forgotPasswordResult.isLoading ? (
              <LuLoader size={20} color="white" className="animate-spin mx-auto" />
            ) : (
              t('Confirm')
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;

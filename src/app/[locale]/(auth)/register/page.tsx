'use client';
/*----Next---*/
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/*----Framer Motion---*/
import { motion } from 'framer-motion';

/*----Components---*/
import Input from '@/src/components/input';
import PasswordStrength from '@/src/components/password-length';

/*----Redux Toolkit---*/
import { useRegisterUserMutation } from '@/src/redux/api/authApi';
import { isBadRequestError } from '@/src/utils/predicate-type';

/*----React Hook Form---*/
import { registerSchema, TRegisterSchema } from '@/src/utils/schema-validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

/*----Toast---*/
import toast from 'react-hot-toast';

/*----i18next---*/
import { useTranslation } from 'react-i18next';

/*----Icons---*/
import { CiMail, CiUser } from 'react-icons/ci';
import { FaShieldAlt } from 'react-icons/fa';
import { LuLoader } from 'react-icons/lu';

type TProps = {};
const RegisterPage: NextPage<TProps> = () => {
  const { t } = useTranslation();
  const [registerAction, registerResult] = useRegisterUserMutation();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });
  const onSubmit: SubmitHandler<TRegisterSchema> = (data) => {
    registerAction(data);
  };

  useEffect(() => {
    if (registerResult.isSuccess) {
      toast.success(t('RegisterSuccess'));
      reset();
      router.push('/verify-code');
    } else if (registerResult.isError) {
      if (isBadRequestError(registerResult.error)) {
        toast.error(registerResult.error.data.message);
      }
    }
  }, [registerResult, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" bg-gray-800 backdrop-filter bg-opacity-50  backdrop-blur-lg rounded-lg shadow-lg w-full max-w-lg overflow-hidden"
    >
      <div className="px-10 py-6">
        <div className="from-green-400 text-center bg-gradient-to-r  to-emerald-500 text-transparent bg-clip-text text-3xl font-bold">
          {t('RegisterTitle')}
        </div>

        <form className="mt-8" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                icon={CiUser}
                type="text"
                placeholder="Full name"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.name?.message}
              />
            )}
          />
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

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                icon={FaShieldAlt}
                type="password"
                placeholder="Password"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <PasswordStrength password={watch('password') as string} />
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            {registerResult.isLoading ? (
              <LuLoader size={20} color="white" className="animate-spin mx-auto" />
            ) : (
              t('SignUp')
            )}
          </motion.button>
        </form>
      </div>
      <div className="bg-gray-900 py-5 text-center flex justify-center items-center text-sm">
        <div className="text-gray-200 mr-2">{t('Accounted')}?</div>
        <Link href="/login" className="text-green-500 hover:underline">
          {t('SignIn')}
        </Link>
      </div>
    </motion.div>
  );
};

export default RegisterPage;

'use client';
/*----Next---*/
import { NextPage } from 'next';
import Link from 'next/link';

/*----Framer Motion---*/
import { motion } from 'framer-motion';

/*----Components---*/
import Input from '@/src/components/input';

/*----React Hook Form---*/
import { loginSchema, TLoginSchema } from '@/src/utils/schema-validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

/*----Icons---*/
import { useLoginUserMutation, useSocialLoginUserMutation } from '@/src/redux/api/authApi';
import { RootState } from '@/src/redux/store';
import { isUnauthorizedRequestError } from '@/src/utils/predicate-type';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { CiMail } from 'react-icons/ci';
import { FaGithub, FaGoogle, FaShieldAlt } from 'react-icons/fa';
import { LuLoader } from 'react-icons/lu';
import { useSelector } from 'react-redux';

type TProps = {};
const LoginPage: NextPage<TProps> = () => {
  const [loginUserAction, loginUserResult] = useLoginUserMutation();
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data } = useSession();
  const [socialLoginAction, socialLoginResult] = useSocialLoginUserMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const onSubmit: SubmitHandler<TLoginSchema> = (data) => {
    loginUserAction(data);
  };

  useEffect(() => {
    if (loginUserResult.isSuccess) {
      toast.success(t('LoginSuccess'));
      if (searchParams) {
        const redirect = searchParams.get('redirect');
        if (redirect) {
          router.push(`/course/${redirect}`);
          return;
        }
      }
      router.push('/');
    } else if (loginUserResult.isError && isUnauthorizedRequestError(loginUserResult.error)) {
      toast.error(loginUserResult.error.data.message);
    }
  }, [loginUserResult, t]);
  console.log('searchParams', searchParams);

  useEffect(() => {
    if (!user) {
      if (data?.user) {
        socialLoginAction({ name: data.user.name || '', email: data.user.email || '', avatar: data.user.image || '' })
          .then(() => {
            toast.success(t('LoginSuccess'));
            if (searchParams) {
              const redirect = searchParams.get('redirect');
              if (redirect) {
                router.push(`/course/${redirect}`);
                return;
              }
            }
            router.push('/');
          })
          .catch((error) => {
            console.log('Error', error);
          });
      }
    }
  }, [data]);

  return (
    <>
      {!socialLoginResult.isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className=" bg-gray-800 backdrop-filter bg-opacity-50  backdrop-blur-lg rounded-lg shadow-lg w-full max-w-lg overflow-hidden"
        >
          <div className="px-10 py-6">
            <div className="from-green-400 text-center bg-gradient-to-r  to-emerald-500 text-transparent bg-clip-text text-3xl font-bold">
              {t('WelcomeBack')}
            </div>

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

              <div className="flex justify-start text-sm text-gray-400 hover:text-gray-200">
                <Link href="/forgot-password">{t('ForgotPassword')}?</Link>
              </div>

              <motion.button
                className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
              >
                {loginUserResult.isLoading ? (
                  <LuLoader size={20} color="white" className="animate-spin mx-auto" />
                ) : (
                  t('SignIn')
                )}
              </motion.button>
            </form>
          </div>
          <div className="my-2 flex items-center justify-center">
            <div className="flex-1 bg-gray-700 h-[1px]"></div>
            <div className="mx-2 text-gray-400">{t('Or')}</div>
            <div className="flex-1 bg-gray-700 h-[1px]"></div>
          </div>
          <div className="flex justify-center items-center py-5 gap-5">
            <button
              onClick={() => {
                signIn('google');
              }}
            >
              <FaGoogle size={26} />
            </button>
            <button
              onClick={() => {
                signIn('github');
              }}
            >
              <FaGithub size={26} />
            </button>
          </div>
          <div className="bg-gray-900 py-5 text-center flex justify-center items-center text-sm">
            <div className="text-gray-200 mr-2">{t('NotAccounted')}?</div>
            <Link href="/register" className="text-green-500 hover:underline">
              {t('SignUp')}
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default LoginPage;

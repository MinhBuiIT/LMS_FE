'use client';
import { useResendVerifyEmailMutation, useVerifyEmailMutation } from '@/src/redux/api/authApi';
import { RootState } from '@/src/redux/store';
import { isBadRequestError, isNotFoundRequestError, isUnauthorizedRequestError } from '@/src/utils/predicate-type';
/*----Framer Motion---*/
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

/*----Next---*/
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { useSelector } from 'react-redux';

const VerifyCodePage = () => {
  const [codes, setCodes] = useState(new Array(6).fill(''));
  const refs = useRef<HTMLInputElement[]>([]);
  const [verifyEmailAction, verifyEmailResult] = useVerifyEmailMutation();
  const [resendVerifyEmailAction, resendVerifyEmailResult] = useResendVerifyEmailMutation();
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const { t } = useTranslation();
  const [disableResendMail, setDisableResendMail] = useState(false);
  const [countDown, setCountDown] = useState(360); // 6 minutes
  const user = useSelector((state: RootState) => state.auth.user);

  const handleResendEmail = async () => {
    if (!user || !user?.email) {
      toast.error('Email not found');
      return;
    }
    setDisableResendMail(true);
    await resendVerifyEmailAction({ email: user.email });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = codes.join('');
    await verifyEmailAction({ token, code });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    //Nếu value rỗng hoặc không phải là số thì return
    if (
      value === '' ||
      isNaN(+value) ||
      codes.every((item) => Boolean(item)) ||
      value.length > codes.length ||
      codes[index]
    )
      return;
    if (value.length > 1) {
      //Xử lý khi nhập nhiều hơn 1 ký tự (ví dụ: paste)
      const arr = value.split('');
      const indexHaveValue = codes.findIndex((item) => item === '');
      const newCodes = [...codes];
      for (let i = 0; i < arr.length && indexHaveValue + i < codes.length; i++) {
        newCodes[indexHaveValue + i] = arr[i];
      }
      console.log('NewCodes', newCodes);

      setCodes(newCodes);
      if (indexHaveValue + arr.length >= codes.length) return;
      refs.current[indexHaveValue + arr.length].focus();
    } else {
      setCodes((pre) => {
        const newArr = [...pre];
        newArr[index] = value;
        return newArr;
      });

      if (index === codes.length - 1) return;
      refs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && codes[index] !== '') {
      //Xử lý khi nhấn nút Backspace
      setCodes((pre) => {
        const newArr = [...pre];
        newArr[index] = '';
        return newArr;
      });
      if (index > 0) refs.current[index - 1].focus();
    }
  };
  useEffect(() => {
    if (verifyEmailResult.isSuccess) {
      toast.success(t('VerifyEmailSuccess'));
      router.push('/login');
    } else if (verifyEmailResult.isError) {
      if (isBadRequestError(verifyEmailResult.error) || isNotFoundRequestError(verifyEmailResult.error)) {
        toast.error(verifyEmailResult.error.data.message);
      } else if (isUnauthorizedRequestError(verifyEmailResult.error)) {
        toast.error('Code has expired');
      }
    }
  }, [verifyEmailResult, t]);

  useEffect(() => {
    if (disableResendMail) {
      const interval = setInterval(() => {
        setCountDown((prev) => {
          if (prev === 0) {
            setDisableResendMail(false);
            clearInterval(interval);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [disableResendMail]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" bg-gray-800 backdrop-filter bg-opacity-50  backdrop-blur-lg rounded-lg shadow-lg w-full max-w-lg overflow-hidden"
    >
      <div className="px-10 py-6">
        <motion.div className="from-green-400 text-center bg-gradient-to-r  to-emerald-500 text-transparent bg-clip-text text-3xl font-bold">
          {t('VerifyEmailTitle')}
        </motion.div>

        <div className="mt-5 text-gray-400 text-center text-sm">{t('VerifyEmailSub')}</div>
        <form className="mt-8" autoComplete="off" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {codes.map((code, index) => (
              <motion.input
                initial={{ x: 30 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.15, delay: index * 0.1 }}
                key={index}
                type="text"
                ref={(el) => {
                  (refs as any).current[index] = el;
                }}
                className={`${
                  verifyEmailResult.isError
                    ? 'focus:border-red-500 focus:ring-red-500 border-red-700'
                    : 'focus:border-green-500 focus:ring-green-500 border-gray-700'
                } w-12 h-12  bg-gray-800 bg-opacity-50 rounded-lg border   focus:ring-2  text-white placeholder-gray-400 transition duration-200 flex items-center justify-center text-3xl font-bold text-center`}
                value={code}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                  font-bold rounded-lg shadow-lg hover:from-green-600
                  hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                   focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={codes.some((code) => code === '')}
          >
            {verifyEmailResult.isLoading ? (
              <LuLoader size={20} color="white" className="animate-spin mx-auto" />
            ) : (
              t('VerifyEmail')
            )}
          </motion.button>
        </form>
        <div className="flex items-center justify-center mt-5">
          {disableResendMail ? (
            <span className="ml-2 text-gray-400 text-sm">Gửi lại sau {countDown}s</span>
          ) : (
            <button onClick={handleResendEmail} className=" inline-block text-sm text-center mx-auto text-green-600 ">
              {t('ResendEmail')} ?
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyCodePage;

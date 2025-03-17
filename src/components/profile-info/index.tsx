'use client';
import { IUser } from '@/src/@types/user';
import { useUpdateAvatarApiMutation, useUpdateUserInfoApiMutation } from '@/src/redux/api/userApi';
import { profileUserSchema, TProfileUserSchema } from '@/src/utils/schema-validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CiMail } from 'react-icons/ci';
import { LuLoader } from 'react-icons/lu';
import { MdPhotoCamera } from 'react-icons/md';
import { SiNamecheap } from 'react-icons/si';
import userAvatarDefault from '../../../public/user-avatar-default.jpg';
import Input from '../input';

type TProps = {
  user: IUser;
};

const ProfileInfo: React.FC<TProps> = ({ user }) => {
  const { t } = useTranslation();
  const [updateAvatarAction, updateAvatarResult] = useUpdateAvatarApiMutation();
  const [updateProfileAction, updateProfileResult] = useUpdateUserInfoApiMutation();
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TProfileUserSchema>({
    resolver: yupResolver(profileUserSchema),
    defaultValues: {
      email: user?.email,
      name: user?.name
    }
  });

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const base64 = fileReader.result as string;
      await updateAvatarAction({ avatar: base64 });
    };

    fileReader.readAsDataURL(e.target.files[0]);
  };

  const onSubmit = (data: TProfileUserSchema) => {
    updateProfileAction(data);
  };

  return (
    <>
      <div className="w-full flex items-center justify-center flex-col">
        <div className="relative">
          <Avatar sx={{ width: 80, height: 80, border: '3px solid #37b668' }}>
            <Image src={user.avatar?.url || userAvatarDefault} alt={user.name} width={300} height={300} />
          </Avatar>
          <input type="file" className="hidden" id="file-avatar" onChange={handleChangeFile} />
          <label
            htmlFor="file-avatar"
            className="absolute bottom-0 right-0 p-2 bg-green-500 shadow  text-white rounded-full cursor-pointer flex items-center justify-center"
          >
            <MdPhotoCamera />
          </label>
          {updateAvatarResult.isLoading && (
            <div className="absolute flex items-center justify-center top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-lg z-40">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
        <form className="mt-8 800px:w-[400px] w-[85%]" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8">
            <div className="text-black dark:text-white mb-3 text-lg">{t('FullName')}</div>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  icon={SiNamecheap}
                  type="text"
                  placeholder="Name"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.name?.message}
                />
              )}
            />
          </div>

          <div>
            <div className="text-black dark:text-white mb-3 text-lg">Email</div>
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
                  disabled
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
            {updateProfileResult.isLoading ? (
              <LuLoader size={20} color="white" className="animate-spin mx-auto" />
            ) : (
              t('Update')
            )}
          </motion.button>
        </form>
      </div>
    </>
  );
};

export default ProfileInfo;

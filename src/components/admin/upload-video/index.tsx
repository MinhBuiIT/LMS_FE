'use client';
import { useDeleteVideoApiMutation, useUploadVieoApiMutation } from '@/src/redux/api/courseApi';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaRegEdit } from 'react-icons/fa';
import ReactPlayer from 'react-player';

type TProps = {
  handleChangeUpload: (url: string, public_id: string, length?: number) => void;
  url: string;
  public_id: string;
  isShow?: boolean;
};

const UploadVideoBox: React.FC<TProps> = ({ handleChangeUpload, public_id, url, isShow = true }) => {
  console.log('public_id', public_id);

  const [uploadVideoAction, uploadVideoResult] = useUploadVieoApiMutation();
  const [delteVideoAction] = useDeleteVideoApiMutation();
  const [activeDrop, setActiveDrop] = React.useState(false);
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setActiveDrop(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setActiveDrop(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setActiveDrop(false);
    const file = e.dataTransfer.files[0];
    const formData = new FormData();
    formData.append('video', file);
    await uploadVideoAction(formData);
  };

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.length) return;
    const formData = new FormData();
    formData.append('video', files[0]);
    await uploadVideoAction(formData);
  };
  useEffect(() => {
    if (uploadVideoResult.isSuccess) {
      handleChangeUpload(
        uploadVideoResult.data.data.videoUrl,
        uploadVideoResult.data.data.videoId,
        uploadVideoResult.data.data.duration
      );
      if (!isShow) {
        toast.success('Upload video successfully');
      }
    }
  }, [uploadVideoResult.isSuccess]);

  const changeVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await delteVideoAction({ public_id: [public_id] });

    const { files } = e.target;
    if (!files?.length) return;
    const formData = new FormData();
    formData.append('video', files[0]);
    await uploadVideoAction(formData);
  };

  return (
    <>
      <div className="flex items-center justify-center w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        {uploadVideoResult.isLoading ? (
          <div className="flex items-center justify-center  h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 w-full">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
        ) : (
          <>
            {!url ? (
              <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-full h-64 border-2  border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100  dark:hover:border-gray-500 ${
                  activeDrop ? 'border-blue-600' : 'border-gray-300 dark:border-gray-700'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload video</span> or drag and drop
                  </p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept=".mp4" onChange={handleChangeFile} />
              </label>
            ) : (
              <>
                {isShow && (
                  <div className="w-full h-80 relative">
                    <ReactPlayer
                      url={url}
                      controls
                      width="100%"
                      height="100%"
                      style={{ borderRadius: '8px', objectFit: 'cover' }}
                      light={true}
                    />
                    <label
                      htmlFor="video-btn-change"
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-md cursor-pointer"
                    >
                      <FaRegEdit size={20} className="text-white" />
                      <input
                        id="video-btn-change"
                        type="file"
                        className="hidden"
                        accept=".mp4"
                        onChange={changeVideoFile}
                      />
                    </label>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default UploadVideoBox;

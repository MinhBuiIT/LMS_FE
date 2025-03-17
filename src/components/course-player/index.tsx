'use client';

import { useGenerationUrlVideoApiMutation } from '@/src/redux/api/courseApi';
import { useEffect } from 'react';
import Loading from '../loading';

type TProps = {
  videoId: string;
};

const CoursePlayer: React.FC<TProps> = ({ videoId }) => {
  const [generateUrlAction, generateUrlResult] = useGenerationUrlVideoApiMutation();
  useEffect(() => {
    if (videoId) {
      generateUrlAction({ videoId });
    }
  }, [videoId]);

  const data = generateUrlResult.data?.data;

  return (
    <>
      {generateUrlResult.isLoading ? (
        <Loading />
      ) : (
        <div className="w-full h-[400px] flex ">
          <iframe
            src={`https://player.vdocipher.com/v2/?otp=${data?.otp}&playbackInfo=${data?.playbackInfo}&player=HpKptp8csdphTUfn`}
            style={{ width: '100%', height: '100%' }}
            allowFullScreen={true}
            allow="encrypted-media"
          />
        </div>
      )}
    </>
  );
};
export default CoursePlayer;

'use client';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { AiOutlineGlobal } from 'react-icons/ai';
import { FaRegStar } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import CreateHandImg from '../../../public/creative-hand.jpg';
import GradientText from '../gradient-text';
import Orb from '../orb';
import SpotlightCard from '../spotlight-card';

type Props = {};

const Banner = (props: Props) => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="pt-[150px]  pb-[80px] bg-[rgb(231,241,250)]  dark:bg-black  h-full relative min-h-[130vh]">
      <div
        style={{ aspectRatio: '1/1' }}
        className="absolute top-0 left-1/2 -translate-x-1/2  w-[56%]  z-0 rounded-[50%] border-[1px] border-solid border-[#ccc] flex items-center justify-center"
      >
        <Orb />
      </div>

      <GradientText className="text-5xl leading-[65px] text-center capitalize  text-white absolute top-7 left-1/2 -translate-x-1/2">
        {t('BannerTitle')}
      </GradientText>

      <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 grid grid-cols-3 gap-8 max-w-[60%] mx-auto w-full">
        <SpotlightCard
          className="w-full"
          spotlightColor={resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(30, 58, 138, 0.15)'}
        >
          <div className="flex items-center dark:text-white text-black">
            <FiUsers size={50} />
            <div className="ml-9 ">
              <h3 className="text-3xl font-bold">10.2k</h3>
              <p className="text-lg mt-3">{t('BannerCard1')}</p>
            </div>
          </div>
        </SpotlightCard>
        <SpotlightCard
          className="w-full"
          spotlightColor={resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(30, 58, 138, 0.15)'}
        >
          <div className="flex items-center dark:text-white text-black">
            <FaRegStar size={50} />
            <div className="ml-9">
              <h3 className="text-3xl font-bold">4.9/5</h3>
              <p className="text-lg mt-3">{t('BannerCard2')}</p>
            </div>
          </div>
        </SpotlightCard>
        <SpotlightCard
          className="w-full"
          spotlightColor={resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(30, 58, 138, 0.15)'}
        >
          <div className="flex items-center dark:text-white text-black">
            <AiOutlineGlobal size={50} />
            <div className="ml-9">
              <h3 className="text-3xl font-bold">5k</h3>
              <p className="text-lg mt-3">{t('BannerCard3')}</p>
            </div>
          </div>
        </SpotlightCard>
      </div>

      <div className="absolute left-0 top-1/2  -translate-y-1/2 ">
        <Image src={CreateHandImg} width={400} height={400} alt="" />
      </div>
    </div>
  );
};

export default Banner;

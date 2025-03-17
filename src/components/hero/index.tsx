'use client';
/*----Next---*/
import Image from 'next/image';

/*----i18next---*/
import { useTranslation } from 'react-i18next';
import '../../configs/i18next';
/*----Imgs---*/
import { useGetLayoutQuery } from '@/src/redux/api/layoutApi';

const Hero = () => {
  const { t } = useTranslation();
  const { data } = useGetLayoutQuery({ type: 'banner' });

  const url = data?.data?.banner?.image.url;

  return (
    <div className=" bg-[rgb(231,241,250)] pb-[150px]  dark:bg-black  h-full relative min-h-[100vh] pt-[150px]">
      <div className="container mx-auto h-full">
        <div className=" flex flex-wrap 1000px:px-[80px] 800px:px-[40px] h-full ">
          <div className="w-full px-4 800px:w-6/12 mt-[40px]">
            <div className="hero-content text-center 800px:text-left">
              <h1 className="mb-5 text-4xl font-bold !leading-[1.208] text-black dark:text-white sm:text-[42px] 800px:text-[40px] xl:text-5xl font-Josefin capitalize">
                {t('Heading1')}
              </h1>
              <p className="mb-8 max-w-[480px] text-base text-body-color dark:text-black-6 text-black dark:text-white font-Josefin text-center 800px:text-left w-full mx-auto 800px:mx-0">
                {t('Heading2')}
              </p>
            </div>
            <div className="flex items-center justify-center 800px:justify-start">
              <button className=" relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 ">
                <span className="w-[200px] relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  {t('Explore')}
                </span>
              </button>
            </div>
          </div>
          <div className="hidden px-4 800px:block 800px:w-1/12"></div>
          <div className="w-full px-4 800px:w-5/12">
            <div className="800px:ml-auto 800px:text-right flex items-center justify-center">
              <div className="relative z-10  800px:inline-block pt-11 1000px:pt-0 800px:pt-10 ">
                {url && (
                  <Image
                    src={url}
                    alt="hero"
                    width={800}
                    height={500}
                    className="800px:ml-auto 800px:h-[500px] w-full h-[400px]"
                    style={{
                      borderTopLeftRadius: '100px',
                      borderBottomRightRadius: '12px',
                      borderBottomLeftRadius: '12px',
                      borderTopRightRadius: '12px'
                    }}
                    priority={true}
                  />
                )}

                <span className="absolute -bottom-8 -left-8 z-[-1]">
                  <svg width="93" height="93" viewBox="0 0 93 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="2.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="2.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="2.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="2.5" cy="90.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="90.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="90.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="90.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="90.5" r="2.5" fill="#3056D3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

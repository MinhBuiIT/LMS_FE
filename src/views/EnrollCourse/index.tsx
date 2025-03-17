'use client';
import { TLecture } from '@/src/@types/course';
import ButtonLanguage from '@/src/components/button-language';
import CommentList from '@/src/components/comment-list';
import Loading from '@/src/components/loading';
import ReviewCourse from '@/src/components/review-course';
import { useGetCourseDetailPurchasedQuery } from '@/src/redux/api/courseApi';
import { RootState } from '@/src/redux/store';
import { handleVideoLength } from '@/src/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { CiLight } from 'react-icons/ci';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { GrNext } from 'react-icons/gr';
import { IoIosArrowBack } from 'react-icons/io';
import { IoChevronBackOutline } from 'react-icons/io5';
import { MdOutlineDarkMode, MdOutlineOndemandVideo } from 'react-icons/md';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';

type TProps = {
  courseId: string;
};

const EntrollCourseView: FC<TProps> = ({ courseId }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  const courseIdDecode = Buffer.from(courseId, 'base64').toString('ascii');
  const router = useRouter();
  const [playing, setPlaying] = React.useState(false);
  const [lectureActive, setLectureActive] = React.useState<string>('');
  const [tabActive, setTabActive] = React.useState(0);
  const [isDropDown, setIsDropDown] = React.useState<boolean[]>([]);
  const { resolvedTheme, setTheme } = useTheme();
  const [sectionActiveOrder, setSectionActiveOrder] = React.useState<number>(1);

  const { data, isError, isLoading } = useGetCourseDetailPurchasedQuery({ id: courseIdDecode }, { skip: !courseId });
  const courseData = data?.data;

  useEffect(() => {
    if (user && !user.courses.some((c) => c.courseId === courseIdDecode) && user.role !== 'admin') {
      router.push('/');
      toast.error('Bạn không có quyền truy cập vào khóa học này');
    }
  }, [user, courseIdDecode]);
  const allLectures = useMemo(() => {
    return courseData?.sections.reduce((acc: TLecture[], curr) => {
      return [...acc, ...curr.lectures];
    }, []);
  }, [courseData]);

  // Data lecture active
  const lectureData = allLectures && allLectures.find((l) => l._id === lectureActive);

  const handleDropDown = (index: number) => {
    setIsDropDown((prev) => {
      if (!prev) return [];
      const newDropDown = [...prev];

      newDropDown[index] = !newDropDown[index];
      return newDropDown;
    });
  };

  useEffect(() => {
    if (courseData) {
      const dropDownLs = new Array(courseData.sections.length).fill(false);
      dropDownLs[0] = true;
      setIsDropDown(dropDownLs);

      const sectionFirst = courseData.sections[0];
      const lectureFirst = sectionFirst.lectures.find((l) => l.videoOrder === 1);
      setLectureActive(lectureFirst?._id as string);
      document.title = lectureFirst?.title || 'Enroll Course';
    } else if (isError) {
      router.push('/');
    }
  }, [courseData, isError]);

  const handleNextLecture = () => {
    if (!lectureData || !courseData) return;
    const currentOrderLecture = lectureData.videoOrder;
    const sectionActive = courseData.sections.find((section) => section.order === sectionActiveOrder);
    const nextLecture = sectionActive?.lectures.find((l) => l.videoOrder === currentOrderLecture + 1);
    if (nextLecture) {
      setLectureActive(nextLecture._id as string);
      document.title = nextLecture.title;
      setPlaying(true);
    } else {
      //Qua section tiếp theo
      const nextSection = courseData.sections.find((section) => section.order === sectionActiveOrder + 1);
      if (nextSection) {
        const nextLecture = nextSection.lectures.find((l) => l.videoOrder === 1);
        if (nextLecture) {
          setLectureActive(nextLecture._id as string);
          document.title = nextLecture.title;
          setSectionActiveOrder(nextSection.order);
          setIsDropDown((prev) => {
            if (!prev) return [];
            const newDropDown = [...prev];
            newDropDown[nextSection.order - 1] = true;
            return newDropDown;
          });
          setPlaying(true);
        }
      }
    }
  };

  const disabledNextLecture = useMemo(() => {
    if (!lectureData || !courseData) return true;
    const sectionLength = courseData.sections.length;
    const lastSection = courseData.sections[sectionLength - 1];
    const lastLecture = lastSection.lectures.find((l) => l.videoOrder === lastSection.lectures.length);
    return lectureData._id === lastLecture?._id;
  }, [lectureData, courseData]);

  const handleBackLecture = () => {
    if (!lectureData || !courseData) return;
    const currentOrderLecture = lectureData.videoOrder;
    const sectionActive = courseData.sections.find((section) => section.order === sectionActiveOrder);
    const backLecture = sectionActive?.lectures.find((l) => l.videoOrder === currentOrderLecture - 1);
    if (backLecture) {
      setLectureActive(backLecture._id as string);
      document.title = backLecture.title;
      setPlaying(true);
    } else {
      //Qua section trước
      const backSection = courseData.sections.find((section) => section.order === sectionActiveOrder - 1);
      if (backSection) {
        const backLecture = backSection.lectures.find((l) => l.videoOrder === backSection.lectures.length);
        if (backLecture) {
          document.title = backLecture.title;
          setLectureActive(backLecture._id as string);
          setSectionActiveOrder(backSection.order);
          setIsDropDown((prev) => {
            if (!prev) return [];
            const newDropDown = [...prev];
            newDropDown[backSection.order - 1] = true;
            return newDropDown;
          });
          setPlaying(true);
        }
      }
    }
  };

  const disabledBackLecture = useMemo(() => {
    if (!lectureData || !courseData) return true;
    const firstSection = courseData.sections[0];
    const firstLecture = firstSection.lectures.find((l) => l.videoOrder === 1);
    return lectureData._id === firstLecture?._id;
  }, [lectureData, courseData]);

  return (
    <div className="bg-[rgb(231,241,250)]  dark:bg-black  h-full relative min-h-[100vh]">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="fixed top-0 left-0 w-full h-16 brightness-110 shadow-md border-b-[1px] border-solid dark:border-gray-800 border-gray-100  bg-inherit flex items-center justify-between px-4 z-50">
            <div className="flex items-center">
              <button className="me-[9px]" onClick={() => router.back()}>
                <IoChevronBackOutline size={20} className="text-black dark:text-white" />
              </button>
              <div className="text-black dark:text-white font-Poppins text-lg">{courseData?.name}</div>
            </div>

            <div className="flex items-center gap-4">
              <button className="me-[9px]" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
                {resolvedTheme === 'dark' ? (
                  <CiLight className="dark:text-white text-black" size={25} />
                ) : (
                  <MdOutlineDarkMode className="dark:text-white text-black" size={25} />
                )}
              </button>
              <ButtonLanguage />
            </div>
          </div>
          <div className="w-full h-full mt-16 pb-[32px] flex ">
            <div className="w-[75%]">
              <div className="w-full h-[80vh] block overflow-y-auto relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                {!playing && (
                  <div
                    className="absolute w-full h-full inset-0 flex items-center justify-center text-white text-xl font-bold bg-[#ccc] z-10 cursor-pointer"
                    onClick={() => setPlaying(true)}
                  >
                    ▶ Click to Play
                  </div>
                )}
                <ReactPlayer
                  url={lectureData?.videoUrl.url}
                  controls={playing}
                  width="100%"
                  height="100%"
                  style={{ borderRadius: '8px', objectFit: 'cover', zIndex: 1 }}
                  // light={true}
                  playing={playing}
                />
              </div>
              <ul className="flex flex-wrap text-lg font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 mt-6 justify-around">
                {[t('OverviewShort'), t('Resource'), t('QA'), t('Reviews')].map((ele, i) => {
                  return (
                    <li className="me-2" key={i}>
                      <div
                        className={`${
                          i === tabActive
                            ? 'text-[#37b668] bg-gray-100/90 dark:bg-gray-800 dark:text-[#37b668]'
                            : 'hover:text-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                        } inline-block p-4 rounded-t-lg capitalize`}
                        onClick={() => setTabActive(i)}
                      >
                        {ele}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {/* Overview */}
              {tabActive === 0 && (
                <div className="mt-[40px] text-black dark:text-white font-Poppins pb-[64px]">
                  <div className="text-[18px] leading-8 px-[24px]">{lectureData?.description}</div>
                </div>
              )}
              {/* Resource */}
              {tabActive === 1 && (
                <div className="mt-[40px] pb-[64px] ms-[50px] text-black dark:text-white font-Poppins">
                  <h3 className="text-[24px] mb-6">{t('References')}</h3>
                  <ul className="ms-4 !list-disc">
                    {lectureData && lectureData?.links.length > 0 ? (
                      lectureData?.links.map((link) => {
                        return (
                          <li key={link._id} className="mt-4 flex items-center gap-4">
                            <span>{link.title}:</span>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 dark:text-blue-400"
                            >
                              {t('Here')}
                            </a>
                          </li>
                        );
                      })
                    ) : (
                      <div className="text-center w-full italic">{t('NoReferences')}</div>
                    )}
                  </ul>
                </div>
              )}
              {/* QA */}
              {tabActive === 2 && <CommentList lectureId={lectureData?._id as string} />}

              {/* Review Course */}
              {tabActive === 3 && <ReviewCourse courseId={courseIdDecode} />}
            </div>
            <div className="w-[22%] ps-4">
              <div>
                {courseData?.sections.map((section, index) => {
                  // Sort lectures by videoOrder
                  const lectures = [...section.lectures].sort((a, b) => a.videoOrder - b.videoOrder);

                  const numLectures = lectures.length;
                  const totalLength = lectures.reduce((acc, curr) => acc + curr.videoLength, 0);
                  const result = handleVideoLength(totalLength);

                  return (
                    <div className="mt-10 pb-8  border-b border-gray-400 dark:border-gray-700 w-full" key={index}>
                      <div
                        className="flex items-center justify-between text-black dark:text-white font-Poppins text-base"
                        onClick={() => handleDropDown(index)}
                      >
                        <div className="w-full relative">
                          <div className="w-full border-none outline-none bg-transparent text-[20px] text-black dark:text-white">
                            {t('Section')} {index + 1}: {section.title}
                          </div>
                          <div className="absolute bottom-[-23px] left-0 h-full flex items-center text-sm text-black dark:text-white font-semibold">
                            <div>
                              {numLectures} {t('Lecture')}
                            </div>
                            <div className="mx-2">-</div>
                            <div>
                              {result.value} {result.unit}
                            </div>
                          </div>
                        </div>
                        {isDropDown[index] ? (
                          <FaMinus className="text-black dark:text-white" />
                        ) : (
                          <FaPlus size={16} className="text-black dark:text-white" />
                        )}
                      </div>
                      {isDropDown !== null && isDropDown[index] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: isDropDown ? 'auto' : 0, opacity: isDropDown ? 1 : 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden mt-8"
                        >
                          <div className=" rounded-lg bg-gray-100 dark:bg-gray-800 w-full overflow-hidden">
                            {lectures.map((lecture, index) => {
                              const result = handleVideoLength(lecture.videoLength);
                              const isActive = lecture._id === lectureActive;
                              return (
                                <div
                                  className={`${
                                    isActive
                                      ? 'dark:bg-slate-500 bg-slate-300'
                                      : 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700'
                                  } flex items-center justify-between px-8 py-6 transition-all duration-150`}
                                  key={lecture.title}
                                  onClick={() => {
                                    setLectureActive(lecture._id as string);
                                    setSectionActiveOrder(section.order);
                                    setPlaying(true);
                                    document.title = lecture.title;
                                  }}
                                >
                                  <div className="flex items-center w-[80%]">
                                    <MdOutlineOndemandVideo size={20} color="#37b668" />
                                    <h5 className="text-black dark:text-white ml-2">{lecture.title}</h5>
                                  </div>
                                  <div className="text-base w-[20%] ps-2 text-black dark:text-white">
                                    {result.value} {result.unit}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 w-full h-16 bg-white dark:bg-gray-800 border-t-[1px] border-solid dark:border-gray-700 flex items-center justify-between px-4 z-50">
            <div className="flex items-center justify-center flex-1">
              <button
                onClick={handleBackLecture}
                disabled={disabledBackLecture}
                className={`relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 ${
                  disabledBackLecture ? 'cursor-not-allowed opacity-70' : ''
                }`}
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent flex items-center gap-3 justify-center">
                  <IoIosArrowBack size={16} />
                  <span>{t('PreLesson')}</span>
                </span>
              </button>

              <button
                onClick={handleNextLecture}
                className={`relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 ${
                  disabledNextLecture ? 'cursor-not-allowed opacity-70' : ''
                } `}
                disabled={disabledNextLecture}
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md bg-transparent dark:bg-transparent flex items-center gap-3 justify-center">
                  <span>{t('NextLesson')}</span>
                  <GrNext size={16} />
                </span>
              </button>
            </div>
            <div className="text-base text-black dark:text-white font-Poppins w-fit me-8">
              <span className="capitalize">{t('Lecture')}</span> : {lectureData?.title}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EntrollCourseView;

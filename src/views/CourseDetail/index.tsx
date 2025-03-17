'use client';
import CheckoutForm from '@/src/components/checkout-form';
import Header from '@/src/components/header';
import Loading from '@/src/components/loading';
import Modal from '@/src/components/modal';
import Rating from '@/src/components/rating';
import ReviewItem from '@/src/components/review-item';
import ReviewList from '@/src/components/review-list';
import AuthWrapper from '@/src/hoc/AuthWrapper';
import { getSocketContext } from '@/src/hoc/socket';
import { useGetCourseNotPurchaseQuery } from '@/src/redux/api/courseApi';
import { useGetPublishKeyApiQuery, useNewPaymentStripeApiMutation } from '@/src/redux/api/orderApi';
import { RootState } from '@/src/redux/store';
import { handleVideoLength } from '@/src/utils';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import { MdOutlineOndemandVideo } from 'react-icons/md';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';

type TProps = {
  courseId: string;
};

const CourseDetailView: React.FC<TProps> = ({ courseId }) => {
  const { t } = useTranslation();
  const socket = getSocketContext();
  const router = useRouter();
  const [stripePromise, setStripePromise] = React.useState<any>(null);
  const { data: config } = useGetPublishKeyApiQuery();
  const [newPaymentStripeAction, { isSuccess: isNewPaymentSuccess, data: newPaymentData }] =
    useNewPaymentStripeApiMutation();
  const [clientSecret, setClientSecret] = React.useState<string>('');
  const { user } = useSelector((state: RootState) => state.auth);
  const [isDropDown, setIsDropDown] = React.useState<boolean[]>([]);
  const [playing, setPlaying] = React.useState(false);
  const [openPayment, setOpenPayment] = React.useState(false);
  const [openModalReview, setOpenModalReview] = React.useState(false);

  const courseIdDecode = Buffer.from(courseId, 'base64').toString('ascii');

  const { data, isLoading, isError } = useGetCourseNotPurchaseQuery({ id: courseIdDecode }, { skip: !courseIdDecode });

  const courseData = data?.data;

  const handleDropDown = (index: number) => {
    setIsDropDown((prev) => {
      if (!prev) return [];
      const newDropDown = [...prev];

      return newDropDown.map((_, i) => (i === index ? !prev[index] : false));
    });
  };

  useEffect(() => {
    if (courseData) {
      setIsDropDown(new Array(courseData.sections.length).fill(false));
    } else if (isError) {
      router.push('/');
    }
  }, [courseData, isError]);

  const isPurchase = user && (user.courses?.map((c) => c.courseId)?.includes(courseIdDecode) || user.role === 'admin');

  useEffect(() => {
    if (config) {
      setStripePromise(loadStripe(config.data.publishKey));
    }
    if (courseData) {
      newPaymentStripeAction({ amount: courseData.estimatedPrice * 100 });
    }
  }, [config, courseData]);

  useEffect(() => {
    if (isNewPaymentSuccess) {
      setClientSecret(newPaymentData.data.client_secret);
    }
  }, [isNewPaymentSuccess]);

  const handleBuyNow = () => {
    if (!user) {
      router.push(`/login?redirect=${courseId}`);
    } else {
      setOpenPayment(true);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.connect();
    }
    return () => {
      console.log('ABC');

      socket?.disconnect();
    };
  }, []);

  return (
    <AuthWrapper authGuard={false} guestGuard={false}>
      <Header />
      {isLoading || !courseData ? (
        <Loading />
      ) : (
        <div className="bg-[rgb(231,241,250)] pb-[150px]  dark:bg-black  h-full relative min-h-[100vh] pt-[80px]">
          <div className="container mx-auto h-full">
            <div className="flex flex-col-reverse 800px:flex-row 1000px:px-[80px] 800px:px-[40px] h-full text-black dark:text-white gap-[20px]">
              <div className="w-[68%]">
                <h1 className="font-Poppins text-3xl mt-8 font-bold">{courseData.name}</h1>

                <div className="flex justify-between items-center font-Poppins text-sm mt-4">
                  <div className="flex items-center gap-2">
                    <Rating rating={courseData.rating} />
                    <h5>
                      {courseData.countReviews} {t('Reviews')}
                    </h5>
                  </div>
                  <h5 className="mr-[100px]">
                    {courseData.purchased} {t('Student')}
                  </h5>
                </div>
                <br />
                <br />
                <div className=" text-black dark:text-white font-Poppins">
                  <div className="text-xl font-bold">{t('Benefit')}</div>
                  {courseData.benifits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 mt-2">
                      <IoCheckmarkDoneOutline size={16} />
                      <div className="text-base">{benefit.title}</div>
                    </div>
                  ))}
                </div>
                <br />
                <br />
                <div className=" text-black dark:text-white font-Poppins">
                  <div className="text-xl font-bold">{t('Prerequisite')}</div>
                  {courseData.prerequisites.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 mt-2">
                      <IoCheckmarkDoneOutline size={16} />
                      <div className="text-base">{benefit.title}</div>
                    </div>
                  ))}
                </div>
                <br />
                <br />
                <div className=" text-black dark:text-white font-Poppins">
                  <div className="text-xl font-bold">{t('Overview')}</div>
                  <div>
                    {courseData.sections.map((section, index) => {
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
                                <div>{numLectures} lectures</div>
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
                              <div className="p-8 rounded-lg bg-gray-100 dark:bg-gray-800 w-full">
                                {lectures.map((lecture) => {
                                  const result = handleVideoLength(lecture.videoLength);

                                  return (
                                    <div
                                      className="flex items-center justify-between [&:not(:last-child)]:mb-8"
                                      key={lecture.title}
                                    >
                                      <div className="flex items-center">
                                        <MdOutlineOndemandVideo size={20} color="#37b668" />
                                        <h5 className="text-black dark:text-white ml-2">{lecture.title}</h5>
                                      </div>
                                      <div className="text-base">
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
                <br />
                <br />
                <div className=" text-black dark:text-white font-Poppins">
                  <div className="text-xl font-bold">{t('Detail')}</div>
                  <div className="text-base mt-8">{courseData.description}</div>
                </div>

                <br />
                <br />
                <div className="text-black dark:text-white font-Poppins">
                  <div className="text-xl font-bold">{t('Reviews')}</div>
                  <div className="mt-8">
                    {courseData.top_reviews.length > 0 ? (
                      courseData.top_reviews.map((review) => (
                        <ReviewItem review={review} key={review._id} showReply={false} />
                      ))
                    ) : (
                      <div className="text-base text-center dark:text-gray-400 text-gray-800 italic">
                        {t('NoReview')}
                      </div>
                    )}
                  </div>
                  {courseData.top_reviews.length > 0 && (
                    <div className="w-full mt-8 flex justify-start">
                      <button
                        onClick={() => setOpenModalReview(true)}
                        className="outline-none border-none text-center text-black dark:text-white text-base"
                      >
                        {t('SeeMore')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-[30%] ">
                <div className="sticky top-[80px]">
                  <div className="w-full h-80 relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                    {!playing && (
                      <div
                        className="absolute w-full h-full inset-0 flex items-center justify-center text-white text-xl font-bold bg-[#ccc] z-10 cursor-pointer"
                        onClick={() => setPlaying(true)}
                      >
                        ▶ Click to Play
                      </div>
                    )}
                    <ReactPlayer
                      url={courseData.demoUrl.url}
                      controls={playing}
                      width="100%"
                      height="100%"
                      style={{ borderRadius: '8px', objectFit: 'cover', zIndex: 1 }}
                      // light={true}
                      playing={playing}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-black dark:text-white mt-5">
                    <div className="text-2xl font-bold">{courseData.estimatedPrice.toString() + '$'}</div>
                    <div className="text-base mb-4 line-through">{courseData.price.toString() + '$'}</div>
                    <div className="text-lg ">
                      {Math.round(((courseData.price - courseData.estimatedPrice) / courseData.price) * 100)}%{' '}
                      {t('Off')}
                    </div>
                  </div>
                  <div className="mt-10">
                    {isPurchase ? (
                      <button
                        onClick={() => router.push('/enroll-course/' + courseId)}
                        className="relative w-full inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-base font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                      >
                        <span className="relative px-5 w-full  py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                          {t('Enroll')}
                        </span>
                      </button>
                    ) : (
                      <button
                        className="relative w-full inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-base font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                        onClick={handleBuyNow}
                      >
                        <span className="relative w-full  px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                          {t('BuyNow')}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Payment */}
      {openPayment && (
        <Modal handleClose={() => setOpenPayment(false)}>
          <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
            <CheckoutForm data={courseData} courseId={courseId} setOpen={setOpenPayment} socket={socket} />
          </Elements>
        </Modal>
      )}

      {openModalReview && (
        <Modal handleClose={() => setOpenModalReview(false)} minW={500}>
          <ReviewList courseId={courseIdDecode} />
        </Modal>
      )}
    </AuthWrapper>
  );
};

export default CourseDetailView;

'use client';
import ChangePassword from '@/src/components/change-password';
import CourseItemCard from '@/src/components/course-item-card';
import Loading from '@/src/components/loading';
import ProfileInfo from '@/src/components/profile-info';
import SidebarProfile from '@/src/components/sidebar-profile';
import { useCourseListPurchasedQuery } from '@/src/redux/api/courseApi';
import { RootState } from '@/src/redux/store';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const LIMIT = 8;

const ProfileView = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<number>(1);
  const { data } = useCourseListPurchasedQuery({ page: 1, limit: LIMIT });
  const courses = data?.data?.courses || [];
  const { t } = useTranslation();

  return (
    <>
      {user ? (
        <div className="bg-white pb-[110px] dark:bg-black   relative h-[100vh] pt-[150px]">
          <div className="w-[95%] 800px:w-[70%] mx-auto h-full flex items-start">
            <SidebarProfile activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1">
              {activeTab === 1 && <ProfileInfo user={user} />} {activeTab === 2 && <ChangePassword />}
              {activeTab === 3 && (
                <>
                  {courses.length > 0 && (
                    <div className="grid md:grid-cols-3  sm:grid-cols-2 grid-cols-1 gap-4 ms-7 mx-auto w-full mt-[60px]">
                      {courses.map((course) => (
                        <CourseItemCard courseItem={course} key={course._id} isEnroll={true} t={t} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default ProfileView;

'use client';
import { TCourseContent, TCourseInfo, TLecture } from '@/src/@types/course';
import CourseContent from '@/src/components/admin/course-content';
import CourseInfomation from '@/src/components/admin/course-infomation';
import CourseOptions from '@/src/components/admin/course-options';
import CoursePreview from '@/src/components/admin/course-preview';
import CreateCourseLine from '@/src/components/admin/create-course-line';
import { useCreateCourseApiMutation } from '@/src/redux/api/courseApi';
import { isBadRequestError, isUnauthorizedRequestError } from '@/src/utils/predicate-type';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const inititalCourseContent: TCourseContent[] = [
  {
    videoSection: 'Untitled Section 1',
    description: '',
    links: [
      {
        title: '',
        url: ''
      }
    ],
    title: '',
    videoLength: 0,
    videoUrl: {
      url: '',
      public_id: ''
    }
  }
];

const CreateCourseView: React.FC = () => {
  const [createCourseAction, createCourseResult] = useCreateCourseApiMutation();
  const [active, setActive] = React.useState(0);
  const [courseInfo, setCourseInfo] = React.useState<TCourseInfo>({
    name: '',
    description: '',
    price: 0,
    estimatedPrice: 0,
    tags: '',
    level: '',
    demoUrl: {
      url: '',
      public_id: ''
    },
    thumbnail: '',
    category: ''
  });

  const [courseContent, setCourseContent] = React.useState<TCourseContent[]>(inititalCourseContent);

  const [benefits, setBenefits] = React.useState<string[]>(['']);
  const [prerequisites, setPrerequisites] = React.useState<string[]>(['']);
  const router = useRouter();

  const handleCreateCourse = () => {
    const loadingToast = toast.loading('Creating course...');

    let orderCount = 1;
    // Format course data
    const courseDataFormatted: TCourseContent[] = courseContent.map((content, index) => {
      //If new section, reset orderCount
      if (index === 0 || content.videoSection !== courseContent[index - 1]?.videoSection) {
        orderCount = 1;
      } else {
        orderCount++;
      }

      return {
        title: content.title,
        videoSection: content.videoSection,
        description: content.description,
        videoUrl: content.videoUrl,
        videoLength: content.videoLength,
        videoOrder: orderCount,
        links: content.links.map((link) => ({ title: link.title, url: link.url }))
      };
    });

    let countSection = 1;
    const courseDataConfig: {
      title: string;
      order: number;
      lectures: TLecture[];
    } = courseDataFormatted.reduce((acc: any, cur) => {
      const sectionIndex = acc.findIndex((item: any) => item.title === cur.videoSection);
      const lecture = {
        title: cur.title,
        description: cur.description,
        videoUrl: cur.videoUrl,
        videoLength: cur.videoLength,
        videoOrder: cur.videoOrder,
        links: cur.links
      };
      if (sectionIndex === -1) {
        // Nếu Section chưa tồn tại, thêm mới
        acc.push({
          title: cur.videoSection,
          order: countSection,
          lectures: [lecture]
        });
        countSection++;
      } else {
        // Nếu Section đã tồn tại, thêm Lecture vào
        acc[sectionIndex].lectures.push(lecture);
      }

      return acc;
    }, []);

    //console.log('courseDataConfig', courseDataConfig);

    const courseBodyFormatted = {
      courseInfo: {
        ...courseInfo,
        benifits: benefits.map((benefit) => ({ title: benefit })),
        prerequisites: prerequisites.map((prerequisite) => ({ title: prerequisite })),
        tags: courseInfo.tags.split(',').map((tag) => tag.trim())
      },
      courseData: courseDataConfig
    };

    //console.log('courseBodyFormatted', courseBodyFormatted);

    createCourseAction(courseBodyFormatted)
      .unwrap()
      .then(() => {
        // Redirect to course list
        router.push('/admin/live-course');
        toast.success('Create course successfully', { id: loadingToast });
      })
      .catch(() => {
        if (isBadRequestError(createCourseResult.error) || isUnauthorizedRequestError(createCourseResult.error)) {
          toast.error(createCourseResult.error.data.message, { id: loadingToast });
        } else {
          toast.error('Create course failed', { id: loadingToast });
        }
      });
    //Format course body
  };

  return (
    <div className="w-full h-full flex " style={{ paddingTop: '120px' }}>
      <div className="w-3/4 flex-1" style={{ margin: '0 40px' }}>
        {active === 0 && (
          <CourseInfomation courseInfo={courseInfo} setCourseInfo={setCourseInfo} setActive={setActive} />
        )}

        {active === 1 && (
          <CourseOptions
            setActive={setActive}
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
          />
        )}

        {active === 2 && (
          <CourseContent
            setActive={setActive}
            setCourseContent={setCourseContent}
            courseContent={courseContent as any}
          />
        )}

        {active === 3 && (
          <CoursePreview
            setActive={setActive}
            courseInfo={courseInfo}
            benefits={benefits}
            prerequisites={prerequisites}
            handleConfirmCourse={handleCreateCourse}
          />
        )}
      </div>
      <div className="w-1/4 relative">
        <CreateCourseLine active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default CreateCourseView;

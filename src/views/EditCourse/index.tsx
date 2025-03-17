'use client';
import { TCourseBody, TCourseContent, TCourseInfo, TLecture } from '@/src/@types/course';
import CourseContent from '@/src/components/admin/course-content';
import CourseInfomation from '@/src/components/admin/course-infomation';
import CourseOptions from '@/src/components/admin/course-options';
import LectureList from '@/src/components/lecture-list';
import {
  useAddNewSectionApiMutation,
  useGetCourseDetailPurchasedQuery,
  useUpdateCourseApiMutation,
  useUpdateSectionCourseApiMutation
} from '@/src/redux/api/courseApi';
import { checkFillAllFields } from '@/src/utils';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { ObjectId } from 'bson';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaMinus, FaPlus, FaRegEdit } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';

type ISection = {
  _id: string;
  title: string;
  order: number;
  lectures: TLecture[];
};

const initialNewCourseContent: TCourseContent[] = [
  {
    videoSection: 'Untitled Section',
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

//Lưu index của section đang mở dropdown để khi refresh không mất trạng thái

const EditCourseView: React.FC<{ courseId: string }> = ({ courseId }) => {
  const router = useRouter();

  const [newCourseContent, setNewCourseContent] = React.useState<TCourseContent[]>(initialNewCourseContent);
  const [courseContent, setCourseContent] = React.useState<TCourseContent[]>([]);
  const [isEditSection, setIsEditSection] = React.useState<number>(-2);
  const [dragIdItem, setDragIdItem] = React.useState<{ active: string; over: string }>({
    active: '',
    over: ''
  });

  const [benefits, setBenefits] = React.useState<string[]>(['']);
  const [prerequisites, setPrerequisites] = React.useState<string[]>(['']);
  const [sections, setSections] = React.useState<ISection[]>([]);
  const [isDropDown, setIsDropDown] = React.useState<boolean[]>([]);
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
  const { data, refetch } = useGetCourseDetailPurchasedQuery(
    { id: courseId },
    { skip: !courseId, refetchOnMountOrArgChange: true }
  );
  const [updateSectionAction] = useUpdateSectionCourseApiMutation();
  const [updateCourseAction] = useUpdateCourseApiMutation();
  const [addNewSectionAction] = useAddNewSectionApiMutation();

  const courseDetail = data?.data;

  useEffect(() => {
    if (courseDetail) {
      setCourseInfo({
        name: courseDetail.name,
        description: courseDetail.description,
        price: courseDetail.price,
        estimatedPrice: courseDetail.estimatedPrice,
        tags: courseDetail.tags.join(','),
        level: courseDetail.level,
        demoUrl: courseDetail.demoUrl,
        thumbnail: courseDetail.thumbnail.url,
        category: courseDetail.category
      });
      setBenefits(courseDetail.benifits.map((b) => b.title));
      setPrerequisites(courseDetail.prerequisites.map((p) => p.title));
      setSections(courseDetail.sections);

      const dropDownList = new Array(courseDetail.sections.length).fill(false);
      const indexDropDown = JSON.parse(localStorage.getItem('indexDropDown') || '-1');
      if (indexDropDown !== -1) {
        dropDownList[indexDropDown] = true;
      }
      setIsDropDown(dropDownList);
    }
  }, [courseDetail]);

  const handleDropDown = (index: number) => {
    setIsDropDown((prev) => {
      if (!prev) return [];
      const newDropDown = [...prev];
      if (newDropDown[index]) {
        //Close dropdown
        localStorage.setItem('indexDropDown', JSON.stringify(-1));
      } else {
        //Open dropdown
        localStorage.setItem('indexDropDown', JSON.stringify(index));
      }
      return newDropDown.map((_, i) => (i === index ? !prev[index] : false));
    });
  };
  useEffect(() => {
    if (isEditSection >= 0) {
      const sectionEdit = { ...sections[isEditSection] };
      const contentsEdit = [...sectionEdit.lectures]
        .sort((a, b) => a.videoOrder - b.videoOrder) // Sort lectures by videoOrder
        .map((lecture) => {
          return {
            _id: lecture._id,
            videoSection: sectionEdit.title,
            description: lecture.description,
            links: lecture.links.map((link) => ({ title: link.title, url: link.url })),
            title: lecture.title,
            videoLength: lecture.videoLength,
            videoUrl: lecture.videoUrl
          };
        });
      setCourseContent(contentsEdit);
    }
  }, [isEditSection]);

  const handleConfirmEditSection = () => {
    if (isEditSection === -1 || isEditSection === -2) return;

    //check courseContent valid
    const lastContent = courseContent[courseContent.length - 1];
    const checkStringEmpty = checkFillAllFields(lastContent);
    if (checkStringEmpty) {
      toast.error('Please fill all the fields');
      return;
    }
    if (lastContent.videoLength === 0) {
      toast.error('Video length must be greater than 0');
      return;
    }

    if (lastContent.videoUrl.url === '') {
      toast.error('Please upload video');
      return;
    }

    const newSections = [...sections];

    const sectionSingle = { ...newSections[isEditSection] };
    sectionSingle.title = courseContent[0].videoSection;
    sectionSingle.lectures = courseContent.map((content, index) => {
      return {
        _id: (content as any)?._id || new ObjectId().toString(),
        title: content.title,
        description: content.description,
        links: content.links.map((link) => ({ title: link.title, url: link.url })),
        videoLength: content.videoLength,
        videoUrl: content.videoUrl,
        videoOrder: index + 1
      };
    });

    updateSectionAction({ id: sectionSingle._id, data: { ...sectionSingle, courseId } })
      .unwrap()
      .then(() => {
        toast.success('Edit section successfully');
        setCourseContent([]);
        setIsEditSection(-2);
        refetch();
      })
      .catch(() => {
        toast.error('Edit section failed');
      });
  };

  const handleSaveCourse = () => {
    const dataCourse: Pick<TCourseBody, 'courseInfo'> = {
      courseInfo: {
        ...courseInfo,
        tags: courseInfo.tags.split(',').map((tag) => tag.trim()),
        benifits: benefits.map((b) => ({ title: b })),
        prerequisites: prerequisites.map((p) => ({ title: p }))
      }
    };

    updateCourseAction({ id: courseId, data: dataCourse })
      .unwrap()
      .then(() => {
        toast.success('Edit course successfully');
        router.push('/admin/live-course');
      })
      .catch(() => {
        toast.error('Edit course failed');
      });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    setDragIdItem({ active: active.id as string, over: over.id as string });
  };

  const handleConfirmAddSection = () => {
    if (isEditSection !== -1) return;
    //check courseContent valid
    const lastContent = newCourseContent[newCourseContent.length - 1];
    const checkStringEmpty = checkFillAllFields(lastContent);
    if (checkStringEmpty) {
      toast.error('Please fill all the fields');
      return;
    }
    if (lastContent.videoLength === 0) {
      toast.error('Video length must be greater than 0');
      return;
    }

    if (lastContent.videoUrl.url === '') {
      toast.error('Please upload video');
      return;
    }

    const newSection = {
      title: newCourseContent[0].videoSection,
      order: sections.length + 1,
      lectures: newCourseContent.map((content, index) => {
        return {
          title: content.title,
          description: content.description,
          links: content.links.map((link) => ({ title: link.title, url: link.url })),
          videoLength: content.videoLength,
          videoUrl: content.videoUrl,
          videoOrder: index + 1
        };
      })
    };
    addNewSectionAction({ courseId, data: newSection })
      .unwrap()
      .then(() => {
        toast.success('Add new section successfully');
        setNewCourseContent(initialNewCourseContent);
        setIsEditSection(-2);
        refetch();
      })
      .catch(() => {
        toast.error('Add new section failed');
      });
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ paddingTop: '120px' }}>
      <div className="w-3/4 mx-auto">
        {isEditSection === -2 && (
          <>
            <CourseInfomation courseInfo={courseInfo} setCourseInfo={setCourseInfo} isEdit={true} />
            <CourseOptions
              benefits={benefits}
              setBenefits={setBenefits}
              prerequisites={prerequisites}
              setPrerequisites={setPrerequisites}
              isEdit={true}
            />
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              {sections.map((section, index) => {
                // Sort lectures by videoOrder
                const lectures = [...section.lectures]
                  .sort((a, b) => a.videoOrder - b.videoOrder)
                  .map((l) => {
                    return {
                      ...l,
                      id: l._id || new ObjectId().toString()
                    };
                  });

                return (
                  <div className="mt-10 pb-8  border-b border-gray-400 dark:border-gray-700 w-full" key={index}>
                    <div
                      className="flex items-center justify-between text-black dark:text-white font-Poppins text-base"
                      onClick={() => handleDropDown(index)}
                    >
                      <div className="w-full border-none outline-none bg-transparent text-[20px] text-black dark:text-white">
                        Section {index + 1}: {section.title}
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
                        <div className="p-8 rounded-lg bg-gray-100 dark:bg-gray-800">
                          {/* <SortableContext items={lectures} strategy={verticalListSortingStrategy}>
                            {lectures.map((lecture, index) => (
                              <LectureItem lecture={lecture} key={lecture.id} />
                            ))}
                          </SortableContext> */}
                          <LectureList
                            lectures={lectures}
                            dragIdItem={dragIdItem}
                            setDragIdItem={setDragIdItem}
                            courseId={courseId}
                            sectionId={section._id}
                            handleRefresh={() => {
                              refetch();
                            }}
                          />
                          <div className="w-full mt-8 justify-end flex">
                            <button onClick={() => setIsEditSection(index)}>
                              <FaRegEdit className="text-gray-700 dark:text-white" size={20} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
              <div className="flex justify-start mt-8">
                <button
                  type="button"
                  className="flex outline-none items-center gap-2 "
                  onClick={() => setIsEditSection(-1)}
                >
                  <IoMdAddCircleOutline size={20} className="text-black dark:text-white" />
                  <span className="text-black dark:text-white">Add New Section</span>
                </button>
              </div>
            </DndContext>
            <div className="w-full flex justify-between items-center mt-16 pb-10">
              <button className="px-6 py-2 bg-blue-600 rounded-md text-white" onClick={() => handleSaveCourse()}>
                Lưu Lại
              </button>
            </div>
          </>
        )}

        {isEditSection === -1 && (
          <CourseContent
            setCourseContent={setNewCourseContent}
            courseContent={newCourseContent as any}
            isEdit={true}
            handleConfirmEditSection={handleConfirmAddSection}
          />
        )}

        {isEditSection >= 0 && (
          <CourseContent
            setCourseContent={setCourseContent}
            courseContent={courseContent as any}
            isEdit={true}
            handleConfirmEditSection={handleConfirmEditSection}
          />
        )}
      </div>
    </div>
  );
};

export default EditCourseView;

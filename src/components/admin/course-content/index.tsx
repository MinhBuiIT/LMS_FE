'use client';
import { TCourseContent } from '@/src/@types/course';
import { useVideoInfoApiMutation } from '@/src/redux/api/courseApi';
import { checkFillAllFields } from '@/src/utils';
import { IconButton } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { FaAngleDown, FaAngleUp, FaCheck, FaPen } from 'react-icons/fa';
import { IoIosRemoveCircleOutline, IoMdAddCircleOutline } from 'react-icons/io';
import { MdDeleteOutline } from 'react-icons/md';
import UploadVideoBox from '../upload-video';

type TProps = {
  courseContent: (TCourseContent & { id: string })[];
  setCourseContent: (courseContent: (TCourseContent & { id: string })[]) => void;
  setActive?: (index: number) => void;
  isEdit?: boolean;
  handleConfirmEditSection?: () => void;
};

const CourseContent: React.FC<TProps> = ({
  courseContent,
  setActive,
  setCourseContent,
  isEdit = false,
  handleConfirmEditSection
}) => {
  const [editTitleSection, setEditTitleSection] = React.useState('');
  const [editTitleSectionIndex, setEditTitleSectionIndex] = React.useState(-1);
  const [inputTitleSection, setInputTitleSection] = React.useState<HTMLInputElement | null>(null);
  const [isConllapses, setIsConllapses] = React.useState<boolean[]>(Array(courseContent.length).fill(true));
  const [videoInfoAction] = useVideoInfoApiMutation();

  const handleStartEdit = (
    index: number,
    oldTitleSection: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (editTitleSectionIndex !== -1) return;
    const previouseInput = e.currentTarget.previousElementSibling as HTMLInputElement;
    setInputTitleSection(previouseInput);
    setEditTitleSectionIndex(index);
  };

  useEffect(() => {
    if (inputTitleSection) {
      inputTitleSection.focus();
    }
  }, [inputTitleSection]);

  const handleConfirmEdit = (index: number) => {
    if (editTitleSection === '') {
      toast.error('Please fill the title section');
      return;
    }

    let newCourseContent = [...courseContent];
    const titleSection = newCourseContent[index].videoSection;
    newCourseContent = newCourseContent.map((content, i) => {
      if (content.videoSection === titleSection) {
        return { ...content, videoSection: editTitleSection };
      }
      return content;
    });
    setCourseContent(newCourseContent);
    setEditTitleSectionIndex(-1); // reset edit index
    setInputTitleSection(null); // reset input
    setEditTitleSection(''); // reset input value
  };

  const handleChangeContentItem = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    linkIndex?: number
  ) => {
    const { name, value } = e.target;

    let newCourseContent = [...courseContent];
    if (linkIndex === undefined) {
      newCourseContent[index] = {
        ...newCourseContent[index],
        [name]: value
      };
    } else {
      newCourseContent[index].links[linkIndex] = { ...newCourseContent[index].links[linkIndex], [name]: value };
    }
    setCourseContent(newCourseContent);
  };

  //Handle Link
  const handleAddLink = (indexContent: number) => {
    const foundContent = courseContent[indexContent];
    if (foundContent.links.length > 0) {
      const lastLink = foundContent.links[foundContent.links.length - 1];
      if (lastLink.title === '' || lastLink.url === '') {
        toast.error('Please fill the last link');
        return;
      }
    }
    let newCourseContent = [...courseContent];
    newCourseContent[indexContent].links.push({ title: '', url: '' });
    setCourseContent(newCourseContent);
  };

  const handleRemoveLink = (indexContent: number) => {
    let newCourseContent = [...courseContent];
    const lastLink = newCourseContent[indexContent].links.length;
    if (lastLink > 0) {
      newCourseContent[indexContent].links.splice(lastLink - 1, 1);
      setCourseContent(newCourseContent);
    }
  };
  //End Handle Link

  const lastContentSections = useMemo(() => {
    const result = courseContent
      .map((content, index) => {
        if (content.videoSection !== courseContent[index + 1]?.videoSection) return index;
        return -1;
      })
      .filter((index) => index !== -1);
    return result.length === 0 ? [courseContent.length - 1] : result;
  }, [courseContent.length]);

  //Start Handle Content
  const addNewContent = (indexLastContent: number) => {
    //check last content fill all fields
    const lastContent = courseContent[indexLastContent];
    const checkStringEmpty = checkFillAllFields(lastContent);
    if (checkStringEmpty) {
      toast.error('Please fill all the fields');
      return;
    }
    if (lastContent.videoLength === 0) {
      toast.error('Video length must be greater than 0');
      return;
    }

    let newCourseContent = [...courseContent];
    const lastContentTitle = newCourseContent[indexLastContent].videoSection;
    const newContent = {
      videoSection: lastContentTitle,
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
    };

    newCourseContent.splice(indexLastContent + 1, 0, newContent as any);
    setCourseContent(newCourseContent);
    setIsConllapses([...isConllapses, true]);
  };

  const handleRemoveContent = (indexContent: number) => {
    let newCourseContent = [...courseContent];
    newCourseContent.splice(indexContent, 1);
    setCourseContent(newCourseContent);
  };
  //End Handle Content

  //toggle collapse
  const toggleCollapse = (index: number) => {
    let newIsCollapses = [...isConllapses];
    newIsCollapses[index] = !newIsCollapses[index];
    setIsConllapses(newIsCollapses);
  };

  //Start Handle Section
  const handleAddNewSection = () => {
    //check last section fill all fields
    const lastContentSection = courseContent[courseContent.length - 1];
    const checkStringEmpty = checkFillAllFields(lastContentSection);
    if (checkStringEmpty) {
      toast.error('Please fill all the fields');
      return;
    }
    if (lastContentSection.videoLength === 0) {
      toast.error('Video length must be greater than 0');
      return;
    }

    const newCourseContent = [...courseContent];
    const newSection = {
      videoSection: 'Untitled Section ' + (lastContentSections.length + 1),
      description: '',
      links: [
        {
          title: '',
          url: ''
        }
      ],
      title: '',
      videoLength: 0,
      videoUrl: ''
    };
    newCourseContent.push(newSection as any);
    setCourseContent(newCourseContent);
    setIsConllapses([...isConllapses, true]);
  };

  //End Handle Section

  const handleNext = () => {
    //check last section fill all fields
    const lastContentSection = courseContent[courseContent.length - 1];
    const checkStringEmpty = checkFillAllFields(lastContentSection);
    if (checkStringEmpty) {
      toast.error('Please fill all the fields');
      return;
    }
    if (lastContentSection.videoLength === 0) {
      toast.error('Video length must be greater than 0');
      return;
    }
    setActive && setActive(3);
  };

  return (
    <div className="w-[90%] mx-auto pb-[60px]">
      <form>
        {courseContent.map((content, index) => {
          const showNewSection = index === 0 || courseContent[index - 1].videoSection !== content.videoSection;

          return (
            <div className={`w-full h-full bg-[#1f2029] rounded-sm p-4 ${showNewSection ? 'mt-10' : ''}`} key={index}>
              {showNewSection && (
                <div className={`flex items-center justify-between`}>
                  <input
                    type="text"
                    className={`outline-none bg-transparent text-black dark:text-white text-base font-Poppins`}
                    value={editTitleSectionIndex === index ? editTitleSection : content.videoSection}
                    disabled={editTitleSectionIndex !== index}
                    onChange={(e) => setEditTitleSection(e.target.value)}
                  />
                  {editTitleSectionIndex === index ? (
                    <IconButton onClick={() => handleConfirmEdit(index)}>
                      <FaCheck size={20} className="text-black dark:text-white" />
                    </IconButton>
                  ) : (
                    <IconButton onClick={(e) => handleStartEdit(index, content.videoSection, e)}>
                      <FaPen size={20} className="text-black dark:text-white" />
                    </IconButton>
                  )}
                </div>
              )}
              <br />

              <div className="relative w-full">
                <div className="absolute top-[-24px] right-0 flex items-center ">
                  <IconButton onClick={() => handleRemoveContent(index)}>
                    <MdDeleteOutline size={22} className="text-black dark:text-white" />
                  </IconButton>
                  <IconButton onClick={() => toggleCollapse(index)}>
                    {isConllapses[index] ? (
                      <FaAngleDown size={22} className="text-black dark:text-white" />
                    ) : (
                      <FaAngleUp size={22} className="text-black dark:text-white" />
                    )}
                  </IconButton>
                </div>
                {isConllapses[index] ? (
                  <div className="w-full">
                    <div className="w-full">
                      <label className="text-base text-black dark:text-white">Video Title</label>
                      <input
                        type="text"
                        value={content.title}
                        name="title"
                        onChange={(e) => handleChangeContentItem(index, e)}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
                      />
                    </div>
                    <br />
                    <div className="w-full">
                      <UploadVideoBox
                        url={content.videoUrl.url}
                        handleChangeUpload={(url, publicId, duration) => {
                          const newCourseContent = [...courseContent];
                          newCourseContent[index].videoUrl = {
                            url,
                            public_id: publicId
                          };
                          newCourseContent[index].videoLength = duration as number;
                          setCourseContent(newCourseContent);
                        }}
                        public_id={content.videoUrl.public_id}
                        isShow={isEdit ? true : false}
                      />
                      {/* <label className="text-base text-black dark:text-white">Video Url</label>
                      <input
                        type="text"
                        value={content.videoUrl}
                        name="videoUrl"
                        onChange={(e) => handleChangeContentItem(index, e)}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
                      /> */}
                    </div>
                    <br />
                    <div className="w-full">
                      <label className="text-base text-black dark:text-white">Video Description</label>
                      <textarea
                        cols={30}
                        rows={6}
                        value={content.description}
                        name="description"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
                        onChange={(e) => handleChangeContentItem(index, e)}
                      ></textarea>
                    </div>
                    <br />
                    <div>
                      {content.links.map((link: any, linkIndex) => (
                        <div key={linkIndex} className="w-full flex items-center gap-2">
                          <input
                            type="text"
                            name="title"
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
                            placeholder="Link Title"
                            value={link.title}
                            onChange={(e) => handleChangeContentItem(index, e, linkIndex)}
                          />
                          <input
                            type="text"
                            name="url"
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
                            placeholder="Link Url"
                            value={link.url}
                            onChange={(e) => handleChangeContentItem(index, e, linkIndex)}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <button
                        type="button"
                        className="flex outline-none items-center gap-2"
                        onClick={() => handleAddLink(index)}
                      >
                        <IoMdAddCircleOutline size={20} className="text-black dark:text-white" />
                        <span className="text-black dark:text-white">Add Link</span>
                      </button>
                      {content.links.length > 0 && (
                        <button
                          type="button"
                          className="flex outline-none items-center gap-2"
                          onClick={() => handleRemoveLink(index)}
                        >
                          <IoIosRemoveCircleOutline size={20} className="text-black dark:text-white" />
                          <span className="text-black dark:text-white">Remove Link</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full text-black dark:text-white text-base font-Poppins">
                    {(index + 1).toString() + '. ' + content.title}
                  </div>
                )}

                <br />
                {lastContentSections.includes(index) && (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="flex outline-none items-center gap-2 mt-8"
                      onClick={() => addNewContent(index)}
                    >
                      <IoMdAddCircleOutline size={20} className="text-black dark:text-white" />
                      <span className="text-black dark:text-white">Add New Content</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {!isEdit && (
          <div className="flex justify-start mt-8">
            <button type="button" className="flex outline-none items-center gap-2 " onClick={handleAddNewSection}>
              <IoMdAddCircleOutline size={20} className="text-black dark:text-white" />
              <span className="text-black dark:text-white">Add New Section</span>
            </button>
          </div>
        )}
      </form>

      {isEdit ? (
        <div className="w-full flex justify-between items-center mt-16">
          <button
            className="px-6 py-2 bg-blue-600 rounded-md text-white"
            onClick={() => handleConfirmEditSection && handleConfirmEditSection()}
          >
            Xác Nhận
          </button>
        </div>
      ) : (
        <div className="w-full flex justify-between items-center mt-16">
          <button className="px-6 py-2 bg-blue-600 rounded-md text-white" onClick={() => setActive && setActive(1)}>
            Back
          </button>
          <button className="px-6 py-2 bg-blue-600 rounded-md text-white" onClick={handleNext}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseContent;

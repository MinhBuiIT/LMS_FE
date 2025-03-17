import { TCourseInfo } from '@/src/@types/course';
import { useGetLayoutQuery } from '@/src/redux/api/layoutApi';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import UploadVideoBox from '../upload-video';

type TProps = {
  courseInfo: TCourseInfo;
  setCourseInfo: (courseInfo: TCourseInfo) => void;
  setActive?: (index: number) => void;
  isEdit?: boolean;
};

const CourseInfomation: React.FC<TProps> = ({ courseInfo, setCourseInfo, setActive, isEdit = false }) => {
  const [activeDrop, setActiveDrop] = React.useState(false);
  const [categories, setCategories] = React.useState<{ name: string; id: string }[]>([]);
  const { data } = useGetLayoutQuery({ type: 'category' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setCourseInfo({ ...courseInfo, [name]: value });
  };

  const handleChangeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value !== '' && isNaN(parseInt(value))) return;
    setCourseInfo({ ...courseInfo, [name]: value === '' ? 0 : parseInt(value) });
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      setCourseInfo({ ...courseInfo, [name]: reader.result as string });
    };
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setActiveDrop(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setActiveDrop(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setActiveDrop(false);
    if (!e.dataTransfer.files) return;
    const reader = new FileReader();
    reader.readAsDataURL(e.dataTransfer.files[0]);
    reader.onload = () => {
      setCourseInfo({ ...courseInfo, thumbnail: reader.result as string });
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const checkEmpty = Object.values(courseInfo).some((value) => value === '');
    if (checkEmpty) {
      toast.error('Please fill all the fields');
      return;
    }
    if (courseInfo.price === 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (setActive) setActive(1);
  };

  useEffect(() => {
    if (data?.data) {
      setCategories(data.data.categories.map((category: any) => ({ name: category.name, id: category._id })));
      setCourseInfo({ ...courseInfo, category: data.data.categories[0].name });
    }
  }, [data]);

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="w-full">
        <label className="text-base text-black dark:text-white">Course Name</label>
        <input
          type="text"
          value={courseInfo.name}
          name="name"
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
        />
      </div>
      <br />
      <div className="w-full">
        <label className="text-base text-black dark:text-white">Course Description</label>
        <textarea
          cols={30}
          rows={6}
          value={courseInfo.description}
          name="description"
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
          onChange={handleChange}
        ></textarea>
      </div>
      <br />
      <div className="w-full flex justify-between">
        <div className="w-[45%]">
          <label className="text-base text-black dark:text-white">Price</label>
          <input
            type="number"
            value={courseInfo.price}
            name="price"
            onChange={handleChangeNumber}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
          />
        </div>
        <div className="w-[45%]">
          <label className="text-base text-black dark:text-white">Estimated Price (Optional)</label>
          <input
            type="number"
            value={courseInfo.estimatedPrice}
            name="estimatedPrice"
            onChange={handleChangeNumber}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
          />
        </div>
      </div>
      <br />
      <div className="w-full flex justify-between">
        <div className="w-[45%]">
          <label className="text-base text-black dark:text-white">Course Level</label>
          <input
            type="text"
            value={courseInfo.level}
            name="level"
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
          />
        </div>
        <div className="w-[45%]">
          <label className="text-base text-black dark:text-white">Category</label>
          <select
            name="category"
            id="category"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
            value={courseInfo.category}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <option value={category.name} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* <div className="w-full flex justify-between">
        <div className="w-[45%]">
          <label className="text-base text-black dark:text-white">Course Level</label>
          <input
            type="text"
            value={courseInfo.level}
            name="level"
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
          />
        </div>
        <div className="w-[45%]">
          <label className="text-base text-black dark:text-white">Demo Url</label>
          <input
            type="text"
            value={courseInfo.demoUrl}
            name="demoUrl"
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
          />
        </div>
      </div> */}
      <br />
      <div className="w-full">
        <label className="text-base text-black dark:text-white">Course Tags</label>
        <input
          type="text"
          value={courseInfo.tags}
          name="tags"
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white"
        />
      </div>
      <br />
      <div className="w-full">
        <UploadVideoBox
          handleChangeUpload={(url: string, publicId: string) => {
            setCourseInfo({
              ...courseInfo,
              demoUrl: {
                url: url,
                public_id: publicId
              }
            });
          }}
          url={courseInfo.demoUrl.url}
          public_id={courseInfo.demoUrl.public_id}
        />
      </div>
      <br />
      <div className="w-full">
        <input
          type="file"
          name="thumbnail"
          id="file"
          accept=".jpg,.png,.jpeg"
          className="hidden"
          onChange={handleChangeFile}
        />
        <label
          className={`w-full h-[400px] border border-dashed rounded  p-4 flex items-center justify-center ${
            activeDrop ? 'border-blue-600' : 'border-gray-300 dark:border-gray-700'
          }`}
          htmlFor="file"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {courseInfo.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={courseInfo.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
          ) : (
            <div className="text-base text-black dark:text-white">
              Drag and drop your thumnail here or click to browse
            </div>
          )}
        </label>
      </div>
      <br />
      <br />

      {!isEdit && (
        <div className="w-full flex justify-end">
          <button className="px-6 py-2 bg-blue-600 rounded-md text-white" type="submit">
            Next
          </button>
        </div>
      )}

      <br />
      <br />
    </form>
  );
};

export default CourseInfomation;

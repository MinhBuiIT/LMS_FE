'use client';

import Loading from '@/src/components/loading';
import { useGetLayoutQuery, useUpdateLayoutMutation } from '@/src/redux/api/layoutApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdDeleteOutline } from 'react-icons/md';

const CategoryView = () => {
  const { data, isLoading, refetch } = useGetLayoutQuery({ type: 'category' });
  const [updateLayoutAction] = useUpdateLayoutMutation();
  const [categories, setCategories] = useState<{ name: string }[]>([]);

  const categoriesData = data?.data.categories;

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.map((category: any) => ({ name: category.name })));
    }
  }, [categoriesData]);
  const handleChange = (index: number, value: string) => {
    setCategories((pre) => {
      const newCategories = [...pre];
      newCategories[index] = { name: value };
      return newCategories;
    });
  };

  const handleCreateNewCategory = () => {
    setCategories((pre) => [...pre, { name: '' }]);
  };

  const handleDeleteCategory = (index: number) => {
    setCategories((pre) => {
      const newCategories = [...pre];
      newCategories.splice(index, 1);
      return newCategories;
    });
  };

  const isActiveSave =
    JSON.stringify(categories) !== JSON.stringify(categoriesData) &&
    !categories.some((category) => category.name === '');

  const handleSaveFaq = () => {
    const toastId = toast.loading('Đang cập nhật...');
    updateLayoutAction({
      data: {
        type: 'category',
        category: categories.map((category) => category.name)
      }
    })
      .unwrap()
      .then(() => {
        refetch();
        toast.success('Cập nhật thành công', { id: toastId });
      })
      .catch(() => {
        toast.error('Update Failed', { id: toastId });
      });
  };

  return (
    <div className="w-full h-full " style={{ paddingTop: '120px' }}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex items-center justify-center flex-col relative">
          <h3 className="text-black dark:text-white text-2xl font-bold mb-10">All Categories</h3>
          {categories.map((category, index) => (
            <div className="flex items-center justify-between mb-8 w-full 800px:max-w-[500px]" key={index}>
              <input
                type="text"
                placeholder="Category..."
                className="w-full border-none outline-none bg-transparent text-lg "
                value={category.name}
                onChange={(e) => {
                  handleChange(index, e.target.value);
                  e.target.focus();
                }}
              />
              <button onClick={() => handleDeleteCategory(index)}>
                <MdDeleteOutline size={20} className="text-black dark:text-white" />
              </button>
            </div>
          ))}
          <div className="flex justify-start mt-8">
            <button type="button" className="flex outline-none items-center gap-2 " onClick={handleCreateNewCategory}>
              <IoMdAddCircleOutline size={24} className="text-black dark:text-white" />
            </button>
          </div>
          <div className="absolute z-50" style={{ bottom: '-80px', right: '100px' }}>
            <button
              className={`relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group  hover:text-white dark:text-white focus:ring-4 focus:outline-none  ${
                isActiveSave
                  ? 'bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 focus:ring-blue-300 dark:focus:ring-blue-800'
                  : ''
              }`}
              disabled={!isActiveSave}
              onClick={handleSaveFaq}
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Save
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CategoryView;

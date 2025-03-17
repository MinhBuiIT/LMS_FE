'use client';
import Loading from '@/src/components/loading';
import { useGetLayoutQuery, useUpdateLayoutMutation } from '@/src/redux/api/layoutApi';
import { isBadRequestError, isUnauthorizedRequestError } from '@/src/utils/predicate-type';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdDeleteOutline } from 'react-icons/md';

const FaqView = () => {
  const [isDropDown, setIsDropDown] = useState<Boolean[] | null>(null);
  const [faqList, setFaqList] = useState<{ question: string; answer: string }[]>([]);
  const { data, isLoading, refetch } = useGetLayoutQuery({ type: 'faq' });
  const [updateFaqAction] = useUpdateLayoutMutation();
  const faqs = data?.data.faqs;

  const isActiveSave =
    !faqList.some((faq) => faq.question === '' || faq.answer === '') &&
    JSON.stringify(faqs) !== JSON.stringify(faqList);
  useEffect(() => {
    if (faqs) {
      setFaqList(faqs as any);
      setIsDropDown(Array(faqs.length).fill(false));
    }
  }, [faqs]);

  const handleDropDown = (index: number) => {
    setIsDropDown((prev) => {
      if (!prev) return [];
      const newDropDown = [...prev];
      newDropDown[index] = !newDropDown[index];
      return newDropDown;
    });
  };

  const handleChange = (index: number, key: 'question' | 'answer', value: string) => {
    const newFaqList = [...faqList];
    newFaqList[index] = { ...newFaqList[index], [key]: value };
    setFaqList(newFaqList);
  };

  const handleCreateNewFaq = () => {
    const newFaqList = [...faqList];
    newFaqList.push({ question: '', answer: '' });
    setFaqList(newFaqList);
  };

  const handleDeleteFaq = (index: number) => {
    const newFaqList = [...faqList];
    newFaqList.splice(index, 1);
    setFaqList(newFaqList);
  };

  const handleSaveFaq = () => {
    console.log('Click save');

    const toastId = toast.loading('Đang cập nhật...');
    updateFaqAction({
      data: {
        type: 'faq',
        faq: faqList
      }
    })
      .unwrap()
      .then(() => {
        toast.success('Cập nhật thành công', { id: toastId });
        refetch();
      })
      .catch((err) => {
        if (isBadRequestError(err) || isUnauthorizedRequestError(err)) {
          toast.error(err.data.message, { id: toastId });
        } else {
          toast.error('Update Failed', { id: toastId });
        }
      });
  };

  return (
    <div className="w-full h-full " style={{ paddingTop: '120px' }}>
      {!isLoading ? (
        <div style={{ paddingLeft: '100px', paddingRight: '150px' }} className="relative">
          {faqList.length > 0 &&
            faqList.map((faq: { question: string; answer: string }, index) => (
              <div className="mt-10 pb-8 border-b border-gray-200 dark:border-gray-700 w-full" key={index}>
                <div
                  className="flex items-center justify-between text-black dark:text-white font-Poppins text-base"
                  onClick={() => handleDropDown(index)}
                >
                  <input
                    type="text"
                    placeholder="Question..."
                    className="w-full border-none outline-none bg-transparent"
                    value={faq.question}
                    onChange={(e) => handleChange(index, 'question', e.target.value)}
                  />
                  <FaPlus size={16} className="text-black dark:text-white" />
                </div>
                {isDropDown !== null && isDropDown[index] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isDropDown ? 'auto' : 0, opacity: isDropDown ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden mt-8"
                  >
                    <textarea
                      className="w-full border-none outline-none bg-transparent h-auto"
                      value={faq.answer}
                      placeholder="Answer..."
                      rows={2}
                      onChange={(e) => handleChange(index, 'answer', e.target.value)}
                    />

                    <button className="mt-4" onClick={() => handleDeleteFaq(index)}>
                      <MdDeleteOutline size={16} className="text-black dark:text-white" />
                    </button>
                  </motion.div>
                )}
              </div>
            ))}
          <div className="flex justify-start mt-8">
            <button type="button" className="flex outline-none items-center gap-2 " onClick={handleCreateNewFaq}>
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
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default FaqView;

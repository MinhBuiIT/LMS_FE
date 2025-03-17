import { FC } from 'react';
import { IoMdClose } from 'react-icons/io';

type TProps = {
  children: React.ReactNode;
  handleClose: () => void;
  minW?: number;
};

const Modal: FC<TProps> = ({ children, handleClose, minW = 400 }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white p-8 rounded-lg shadow-md  max-w-[80vw] max-h-[70vh] min-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500`}
        style={{ minWidth: minW + 'px' }}
      >
        <div className="flex justify-end sticky top-4 right-4">
          <button
            onClick={handleClose}
            className="w-[40px] h-[40px] flex items-center justify-center bg-gray-400/70 rounded-[50%] hover:bg-gray-400/90 focus:outline-none"
          >
            <IoMdClose size={20} className="text-black " />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;

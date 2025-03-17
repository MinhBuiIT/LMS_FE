'use client';
import { useTheme } from 'next-themes';
import { CiLight } from 'react-icons/ci';
import { MdOutlineDarkMode } from 'react-icons/md';
import Notification from '../notification';

const Header = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="absolute top-[40px] right-[80px] flex items-center gap-[15px]">
      <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
        {resolvedTheme === 'dark' ? (
          <CiLight className="dark:text-white text-black" size={25} />
        ) : (
          <MdOutlineDarkMode className="dark:text-white text-black" size={25} />
        )}
      </button>
      <Notification />
    </div>
  );
};

export default Header;

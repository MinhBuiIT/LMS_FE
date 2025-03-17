'use client';
/*----Next----*/
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/*----i18next---*/
import { useTranslation } from 'react-i18next';

type NavItemsProps = {
  activeItem: number;
  setActiveItem: (index: number) => void;
  isMobile: boolean;
};

const NavItems: React.FC<NavItemsProps> = ({ activeItem, setActiveItem, isMobile }) => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const navItems = [
    {
      title: t('Home'),
      url: '/'
    },
    {
      title: t('Courses'),
      url: '/courses'
    }
  ];

  return (
    <>
      {!isMobile ? (
        <nav className={`font-Poppins items-center 800px:space-x-12 space-x-8  800px:flex hidden`}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className={`cursor-pointer ${pathname === item.url ? 'text-[#37b668]' : 'text-black dark:text-white'}`}
              onClick={() => setActiveItem(index)}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : (
        <nav className={`font-Poppins items-center space-y-8  800px:hidden flex flex-col`}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className={`cursor-pointer ${activeItem === index ? 'text-[#37b668]' : 'text-black dark:text-white'}`}
              onClick={() => setActiveItem(index)}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
};

export default NavItems;

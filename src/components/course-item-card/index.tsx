import { TCourseFull } from '@/src/@types/course';
import { TFunction } from 'i18next';
import Image from 'next/image';
import Link from 'next/link';
import Rating from '../rating';

type CourseItemCardProps = {
  courseItem: TCourseFull;
  isEnroll: boolean;
  t: TFunction<'translation', undefined>;
};

const CourseItemCard: React.FC<CourseItemCardProps> = ({ courseItem, isEnroll, t }) => {
  const encodedCourseId = Buffer.from(courseItem._id).toString('base64');
  return (
    <Link
      href={isEnroll ? `/enroll-course/${encodedCourseId}` : `/course/${encodedCourseId}`}
      className="flex flex-col relative overflow-hidden text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium transition-transform-background motion-reduce:transition-none w-full md:min-h-[340px] h-min rounded-lg p-3 bg-opacity-[.7] bg-[#ffffff25] dark:bg-slate-500 dark:bg-opacity-[.2] shadow-lg"
    >
      <Image
        src={courseItem.thumbnail.url}
        alt={''}
        width={400}
        height={400}
        className="rounded-lg  object-cover"
        style={{ height: '150px' }}
      />
      <h1 className="font-Poppins text-[16px] mt-[16px] text-black dark:text-white">{courseItem.name}</h1>
      <div className="flex justify-between items-center  mt-[14px]">
        <Rating rating={Math.round(courseItem.rating * 10) / 10} />
        <h5 className="text-[16px] text-black dark:text-white">
          {courseItem.purchased} {t('Student')}
        </h5>
      </div>

      <div className="flex justify-between items-center text-black dark:text-white mt-[14px]">
        <h5>{courseItem.estimatedPrice}$</h5>
        <h5 className="  line-through">{courseItem.price}$</h5>
      </div>
    </Link>
  );
};

export default CourseItemCard;

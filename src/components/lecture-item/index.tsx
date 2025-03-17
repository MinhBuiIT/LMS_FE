import { TLecture } from '@/src/@types/course';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FC } from 'react';

type TProp = {
  lecture: TLecture & { id: string };
};
const LectureItem: FC<TProp> = ({ lecture }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lecture.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };
  return (
    <div
      className="flex items-center gap-3 mt-2 bg-white dark:bg-gray-900 p-4 rounded-lg  text-gray-700 dark:text-white"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="text-lg">{lecture.title}</div>
    </div>
  );
};

export default LectureItem;

import { TLecture } from '@/src/@types/course';
import { useChangeLectureOrderApiMutation } from '@/src/redux/api/courseApi';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useEffect } from 'react';
import LectureItem from '../lecture-item';

const LectureList: React.FC<{
    courseId: string;
    sectionId: string;
    lectures: (TLecture & { id: string })[];
    dragIdItem: {
      active: string;
      over: string;
    };
    setDragIdItem: React.Dispatch<React.SetStateAction<{ active: string; over: string }>>;
    handleRefresh: () => void;
  }> = ({ courseId, sectionId, lectures, dragIdItem, setDragIdItem, handleRefresh }) => {
    const [sortedLectures, setSortedLectures] = React.useState<(TLecture & { id: string })[]>(lectures);
    const [changeLectureOrderAction] = useChangeLectureOrderApiMutation();
  
    useEffect(() => {
      if (dragIdItem.active && dragIdItem.over) {
        const originIndex = sortedLectures.findIndex((lecture) => lecture.id === dragIdItem.active);
        const targetIndex = sortedLectures.findIndex((lecture) => lecture.id === dragIdItem.over);
  
        const originLecture = sortedLectures[originIndex];
        const targetLecture = sortedLectures[targetIndex];
  
        setSortedLectures((prev) => {
          return arrayMove(prev, originIndex, targetIndex);
        });
        setDragIdItem({ active: '', over: '' });
        changeLectureOrderAction({
          data: {
            lectureOriginal: { id: originLecture._id as string, order: originLecture.videoOrder },
            lectureTarget: { id: targetLecture._id as string, order: targetLecture.videoOrder },
            courseId,
            sectionId
          }
        })
          .unwrap()
          .then(() => {
            handleRefresh();
          });
      }
    }, [dragIdItem.active, dragIdItem.over]);
    return (
      <SortableContext items={lectures} strategy={verticalListSortingStrategy}>
        {sortedLectures.map((lecture, index) => (
          <LectureItem lecture={lecture} key={lecture.id} />
        ))}
      </SortableContext>
    );
  };

export default LectureList;
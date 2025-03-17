import { TCourseContent } from '../@types/course';

export const checkFillAllFields = (content: TCourseContent) => {
  const checkStringEmpty = Object.values(content).some((value) => {
    //check value in links field
    if (Array.isArray(value)) {
      if (value.length === 0) return false;
      return value[value.length - 1].title === '' || value[value.length - 1].url === '';
    }
    return value === '';
  });
  return checkStringEmpty;
};

export const handleVideoLength = (videoDuration: number) => {
  const minutes = videoDuration / 60;
  if (minutes < 1) {
    return {
      value: videoDuration.toFixed(2),
      unit: 's'
    };
  } else if (minutes < 60) {
    const numMinutes = Math.floor(minutes);
    const numSeconds = Math.floor((minutes - numMinutes) * 60);

    return {
      value: `${numMinutes}:${numSeconds}`,
      unit: 'minutes'
    };
  } else {
    const numHours = Math.floor(minutes / 60);
    const numMinutes = Math.floor(minutes - numHours * 60);
    return {
      value: `${numHours}:${numMinutes}`,
      unit: 'hours'
    };
  }
};

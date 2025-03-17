'use client';
import CourseCard from '@/src/components/admin/course-card';
import Loading from '@/src/components/loading';
import { useGetAllCourseAdminApiQuery } from '@/src/redux/api/courseApi';
import { Grid2 } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useTheme } from 'next-themes';
import { useState } from 'react';

const LIMIT = 3;
const LiveCourseView = () => {
  const { resolvedTheme } = useTheme();
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetAllCourseAdminApiQuery({
    page,
    limit: LIMIT
  });

  const dataCourse = data?.data;
  const courses = dataCourse?.courses;

  const handleRefetchCourses = () => {
    refetch();
  };

  return (
    <>
      {isLoading && !courses ? (
        <Loading />
      ) : (
        <div className="w-full h-full  " style={{ paddingTop: '120px', paddingLeft: '100px', paddingRight: '100px' }}>
          <Grid2 spacing={2} container className="w-full">
            {courses?.map((course) => {
              return (
                <Grid2 size={{ xs: 6, md: 4 }} key={course._id}>
                  <CourseCard course={course} handleRefetchCourses={handleRefetchCourses} />
                </Grid2>
              );
            })}
          </Grid2>

          {courses && (
            <Stack
              spacing={2}
              sx={{
                justifyContent: 'center',
                marginTop: '20px',
                width: '100%',
                '& .MuiPagination-root': {
                  display: 'flex',
                  justifyContent: 'center'
                }
              }}
            >
              <Pagination
                count={Math.ceil(dataCourse?.total / LIMIT)}
                onChange={(_, page) => setPage(page)}
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: resolvedTheme === 'dark' ? '#fff' : '#000',
                    backgroundColor: resolvedTheme === 'dark' ? '#2d2d2d' : '#f5f5f5',
                    '&.Mui-selected': {
                      backgroundColor: '#9333ea',
                      color: '#fff'
                    }
                  }
                }}
              />
            </Stack>
          )}
        </div>
      )}
    </>
  );
};

export default LiveCourseView;

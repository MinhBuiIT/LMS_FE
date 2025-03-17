'use client';

import { useGetAllOrderApiQuery } from '@/src/redux/api/orderApi';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTheme } from 'next-themes';
import { FC } from 'react';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  {
    field: 'name',
    headerName: 'Name',
    flex: 0.5
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1
  },
  {
    field: 'courseName',
    headerName: 'Course',
    flex: 1
  },
  {
    field: 'price',
    headerName: 'Price',
    flex: 0.5,
    renderCell: (params) => {
      return <div className="w-full text-center cursor-pointer">{params.value} $</div>;
    }
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 0.5,
    renderCell: (params) => {
      return <span>{new Date(params.value).toLocaleString('vi-VN')}</span>;
    }
  }
];
type TProps = {
  height: string;
  isDashboard?: boolean;
};
const InvoiceCom: FC<TProps> = ({ height, isDashboard = false }) => {
  const { resolvedTheme } = useTheme();
  const { data } = useGetAllOrderApiQuery();

  const rows =
    data &&
    data.data.map((order: any) => {
      if (!isDashboard) {
        return {
          id: order._id,
          courseName: order.course.name,
          price: order.price,
          name: order.user.name,
          email: order.user.email,
          createdAt: order.createdAt
        };
      } else {
        return {
          id: order._id,
          price: order.price,
          email: order.user.email,
          createdAt: order.createdAt
        };
      }
    });
  return (
    <Box
      height={height}
      width={'100%'}
      sx={{
        '& .MuiDataGrid-root': {
          border: 'none',
          outline: 'none'
        },
        '& .css-pgjvzy-MuiSvgIcon-root-MuiSelect-icon': {
          color: resolvedTheme === 'dark' ? '#fff' : '#000'
        },
        '& .MuiDataGrid-sortIcon': {
          color: resolvedTheme === 'dark' ? '#fff' : '#000'
        },
        '& .MuiDataGrid-row': {
          color: resolvedTheme === 'dark' ? '#fff' : '#000',
          borderBottom: resolvedTheme === 'dark' ? '1px solid #ffffff30 !important' : '1px solid #ccc !important'
        },
        '& .MuiTablePagination-root': {
          color: resolvedTheme === 'dark' ? '#fff' : '#000'
        },
        '& .MuiDataGrid-cell': {
          borderBottom: 'none'
        },
        '& .name-column--cell': {
          color: resolvedTheme === 'dark' ? '#fff' : '#000'
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: resolvedTheme === 'dark' ? '#3e4396 !important' : '#A4A9FC !important',
          borderBottom: 'none',
          color: resolvedTheme === 'dark' ? '#fff' : '#000'
        },
        '& .css-1r7svyj-MuiDataGrid-root .MuiDataGrid-container--top [role=row]': {
          background: 'none !important'
        },
        '& .MuiDataGrid-virtualScroller': {
          backgroundColor: resolvedTheme === 'dark' ? '#1F2A40' : '#F2F0F0'
        },
        '& .MuiDataGrid-footerContainer': {
          color: resolvedTheme === 'dark' ? '#fff' : '#000',
          borderTop: 'none',
          backgroundColor: resolvedTheme === 'dark' ? '#3e4396' : '#A4A9FC'
        },
        '& .MuiCheckbox-root': {
          color: resolvedTheme === 'dark' ? '#b7ebde !important' : '#000 !important'
        },
        '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
          color: '#fff !important'
        }
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        columnVisibilityModel={{
          courseName: !isDashboard,
          name: !isDashboard,
          createdAt: !isDashboard
        }}
      />
    </Box>
  );
};
export default InvoiceCom;

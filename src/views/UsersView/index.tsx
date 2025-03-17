'use client';
import { useChangeDisableUserApiMutation, useGetAllUsersByAdminApiQuery } from '@/src/redux/api/userApi';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTheme } from 'next-themes';
import React from 'react';
import { format } from 'timeago.js';

type TProps = {};

const columns: GridColDef[] = [
  { field: '_id', headerName: 'ID', flex: 0.5 },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1
  },
  {
    field: 'role',
    headerName: 'Role',
    flex: 0.5
  },
  {
    field: 'courses',
    headerName: 'Purchased Courses',
    flex: 0.5,
    renderCell: (params) => {
      return <span>{(params.value as string[]).length}</span>;
    }
  },
  {
    field: 'createdAt',
    headerName: 'Joined At',
    flex: 0.5,
    renderCell: (params) => {
      return <span>{format(new Date(params.value))}</span>;
    }
  },
  {
    field: 'disabled',
    headerName: 'Status',
    flex: 0.5,
    renderCell: (params) => {
      return <div className="w-full text-center cursor-pointer">{params.value ? 'Disabled' : 'Active'}</div>;
    }
  }
];

const UsersView: React.FC<TProps> = () => {
  const { resolvedTheme } = useTheme();
  const { data, refetch } = useGetAllUsersByAdminApiQuery();
  const [changeStatusUserAction, changeStatusUserResult] = useChangeDisableUserApiMutation();

  const rows = data && data.data.map((user) => ({ ...user, id: user._id }));
  const handleChangeStatusUser = (params: any) => {
    if (params.field === 'disabled') {
      changeStatusUserAction({ userId: params.id })
        .unwrap()
        .then(() => {
          refetch();
        });
    }
  };
  return (
    <div className="w-full h-full " style={{ paddingTop: '120px', paddingLeft: '50px', paddingRight: '50px' }}>
      <Box
        height={'80vh'}
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
        <DataGrid rows={rows} columns={columns} onCellClick={handleChangeStatusUser} />
      </Box>
    </div>
  );
};

export default UsersView;

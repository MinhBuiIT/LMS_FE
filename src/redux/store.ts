import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import { baseAuthApi } from './api/baseAuthApi';
import { authSlice } from './slice/authSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [baseAuthApi.reducerPath]: baseAuthApi.reducer,
    auth: authSlice.reducer
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(baseApi.middleware).concat(baseAuthApi.middleware);
  }
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);

const initialFetch = async () => {
  // if (typeof window !== 'undefined') {
  //   const path = window.location.pathname;
  //   if (['/login', '/register'].includes(path)) return;
  // }
  await store.dispatch(baseAuthApi.endpoints.getMeApi.initiate(undefined, { forceRefetch: true }));
};
initialFetch();

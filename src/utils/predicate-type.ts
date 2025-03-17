import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type ErrorObject = {
  [key: string]: string | number;
};

type ErrorType = {
  status: number;
  data: ErrorObject;
};

export const isFetchBaseError = (
  error: FetchBaseQueryError | SerializedError | undefined
): error is FetchBaseQueryError => {
  return typeof error === 'object' && 'status' in error;
};

export const isBadRequestError = (error: FetchBaseQueryError | SerializedError | undefined): error is ErrorType => {
  return isFetchBaseError(error) && error.status === 400 && typeof error.data === 'object';
};
export const isNotFoundRequestError = (
  error: FetchBaseQueryError | SerializedError | undefined
): error is ErrorType => {
  return isFetchBaseError(error) && error.status === 404 && typeof error.data === 'object';
};

export const isUnauthorizedRequestError = (
  error: FetchBaseQueryError | SerializedError | undefined
): error is ErrorType => {
  return isFetchBaseError(error) && error.status === 401 && typeof error.data === 'object';
};

export const isUnauthorizedResponseError = (
  error: FetchBaseQueryError | SerializedError | undefined
): error is ErrorType => {
  return (
    isFetchBaseError(error) &&
    error.status === 401 &&
    typeof error.data === 'object' &&
    error.data != null &&
    'statusCode' in error.data &&
    error.data.statusCode === 401 &&
    'message' in error.data
  );
};

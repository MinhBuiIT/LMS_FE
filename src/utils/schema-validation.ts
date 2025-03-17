import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email('Email is invalid').required('Email is required'),
  password: yup.string().required('Password is required')
});

export const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  password: yup.string().required()
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email('Email is invalid').required('Email is required')
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup.string().required('New password is required')
});

export const profileUserSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Email is invalid').required('Email is required')
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string(),
  newPassword: yup.string(),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match')
});

export type TLoginSchema = yup.InferType<typeof loginSchema>;
export type TRegisterSchema = yup.InferType<typeof registerSchema>;
export type TForgotPasswordSchema = yup.InferType<typeof forgotPasswordSchema>;
export type TResetPasswordSchema = yup.InferType<typeof resetPasswordSchema>;
export type TProfileUserSchema = yup.InferType<typeof profileUserSchema>;
export type TChangePasswordSchema = yup.InferType<typeof changePasswordSchema>;

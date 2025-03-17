'use client';
import { useCreateOrderApiMutation } from '@/src/redux/api/orderApi';
import { updateUserInfo } from '@/src/redux/slice/authSlice';
import { RootState } from '@/src/redux/store';
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

type TProps = {
  data: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  courseId: string;
  socket: any;
};
const CheckoutForm: React.FC<TProps> = ({ data, setOpen, courseId, socket }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [createOrderAction, createOrderResult] = useCreateOrderApiMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    });
    if (error) {
      setMessage(error.message as string);
      setIsLoading(false);
    } else {
      createOrderAction({
        courseId: data._id,
        paymentInfo: paymentIntent,
        price: data.estimatedPrice || data.price
      })
        .unwrap()
        .then(() => {
          if (user) {
            setIsLoading(false);
            setOpen(false);
            dispatch(updateUserInfo({ ...user, courses: [...user.courses, { courseId: data._id }] }));

            socket.emit('notification');
            router.push('/enroll-course/' + courseId);
          }
        })
        .catch((err) => {
          setMessage(err.data.message);
          setIsLoading(false);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <button
        type="submit"
        disabled={!stripe || isLoading || !elements}
        className="w-full bg-blue-500 text-white p-2 rounded-md mt-2"
      >
        {isLoading ? 'Paying...' : 'Pay'}
      </button>

      {message && <div className="text-red-500 font-Poppins mt-2">{message}</div>}
    </form>
  );
};

export default CheckoutForm;

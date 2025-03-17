export type TReview = {
  comment: string;
  course: string;
  createdAt: string;
  rating: number;
  replies: Object;
  updatedAt: string;
  _id: string;
  user: {
    avatar: {
      url: string;
      public_id: string;
    };
    name: string;
    _id: string;
  };
};

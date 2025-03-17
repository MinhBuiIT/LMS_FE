export type TLayout = {
  banner: {
    title: string;
    subTitle: string;
    image: {
      public_id: string;
      url: string;
      _id: string;
    };
  };
  categories: { name: string; _id: string }[];
  faqs: Object[];
  type: string;
  _id: string;
  createdAt: string;
};

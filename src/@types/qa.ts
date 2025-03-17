export type TQAItem = {
  createdAt: string;
  qaLevel: number;
  qaText: string;
  qaUser: {
    _id: string;
    name: string;
    avatar: {
      url: string;
      public_id: string;
    };
    role: string;
  };
  _id: string;
  qaChildCount?: number;
};

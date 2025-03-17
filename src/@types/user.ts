export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  role: string;
  courses: {
    _id: string;
    courseId: string;
  }[];
}

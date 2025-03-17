export type TCourseInfo = {
  name: string;
  description: string;
  price: number;
  estimatedPrice: number;
  tags: string;
  level: string;
  demoUrl: {
    url: string;
    public_id: string;
  };
  thumbnail: string;
  category: string;
};

export type TCourseContent = {
  videoUrl: {
    url: string;
    public_id: string;
  };
  title: string;
  description: string;
  videoSection: string;
  videoLength: number; // in minutes
  videoOrder?: number;
  links: {
    title: string;
    url: string;
  }[];
};

export type TLecture = {
  _id?: string;
  title: string;
  description: string;
  videoUrl: {
    url: string;
    public_id: string;
  };
  videoLength: number;
  videoOrder: number;
  links: {
    _id?: string;
    title: string;
    url: string;
  }[];
};
export type TCourseBody = {
  courseInfo: {
    name: string;
    description: string;
    price: number;
    thumbnail: string;
    tags: string[];
    estimatedPrice: number;
    level: string;
    demoUrl: {
      url: string;
      public_id: string;
    };
    benifits: { title: string }[];
    prerequisites: { title: string }[];
  };

  courseData: TCourseData;
};

export type TCourseData = {
  title: string;
  order: number;
  lectures: TLecture[];
};

export type TCourseFull = {
  benifits: { title: string; _id: string }[];
  createdAt: string;
  demoUrl: {
    url: string;
    public_id: string;
  };
  description: string;
  estimatedPrice: number;
  isActive: boolean;
  level: string;
  name: string;
  prerequisites: { title: string; _id: string }[];
  price: number;
  purchased: number;
  tags: string[];
  thumbnail: { url: string; public_id: string };
  rating: number;
  category: string;
  _id: string;
};

export type TCourseDetail = TCourseFull & {
  sections: {
    _id: string;
    title: string;
    order: number;
    lectures: TLecture[];
  }[];
};

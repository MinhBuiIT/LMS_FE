import Header from '@/src/components/header';
import AuthWrapper from '@/src/hoc/AuthWrapper';
import ProfileView from '@/src/views/ProfileView';
import { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

type TProps = {};

const ProfilePage: NextPage<TProps> = (props) => {
  return (
    <AuthWrapper authGuard={true} guestGuard={false}>
      <Header />
      <ProfileView />
    </AuthWrapper>
  );
};

export default ProfilePage;

import CoursesSection from '@/src/components/courses-section';
import FAQ from '@/src/components/faq';
import AuthWrapper from '@/src/hoc/AuthWrapper';
import { Metadata } from 'next';
import Banner from '../../components/banner';
import Header from '../../components/header';
import Hero from '../../components/hero';

export const metadata: Metadata = {
  title: 'Elearning',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

export default function Home() {
  return (
    <AuthWrapper authGuard={false} guestGuard={false}>
      <Header />
      <Hero />
      <Banner />
      <CoursesSection />
      <FAQ />
    </AuthWrapper>
  );
}

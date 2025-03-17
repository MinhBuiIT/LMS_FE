import InvoiceView from '@/src/views/Invoice';
import { Metadata, NextPage } from 'next';

type TProps = {};

export const metadata: Metadata = {
  title: 'Invoice',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const InvoicePage: NextPage<TProps> = () => {
  return (
    <>
      <InvoiceView />
    </>
  );
};

export default InvoicePage;

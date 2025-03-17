import InvoiceCom from '@/src/components/admin/invoice';

const InvoiceView = () => {
  return (
    <div className="w-full h-full " style={{ paddingTop: '120px', paddingLeft: '50px', paddingRight: '50px' }}>
      <InvoiceCom height="80vh" />
    </div>
  );
};
export default InvoiceView;

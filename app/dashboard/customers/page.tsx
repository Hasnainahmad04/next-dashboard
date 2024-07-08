import { fetchFilteredCustomers } from '@/lib/data';
import CustomersTable from '@/ui/customers/table';
import { useParams, useRouter } from 'next/navigation';

const Page = async ({ searchParams }: { searchParams: { query?: string } }) => {
  const customers = await fetchFilteredCustomers(searchParams?.query || '');
  return <CustomersTable customers={customers} />;
};

export default Page;

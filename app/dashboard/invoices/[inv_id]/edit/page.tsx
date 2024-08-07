import Form from '@/ui/invoices/edit-form';
import Breadcrumbs from '@/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/lib/data';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    inv_id: string;
  };
}

export default async function Page({ params: { inv_id } }: Props) {
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(inv_id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${inv_id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}

'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export const createInvoice = async (formData: FormData) => {
  const rawData = CreateInvoice.parse(Object.fromEntries(formData));
  const amountInCents = rawData.amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`INSERT INTO invoices(amount, date, status, customer_id) 
      VALUES (${amountInCents}, ${date}, ${rawData.status}, ${rawData.customerId})`;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
};

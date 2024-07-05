'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export const createInvoice = async (_state: State, formData: FormData) => {
  const validatedFields = CreateInvoice.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { amount, customerId, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`INSERT INTO invoices(amount, date, status, customer_id) 
        VALUES (${amountInCents}, ${date}, ${status}, ${customerId})`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  } finally {
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }
};

const updateInvoiceSchema = FormSchema.omit({ id: true, date: true });

export const updateInvoice = async (id: string, formData: FormData) => {
  const { amount, status, customerId } = updateInvoiceSchema.parse(
    Object.fromEntries(formData),
  );
  const amountInCents = amount * 100;

  try {
    await sql`UPDATE invoices 
         SET customer_id = ${customerId}, 
             amount=${amountInCents}, 
             status=${status}
             WHERE customer_id = ${id}`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }
  revalidatePath('/dashboard/invoices');
};

export const deleteInvoice = async (id: string) => {
  try {
    await sql`DELETE FROM invoices
              WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

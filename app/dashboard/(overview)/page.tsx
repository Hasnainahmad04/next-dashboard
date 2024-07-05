import { lusitana } from '@/styles/fonts';
import CardWrapper from '@/ui/dashboard/cards';
import RevenueChart from '@/ui/dashboard/revenue-chart';
import LatestInvoices from '@/ui/dashboard/latest-invoices';
import { Suspense } from 'react';
import {
  CardSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from '@/ui/skeletons';

const Page = async () => {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <StatsCards />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
};

const StatsCards = () => {
  const Skeleton = () => (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<Skeleton />}>
        <CardWrapper />
      </Suspense>
    </div>
  );
};

export default Page;

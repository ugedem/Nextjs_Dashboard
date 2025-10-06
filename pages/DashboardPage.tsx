import React, { useEffect, useState, Suspense } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ClockIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  CheckIcon,
} from '../components/Icons';
import {
  fetchCardData,
  fetchLatestInvoices,
  fetchRevenue,
} from '../services/data';
import type { CardData, Revenue, LatestInvoice } from '../types';
import { formatCurrency, formatDateToLocal, generateYAxis } from '../services/utils/utils';
import {
  CardsSkeleton,
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
} from '../components/Skeletons';

const iconMap = {
  collected: CheckIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: DocumentDuplicateIcon,
};

// --- Sub-components defined in the same file for locality ---

const Card: React.FC<{
  title: string;
  value: string | number;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}> = ({ title, value, type }) => {
  const Icon = iconMap[type];
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl">
        {value}
      </p>
    </div>
  );
};

const CardWrapper: React.FC = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchCardData().then(setData);
    }, []);

    if (!data) return <CardsSkeleton />;

    const {
        numberOfCustomers,
        numberOfInvoices,
        totalPaidInvoices,
        totalPendingInvoices,
    } = data;

    return (
        <>
            <Card title="Collected" value={totalPaidInvoices} type="collected" />
            <Card title="Pending" value={totalPendingInvoices} type="pending" />
            <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
            <Card title="Total Customers" value={numberOfCustomers} type="customers" />
        </>
    );
};


const RevenueChart: React.FC = () => {
  const [revenue, setRevenue] = useState<Revenue[]>([]);

  useEffect(() => {
    fetchRevenue().then(setRevenue);
  }, []);

  if (revenue.length === 0) {
    return <RevenueChartSkeleton />;
  }
  
  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  return (
    <div className="w-full md:col-span-4">
      <h2 className="mb-4 text-xl md:text-2xl">Recent Revenue</h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-4 h-[350px]">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={revenue} margin={{top: 5, right: 0, left: -25, bottom: 5}}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}K`} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const LatestInvoices: React.FC = () => {
    const [invoices, setInvoices] = useState<LatestInvoice[]>([]);

    useEffect(() => {
        fetchLatestInvoices().then(setInvoices);
    }, []);

    if (invoices.length === 0) {
        return <LatestInvoicesSkeleton />;
    }

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className="mb-4 text-xl md:text-2xl">Latest Invoices</h2>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                <div className="bg-white px-6">
                    {invoices.map((invoice, i) => (
                        <div key={invoice.id} className={`flex flex-row items-center justify-between py-4 ${i !== 0 ? 'border-t' : ''}`}>
                            <div className="flex items-center">
                                <img src={invoice.image_url} alt={`${invoice.name}'s profile picture`} className="mr-4 rounded-full" width={32} height={32}/>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold md:text-base">{invoice.name}</p>
                                    <p className="hidden text-sm text-gray-500 sm:block">{invoice.email}</p>
                                </div>
                            </div>
                            <p className="truncate text-sm font-medium md:text-base">{invoice.amount}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- Main Dashboard Page Component ---

const DashboardPage: React.FC = () => {
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
         <Suspense fallback={<CardsSkeleton />}>
            <CardWrapper />
        </Suspense>
      </div>
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

export default DashboardPage;
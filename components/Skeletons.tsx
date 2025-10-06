
import React from 'react';

const Shimmer: React.FC = () => (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-100/60 to-transparent"></div>
);

export const CardSkeleton: React.FC = () => (
  <div className="relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm">
    <Shimmer />
    <div className="flex p-4">
      <div className="h-5 w-5 rounded-md bg-gray-200" />
      <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
    </div>
    <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
      <div className="h-7 w-20 rounded-md bg-gray-200" />
    </div>
  </div>
);

export const CardsSkeleton: React.FC = () => (
  <>
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </>
);

export const RevenueChartSkeleton: React.FC = () => (
  <div className="relative w-full overflow-hidden md:col-span-4">
    <Shimmer />
    <div className="rounded-xl bg-gray-100 p-4">
      <div className="mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-4" />
      <div className="flex items-center pb-2 pt-6">
        <div className="h-5 w-5 rounded-full bg-gray-200" />
        <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  </div>
);

export const LatestInvoicesSkeleton: React.FC = () => (
  <div className="relative flex w-full flex-col overflow-hidden md:col-span-4">
    <Shimmer />
    <h2 className="mb-4 text-xl md:text-2xl">Latest Invoices</h2>
    <div className="flex grow flex-col justify-between rounded-xl bg-gray-100 p-4">
      <div className="bg-white px-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-row items-center justify-between border-b py-4">
            <div className="flex items-center">
              <div className="mr-4 h-8 w-8 rounded-full bg-gray-200" />
              <div className="min-w-0">
                <div className="h-5 w-40 rounded-md bg-gray-200" />
                <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
              </div>
            </div>
            <div className="h-5 w-12 rounded-md bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
    <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-100"></div>
        <div className="h-6 w-24 rounded bg-gray-100"></div>
      </div>
    </td>
    <td className="whitespace-nowrap px-3 py-3">
      <div className="h-6 w-32 rounded bg-gray-100"></div>
    </td>
    <td className="whitespace-nowrap px-3 py-3">
      <div className="h-6 w-16 rounded bg-gray-100"></div>
    </td>
    <td className="whitespace-nowrap px-3 py-3">
      <div className="h-6 w-16 rounded bg-gray-100"></div>
    </td>
    <td className="whitespace-nowrap px-3 py-3">
      <div className="h-6 w-16 rounded bg-gray-100"></div>
    </td>
    <td className="whitespace-nowrap py-3 pl-6 pr-3">
      <div className="flex justify-end gap-3">
        <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
        <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
      </div>
    </td>
  </tr>
);

export const InvoicesTableSkeleton: React.FC = () => (
  <div className="mt-6 flow-root">
    <div className="inline-block min-w-full align-middle">
      <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        <div className="md:hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="mb-2 w-full rounded-md bg-white p-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="mb-2 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-100"></div>
                    <div className="ml-2 h-6 w-16 rounded bg-gray-100"></div>
                  </div>
                  <div className="h-5 w-20 rounded bg-gray-100"></div>
                </div>
                <div className="h-6 w-16 rounded bg-gray-100"></div>
              </div>
              <div className="flex w-full items-center justify-between pt-4">
                <div>
                  <div className="h-6 w-16 rounded bg-gray-100"></div>
                  <div className="mt-2 h-5 w-24 rounded bg-gray-100"></div>
                </div>
                <div className="flex justify-end gap-2">
                  <div className="h-10 w-10 rounded bg-gray-100"></div>
                  <div className="h-10 w-10 rounded bg-gray-100"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <table className="hidden min-w-full text-gray-900 md:table">
          <thead className="rounded-lg text-left text-sm font-normal">
            <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Customer</th>
              <th scope="col" className="px-3 py-5 font-medium">Email</th>
              <th scope="col" className="px-3 py-5 font-medium">Amount</th>
              <th scope="col" className="px-3 py-5 font-medium">Date</th>
              <th scope="col" className="px-3 py-5 font-medium">Status</th>
              <th scope="col" className="relative py-3 pl-6 pr-3"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

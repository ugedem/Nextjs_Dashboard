import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '../components/Icons';
import { InvoicesTableSkeleton } from '../components/Skeletons';
import type { Invoice, Customer } from '../types';
import {
  fetchFilteredInvoices,
  fetchInvoicesPages,
  getCustomerById,
  deleteInvoice
} from '../services/data';
import { formatDateToLocal, formatCurrency, generatePagination } from '../services/utils/utils';

// --- Sub-components for Invoices Page ---

const Search: React.FC<{ placeholder: string }> = ({ placeholder }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    setSearchParams(params);
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">Search</label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
};

const CreateInvoiceButton: React.FC = () => (
  <Link
    to="/invoices/create"
    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
  >
    <span className="hidden md:block">Create Invoice</span>
    <PlusIcon className="h-5 md:ml-4" />
  </Link>
);

const UpdateInvoiceButton: React.FC<{ id: string }> = ({ id }) => (
  <Link to={`/invoices/${id}/edit`} className="rounded-md border p-2 hover:bg-gray-100">
    <PencilIcon className="w-5" />
  </Link>
);

const DeleteInvoiceButton: React.FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
        await deleteInvoice(id);
        // This is a simple way to refresh. A more robust solution might involve a global state manager.
        window.location.reload(); 
    }
  };
  return (
    <button onClick={handleDelete} className="rounded-md border p-2 hover:bg-gray-100">
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
};


const InvoiceStatus: React.FC<{ status: 'pending' | 'paid' }> = ({ status }) => (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
        status === 'pending' ? 'bg-gray-100 text-gray-500' : 'bg-green-500 text-white'
    }`}>
        {status === 'pending' ? 'Pending' : 'Paid'}
    </span>
);


const InvoicesTable: React.FC<{ query: string; currentPage: number }> = ({ query, currentPage }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [customers, setCustomers] = useState<Record<string, Customer>>({});
    const [loading, setLoading] = useState(true);
    const [debouncedQuery] = useDebounce(query, 500);

    useEffect(() => {
        setLoading(true);
        fetchFilteredInvoices(debouncedQuery, currentPage).then(async (fetchedInvoices) => {
            setInvoices(fetchedInvoices);
            const customerIds = [...new Set(fetchedInvoices.map(i => i.customer_id))];
            const customerPromises = customerIds.map(id => getCustomerById(id));
            const fetchedCustomers = await Promise.all(customerPromises);
            const customerMap: Record<string, Customer> = {};
            fetchedCustomers.forEach(c => {
                if (c) customerMap[c.id] = c;
            });
            setCustomers(customerMap);
            setLoading(false);
        });
    }, [debouncedQuery, currentPage]);

    if (loading) return <InvoicesTableSkeleton />;
    if (invoices.length === 0) return <p className="mt-4 text-center">No invoices found.</p>;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
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
              {invoices.map((invoice) => {
                const customer = customers[invoice.customer_id];
                return (
                  <tr key={invoice.id} className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <img src={customer?.image_url} className="rounded-full" width={28} height={28} alt={`${customer?.name}'s profile picture`} />
                        <p>{customer?.name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">{customer?.email}</td>
                    <td className="whitespace-nowrap px-3 py-3">{formatCurrency(invoice.amount)}</td>
                    <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(invoice.date)}</td>
                    <td className="whitespace-nowrap px-3 py-3"><InvoiceStatus status={invoice.status} /></td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateInvoiceButton id={invoice.id} />
                        <DeleteInvoiceButton id={invoice.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


const Pagination: React.FC<{ totalPages: number }> = ({ totalPages }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const allPages = generatePagination(currentPage, totalPages);
    
    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `?${params.toString()}`;
    };

    return (
        <div className="inline-flex">
            {allPages.map((page, index) => {
                const isActive = currentPage === page;
                if (page === '...') {
                    return <div key={`${page}-${index}`} className="flex h-10 w-10 items-center justify-center text-sm">...</div>;
                }
                return (
                    <Link
                        key={page}
                        to={`/invoices${createPageURL(page)}`}
                        className={`flex h-10 w-10 items-center justify-center text-sm border ${
                            isActive ? 'z-10 bg-blue-600 border-blue-600 text-white' : 'hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </Link>
                );
            })}
        </div>
    );
};


// --- Main Invoices Page Component ---

const InvoicesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const currentPage = Number(searchParams.get('page')) || 1;
  const [totalPages, setTotalPages] = useState(0);

   useEffect(() => {
    fetchInvoicesPages(query).then(setTotalPages);
  }, [query]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoiceButton />
      </div>
      <InvoicesTable query={query} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        {totalPages > 0 && <Pagination totalPages={totalPages} />}
      </div>
    </div>
  );
};

export default InvoicesPage;
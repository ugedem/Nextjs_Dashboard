import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { CustomerField, InvoiceForm } from '../types';
import { fetchCustomers, createInvoice } from '../services/data';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
} from '../components/Icons';


const Breadcrumbs: React.FC<{ breadcrumbs: { label: string; href: string; active?: boolean }[] }> = ({ breadcrumbs }) => (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className="flex text-xl md:text-2xl">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} aria-current={breadcrumb.active} className={`${breadcrumb.active ? 'text-gray-900' : 'text-gray-500'}`}>
            <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
            {index < breadcrumbs.length - 1 ? <span className="mx-3 inline-block">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }> = ({ children, className, ...rest }) => (
    <button {...rest} className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 ${className}`}>
      {children}
    </button>
);


const InvoiceForm: React.FC<{ customers: CustomerField[] }> = ({ customers }) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        const formData = new FormData(event.currentTarget);
        const newInvoice: InvoiceForm = {
            customer_id: formData.get('customerId') as string,
            amount: Math.round(parseFloat(formData.get('amount') as string) * 100),
            status: formData.get('status') as 'pending' | 'paid',
        };

        // Basic validation
        if (!newInvoice.customer_id || !newInvoice.amount || !newInvoice.status) {
            setError('Please fill out all fields.');
            setIsSubmitting(false);
            return;
        }

        try {
            await createInvoice(newInvoice);
            navigate('/invoices');
        } catch (e) {
            setError('Failed to create invoice.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Customer Name */}
                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">Choose customer</label>
                    <div className="relative">
                        <select
                            id="customer"
                            name="customerId"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="customer-error"
                        >
                            <option value="" disabled>Select a customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>{customer.name}</option>
                            ))}
                        </select>
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                {/* Invoice Amount */}
                <div className="mb-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">Choose an amount</label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                placeholder="Enter USD amount"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Invoice Status */}
                <fieldset>
                    <legend className="mb-2 block text-sm font-medium">Set the invoice status</legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input id="pending" name="status" type="radio" value="pending" className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2" />
                                <label htmlFor="pending" className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">Pending <ClockIcon className="h-4 w-4" /></label>
                            </div>
                            <div className="flex items-center">
                                <input id="paid" name="status" type="radio" value="paid" className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2" />
                                <label htmlFor="paid" className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white">Paid <CheckIcon className="h-4 w-4" /></label>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {error && (
                    <div className="flex h-8 items-end space-x-1 mt-2" aria-live="polite" aria-atomic="true">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                )}
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link to="/invoices" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">Cancel</Link>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-500" aria-disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Invoice'}
                </Button>
            </div>
        </form>
    );
};


const InvoiceCreatePage: React.FC = () => {
    const [customers, setCustomers] = useState<CustomerField[]>([]);
    
    useEffect(() => {
        fetchCustomers().then(setCustomers);
    }, []);

    const breadcrumbs = useMemo(() => [
        { label: 'Invoices', href: '/invoices' },
        { label: 'Create Invoice', href: '/invoices/create', active: true },
    ], []);

    return (
        <main>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            {customers.length > 0 ? <InvoiceForm customers={customers} /> : <div>Loading customers...</div>}
        </main>
    );
};

export default InvoiceCreatePage;
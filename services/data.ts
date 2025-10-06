import type {
  User,
  Revenue,
  LatestInvoice,
  Invoice,
  Customer,
  CustomerField,
  InvoiceForm,
} from '../types';
import { formatCurrency } from './utils/utils';

// --- MOCK DATA ---
const revenues: Revenue[] = [
    { month: 'Jan', revenue: 2000 },
    { month: 'Feb', revenue: 1800 },
    { month: 'Mar', revenue: 2200 },
    { month: 'Apr', revenue: 2500 },
    { month: 'May', revenue: 2300 },
    { month: 'Jun', revenue: 3200 },
    { month: 'Jul', revenue: 3500 },
    { month: 'Aug', revenue: 3700 },
    { month: 'Sep', revenue: 2500 },
    { month: 'Oct', revenue: 2800 },
    { month: 'Nov', revenue: 3000 },
    { month: 'Dec', revenue: 4800 },
];

let invoices: Invoice[] = [
    {
      id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
      customer_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
      amount: 15795,
      status: 'pending',
      date: '2022-12-06',
    },
    {
      id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
      customer_id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
      amount: 20348,
      status: 'paid',
      date: '2022-11-14',
    },
    // ... more invoices
];

const customers: Customer[] = [
    {
      id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
      name: 'Delba de Oliveira',
      email: 'delba@oliveira.com',
      image_url: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    },
    {
      id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
      name: 'Lee Robinson',
      email: 'lee@robinson.com',
      image_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    {
      id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
      name: 'Hector Simpson',
      email: 'hector@simpson.com',
      image_url: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    },
];

const user: User = {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com'
};


// --- SIMULATED API DELAY ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- DATA FETCHING FUNCTIONS ---

export async function fetchRevenue(): Promise<Revenue[]> {
  await delay(750);
  return revenues;
}

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
  await delay(1000);
  const latestInvoices = invoices.slice(0, 5).map(invoice => {
      const customer = customers.find(c => c.id === invoice.customer_id);
      return {
          ...invoice,
          name: customer?.name || 'Unknown',
          image_url: customer?.image_url || '',
          email: customer?.email || '',
          amount: formatCurrency(invoice.amount)
      };
  });
  return latestInvoices;
}

export async function fetchCardData(): Promise<{
  numberOfCustomers: number;
  numberOfInvoices: number;
  totalPaidInvoices: string;
  totalPendingInvoices: string;
}> {
  await delay(500);
  const numberOfInvoices = invoices.length;
  const numberOfCustomers = customers.length;
  const totalPaidInvoices = formatCurrency(invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0));
  const totalPendingInvoices = formatCurrency(invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0));
  return { numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices };
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(query: string, currentPage: number): Promise<Invoice[]> {
  await delay(500);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const filtered = invoices.filter(invoice => {
    const customer = customers.find(c => c.id === invoice.customer_id);
    const searchStr = [
      customer?.name,
      customer?.email,
      formatCurrency(invoice.amount),
      invoice.date,
      invoice.status,
    ].join(' ').toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  return filtered.slice(offset, offset + ITEMS_PER_PAGE);
}

export async function fetchInvoicesPages(query: string): Promise<number> {
    await delay(200);
    const filtered = invoices.filter(invoice => {
        const customer = customers.find(c => c.id === invoice.customer_id);
        const searchStr = [
          customer?.name,
          customer?.email,
          formatCurrency(invoice.amount),
          invoice.date,
          invoice.status,
        ].join(' ').toLowerCase();
        return searchStr.includes(query.toLowerCase());
    });
    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
}


export async function fetchInvoiceById(id: string): Promise<Invoice | undefined> {
  await delay(500);
  return invoices.find((invoice) => invoice.id === id);
}

export async function fetchCustomers(): Promise<CustomerField[]> {
  await delay(300);
  return customers.map(customer => ({ id: customer.id, name: customer.name }));
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
    await delay(100);
    return customers.find(c => c.id === id);
}

// --- DATA MUTATION FUNCTIONS ---

export async function createInvoice(formData: InvoiceForm): Promise<void> {
    await delay(1000);
    const newInvoice: Invoice = {
        id: crypto.randomUUID(),
        customer_id: formData.customer_id,
        amount: formData.amount,
        status: formData.status,
        date: new Date().toISOString().split('T')[0],
    };
    invoices.unshift(newInvoice);
    console.log("Created invoice:", newInvoice);
}

export async function updateInvoice(id: string, formData: InvoiceForm): Promise<void> {
    await delay(1000);
    const index = invoices.findIndex(i => i.id === id);
    if (index !== -1) {
        invoices[index] = {
            ...invoices[index],
            customer_id: formData.customer_id,
            amount: formData.amount,
            status: formData.status,
        };
        console.log("Updated invoice:", invoices[index]);
    } else {
        throw new Error("Invoice not found");
    }
}

export async function deleteInvoice(id: string): Promise<void> {
    await delay(500);
    invoices = invoices.filter(i => i.id !== id);
    console.log("Deleted invoice with id:", id);
}
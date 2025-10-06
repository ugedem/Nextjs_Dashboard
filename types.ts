
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Password should not be exposed in most cases
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  image_url: string;
}

export interface Invoice {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
  date: string;
}

export interface Revenue {
  month: string;
  revenue: number;
}

export interface LatestInvoice {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
}

export interface CardData {
    amount: string | number;
    label: string;
    type: 'collected' | 'pending' | 'invoices' | 'customers';
}

export interface CustomerField {
  id: string;
  name: string;
}

export interface InvoiceForm extends Omit<Invoice, 'id' | 'date'> {}

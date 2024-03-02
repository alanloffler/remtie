// Products interfaces for select inputs
interface Business {
  id: number;
  name: string;
  value: string;
}

interface Category {
  id: number;
  name: string;
  value: string;
  color: string;
}

export type { Business, Category };
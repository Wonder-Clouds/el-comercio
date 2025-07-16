export interface Cash {
  date_cash: string;
  two_hundred: number;
  one_hundred: number;
  fifty: number;
  twenty: number;
  ten: number;
  five: number;
  two: number;
  one: number;
  fifty_cents: number;
  twenty_cents: number;
  ten_cents: number;
  amount: number;
}

export interface CashRow {
  denomination: string;
  quantity: number;
  total: number;
}

export const cashToRows = (cash: Cash): CashRow[] => [
  {
    denomination: "S/ 200",
    quantity: cash.two_hundred,
    total: cash.two_hundred * 200,
  },
  {
    denomination: "S/ 100",
    quantity: cash.one_hundred,
    total: cash.one_hundred * 100,
  },
  { denomination: "S/ 50", quantity: cash.fifty, total: cash.fifty * 50 },
  { denomination: "S/ 20", quantity: cash.twenty, total: cash.twenty * 20 },
  { denomination: "S/ 10", quantity: cash.ten, total: cash.ten * 10 },
  { denomination: "S/ 5", quantity: cash.five, total: cash.five * 5 },
  { denomination: "S/ 2", quantity: cash.two, total: cash.two * 2 },
  { denomination: "S/ 1", quantity: cash.one, total: cash.one * 1 },
  {
    denomination: "S/ 0.50",
    quantity: cash.fifty_cents,
    total: cash.fifty_cents * 0.5,
  },
  {
    denomination: "S/ 0.20",
    quantity: cash.twenty_cents,
    total: cash.twenty_cents * 0.2,
  },
  {
    denomination: "S/ 0.10",
    quantity: cash.ten_cents,
    total: cash.ten_cents * 0.1,
  },
];

export const defaultCash: Cash = {
  date_cash: "",
  two_hundred: 0,
  one_hundred: 0,
  fifty: 0,
  twenty: 0,
  ten: 0,
  five: 0,
  two: 0,
  one: 0,
  fifty_cents: 0,
  twenty_cents: 0,
  ten_cents: 0,
  amount: 0,
};

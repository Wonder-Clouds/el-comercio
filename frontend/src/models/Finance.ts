export enum OperationType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export interface Finance {
  id: number;
  date_finance?: string;
  description: string;
  type_operation: OperationType | null;
  amount: number;
}

export const defaultFinance: Finance = {
  id: 0,
  date_finance: "",
  description: "",
  type_operation: null,
  amount: 0,
};

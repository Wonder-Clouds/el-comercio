export interface SalesBySellers {
  assignment__seller__name: string;
  total_sold: number;
  total_amount: number;
}
export type SalesBySellersResponse = SalesBySellers[];

export interface MonthlyEarnings {
  month: Date;
  total_earnings: number;
}
export type MonthlyEarningsResponse = MonthlyEarnings[];

export interface TopProducts {
  product__name: string;
  total_sold: number;
  total_amount: number;
}
export type TopProductsResponse = TopProducts[];

export interface TopNewsPapers {
  product__name: string;
  total_sold: number;
  total_amount: number;
}
export type TopNewsPapersResponse = TopNewsPapers[];

export interface Profits {
  assignment__seller__name: string;
  total_profit: number;
}
export type ProfitsResponse = Profits[];

export interface ReturnsAndEfficiency {
  assignment__seller__name: string;
  total_sold: number;
  total_returned: number;
  return_percentage: number;
  impact_on_sales: number;
}
export type ReturnsAndEfficiencyResponse = ReturnsAndEfficiency[];

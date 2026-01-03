import { HttpResponse } from "@/types/HttpResponse";

export type SummaryCategoryTransactionResponse = HttpResponse<
  SummaryCategoryTransaction[]
>;

export interface SummaryCategoryTransactionRsequest {
  start_date?: string;
  end_date?: string;
}

export interface SummaryCategoryTransaction {
  id: string;
  name: string;
  type: number;
  money: number;
}

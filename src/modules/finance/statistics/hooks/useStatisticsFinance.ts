import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import {
  SummaryCategoryTransactionResponse,
  SummaryCategoryTransactionRsequest,
} from "../models";
import { StatisticsFinanceService } from "../services";

export const useSummaryCategoryTransactions = (
  params?: SummaryCategoryTransactionRsequest,
  options?: UseQueryOptions<SummaryCategoryTransactionResponse>
) =>
  useQuery({
    queryKey: ["summary-transaction-by-category", params],
    queryFn: () =>
      StatisticsFinanceService.getSummaryTransactionByCategory(params),
    ...options,
  });

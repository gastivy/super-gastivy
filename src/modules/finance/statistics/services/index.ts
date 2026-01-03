import { httpService } from "@/utils/httpService";

import {
  SummaryCategoryTransactionResponse,
  SummaryCategoryTransactionRsequest,
} from "../models";

export const StatisticsFinanceService = {
  getSummaryTransactionByCategory: (
    params?: SummaryCategoryTransactionRsequest
  ) =>
    httpService
      .get<SummaryCategoryTransactionResponse>("/finance-app/statistics", {
        params,
      })
      .then((res) => res.data),
};

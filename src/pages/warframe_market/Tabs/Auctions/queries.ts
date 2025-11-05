import api from "@api/index";
import { useQuery } from "@tanstack/react-query";
import type { TauriTypes } from "$types";

interface QueriesHooks {
	queryData: TauriTypes.WishListControllerGetListParams;
	isActive?: boolean;
}

export const useStockQueries = ({ queryData, isActive }: QueriesHooks) => {
	const getPaginationQuery = useQuery({
		queryKey: ["get_wfm_auctions_pagination", queryData],
		queryFn: () => api.auction.getPagination(queryData),
		retry: false,
		enabled: isActive,
	});
	const refetchQueries = () => {
		getPaginationQuery.refetch();
	};

	// Return the queries
	return {
		paginationQuery: getPaginationQuery,
		refetchQueries,
	};
};

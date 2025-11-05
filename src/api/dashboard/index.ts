import { useQuery } from "@tanstack/react-query";
import type { TauriTypes } from "$types";
import type { TauriClient } from "..";
export class DashboardModule {
	constructor(private readonly client: TauriClient) {}

	summary() {
		return useQuery({
			queryKey: ["dashboard_summary"],
			queryFn: () =>
				this.client.sendInvoke<TauriTypes.DashboardSummary>(
					"dashboard_summary",
				),
			refetchOnWindowFocus: true,
			retry: false,
		});
	}
}

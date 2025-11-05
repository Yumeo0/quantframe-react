import type { QuantframeApiTypes } from "$types";
import type { TauriClient } from "..";
export class AlertModule {
	constructor(private readonly client: TauriClient) {}

	async get_alerts(): Promise<QuantframeApiTypes.AlertControllerGetListData> {
		return await this.client.sendInvoke<QuantframeApiTypes.AlertControllerGetListData>(
			"alert_get_alerts",
		);
	}
}

import type { TauriTypes } from "$types";
import type { TauriClient } from "..";
export class LiveScraperModule {
	constructor(private readonly client: TauriClient) {}

	async toggle(): Promise<void> {
		this.client.sendInvoke("live_scraper_toggle");
	}
	async get_interesting_wtb_items(
		settings: TauriTypes.SettingsStockItem,
	): Promise<TauriTypes.ItemPriceInfo[]> {
		return await this.client.sendInvoke(
			"live_scraper_get_interesting_wtb_items",
			{ settings },
		);
	}
	async get_state(): Promise<{ is_running: boolean }> {
		return await this.client.sendInvoke("live_scraper_get_state");
	}
}

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCross } from "@fortawesome/free-solid-svg-icons";
import type { WFMarketTypes } from "$types";
import faPolarityAura from "../../icons/faPolarityAura";
import faPolarityMadurai from "../../icons/faPolarityMadurai";
import faPolarityNaramon from "../../icons/faPolarityNaramon";
import faPolarityPenjaga from "../../icons/faPolarityPenjaga";
import faPolarityUmbra from "../../icons/faPolarityUmbra";
import faPolarityUnairu from "../../icons/faPolarityUnairu";
import faPolarityVazarin from "../../icons/faPolarityVazarin";
import faPolarityZenuri from "../../icons/faPolarityZenuri";
import type { TauriClient } from "..";
export class AuctionModule {
	constructor(private readonly client: TauriClient) {}
	async getPagination(
		query: WFMarketTypes.WfmAuctionControllerGetListParams,
	): Promise<WFMarketTypes.WfmAuctionControllerGetListData> {
		return await this.client.sendInvoke<WFMarketTypes.WfmAuctionControllerGetListData>(
			"get_wfm_auctions_pagination",
			{ query },
		);
	}

	async refreshAuctions(): Promise<any> {
		return await this.client.sendInvoke<any>("auction_refresh");
	}

	async deleteAllAuctions(): Promise<any> {
		return await this.client.sendInvoke<any>("auction_delete_all");
	}
	async deleteById(id: string): Promise<any> {
		return await this.client.sendInvoke<any>("auction_delete_by_id", { id });
	}

	async importById(id: string, bought: number): Promise<any> {
		return await this.client.sendInvoke<any>("auction_import_by_id", {
			id,
			bought,
		});
	}

	polarityToIcon(polarity: string): IconDefinition {
		switch (polarity) {
			case "zenuri":
				return faPolarityZenuri;
			case "unairu":
				return faPolarityUnairu;
			case "umbra":
				return faPolarityUmbra;
			case "penjaga":
				return faPolarityPenjaga;
			case "naramon":
				return faPolarityNaramon;
			case "madurai":
				return faPolarityMadurai;
			case "aura":
				return faPolarityAura;
			case "vazarin":
				return faPolarityVazarin;
			default:
				return faCross;
		}
	}
}

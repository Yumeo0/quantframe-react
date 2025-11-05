import type { TauriTypes, UserStatus } from "$types";
import type { TauriClient } from "..";
export class UserModule {
	constructor(private readonly client: TauriClient) {}

	async set_status(status: UserStatus): Promise<void> {
		await this.client.sendInvoke<TauriTypes.User>("user_set_status", {
			status,
		});
	}
}

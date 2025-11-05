import { useTranslateComponent } from "@hooks/useTranslate.hook";
import { Group, Title } from "@mantine/core";
import type { TauriTypes } from "$types";
import { ItemComponent } from "../ItemComponent";

export function ItemComponents({
	components,
}: {
	components: TauriTypes.ItemComponent[];
}) {
	return (
		<>
			<Title order={3} mt={"md"}>
				{useTranslateComponent("item_components")}
			</Title>
			<Group align="center">
				{components
					.filter((x) => x.tradable)
					.map((component) => (
						<ItemComponent
							key={component.uniqueName + component.itemCount}
							component={component}
						/>
					))}
			</Group>
		</>
	);
}

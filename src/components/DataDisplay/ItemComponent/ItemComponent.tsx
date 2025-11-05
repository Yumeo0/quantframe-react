import { useTranslateComponent } from "@hooks/useTranslate.hook";
import { Group } from "@mantine/core";
import type { TauriTypes } from "$types";
import { TextTranslate } from "../../Shared/TextTranslate";
export type ItemComponentProps = {
	component: TauriTypes.ItemComponent;
};

export function ItemComponent({ component }: ItemComponentProps) {
	return (
		<Group align="center">
			<TextTranslate
				size="lg"
				i18nKey={useTranslateComponent("item_component", undefined, true)}
				values={{ name: component.name, count: component.itemCount }}
			/>
		</Group>
	);
}

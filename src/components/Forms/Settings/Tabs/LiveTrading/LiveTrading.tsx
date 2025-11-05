import { useTranslateForms } from "@hooks/useTranslate.hook";
import { Tabs } from "@mantine/core";
import { useState } from "react";
import type { TauriTypes } from "$types";
import { GeneralPanel } from "./Tabs/General";
import { ItemPanel } from "./Tabs/Item";
import { RivenPanel } from "./Tabs/Riven";

export type LiveTradingPanelProps = {
	value: TauriTypes.SettingsLiveScraper;
	onSubmit: (value: TauriTypes.SettingsLiveScraper) => void;
};

export const LiveTradingPanel = ({
	onSubmit,
	value,
}: LiveTradingPanelProps) => {
	const [hideTab, setHideTab] = useState<boolean>(false);

	// Translate general
	const useTranslateForm = (
		key: string,
		context?: { [key: string]: any },
		i18Key?: boolean,
	) => useTranslateForms(`settings.${key}`, { ...context }, i18Key);
	const useTranslateTabs = (
		key: string,
		context?: { [key: string]: any },
		i18Key?: boolean,
	) => useTranslateForm(`tabs.${key}`, { ...context }, i18Key);

	const tabs = [
		{
			label: useTranslateTabs("live_scraper.general.title"),
			component: (
				<GeneralPanel
					value={value}
					setHideTab={(v) => setHideTab(v)}
					onSubmit={(v) => {
						onSubmit({ ...value, ...v });
					}}
				/>
			),
			id: "general",
		},
		{
			label: useTranslateTabs("live_scraper.item.title"),
			component: (
				<ItemPanel
					value={value.stock_item}
					onSubmit={(v) => {
						onSubmit({ ...value, stock_item: v });
					}}
				/>
			),
			id: "item",
		},
		{
			label: useTranslateTabs("live_scraper.riven.title"),
			component: (
				<RivenPanel
					value={value.stock_riven}
					onSubmit={(v) => {
						onSubmit({ ...value, stock_riven: v });
					}}
				/>
			),
			id: "riven",
		},
	];

	const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

	return (
		<Tabs
			h={"82vh"}
			orientation="vertical"
			value={activeTab}
			onChange={(value) => setActiveTab(value || tabs[0].id)}
		>
			<Tabs.List display={hideTab ? "none" : ""}>
				{tabs.map((tab) => (
					<Tabs.Tab value={tab.id} key={tab.id}>
						{tab.label}
					</Tabs.Tab>
				))}
			</Tabs.List>
			{tabs.map((tab) => (
				<Tabs.Panel value={tab.id} key={tab.id}>
					{tab.component}
				</Tabs.Panel>
			))}
		</Tabs>
	);
};

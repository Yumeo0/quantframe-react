import api, { SendTauriEvent } from "@api/index";
import { ItemName } from "@components/DataDisplay/ItemName";
import { DebuggingLiveItemEntryForm } from "@components/Forms/DebuggingLiveItemEntry";
import { ActionWithTooltip } from "@components/Shared/ActionWithTooltip";
import { useAppContext } from "@contexts/app.context";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useHasAlert } from "@hooks/useHasAlert.hook";
import { useTranslatePages } from "@hooks/useTranslate.hook";
import { Box, Group } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { TauriTypes } from "$types";
import classes from "../../Debug.module.css";

type DebuggingPanelProps = Record<string, never>;
export const DebuggingPanel = (_: DebuggingPanelProps) => {
	// Context
	const { settings } = useAppContext();

	// Translate general
	const useTranslateTabDebugging = (
		key: string,
		context?: { [key: string]: any },
		i18Key?: boolean,
	) => useTranslatePages(`debug.tabs.debugging.${key}`, { ...context }, i18Key);
	const useTranslateDataGridColumns = (
		key: string,
		context?: { [key: string]: any },
		i18Key?: boolean,
	) =>
		useTranslateTabDebugging(
			`datatable.columns.${key}`,
			{ ...context },
			i18Key,
		);

	return (
		<Box>
			<DebuggingLiveItemEntryForm
				onSubmit={async (values) => {
					if (!settings) return;
					const items = [
						...(settings?.debugging.live_scraper.entries || []),
						values,
					];
					await api.app.updateSettings({
						...settings,
						debugging: {
							...settings.debugging,
							live_scraper: {
								...settings.debugging.live_scraper,
								entries: items,
							},
						},
					});
					SendTauriEvent(TauriTypes.Events.RefreshSettings);
				}}
			/>
			{/* <SearchField value={search} onChange={(e) => setSearch(e)} /> */}
			<DataTable
				height={400}
				className={`${classes.dataTableLogging}`}
				data-alert={useHasAlert()}
				mt={10}
				striped
				idAccessor={"wfm_url"}
				records={settings?.debugging.live_scraper.entries || []}
				columns={[
					{
						accessor: "wfm_url",
						title: useTranslateDataGridColumns("wfm_url.title"),
						render: (row) => <ItemName value={row} />,
					},
					{
						accessor: "stock_id",
						title: useTranslateDataGridColumns("stock_id"),
					},
					{
						accessor: "wish_list_id",
						title: useTranslateDataGridColumns("wish_list_id"),
					},
					{
						accessor: "priority",
						title: useTranslateDataGridColumns("priority"),
					},
					{
						accessor: "buy_quantity",
						title: useTranslateDataGridColumns("buy_quantity"),
					},
					{
						accessor: "sell_quantity",
						title: useTranslateDataGridColumns("sell_quantity"),
					},
					{
						accessor: "operation",
						title: useTranslateDataGridColumns("operation"),
					},
					{
						accessor: "actions",
						title: useTranslateDataGridColumns("actions.title"),
						width: 180,
						render: (row) => (
							<Group gap={"sm"} justify="flex-end">
								<ActionWithTooltip
									tooltip={useTranslateDataGridColumns(
										"actions.buttons.delete_tooltip",
									)}
									color={"red.7"}
									icon={faTrashCan}
									actionProps={{ size: "sm" }}
									iconProps={{ size: "xs" }}
									onClick={async (e) => {
										e.stopPropagation();
										if (!settings) return;
										const items =
											settings?.debugging.live_scraper.entries.filter(
												(item) => item.wfm_url !== row.wfm_url,
											);
										await api.app.updateSettings({
											...settings,
											debugging: {
												...settings.debugging,
												live_scraper: {
													...settings.debugging.live_scraper,
													entries: items,
												},
											},
										});
										SendTauriEvent(TauriTypes.Events.RefreshSettings);
									}}
								/>
							</Group>
						),
					},
				]}
			/>
		</Box>
	);
};

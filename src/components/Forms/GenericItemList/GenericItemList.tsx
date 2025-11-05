import { SearchField } from "@components/Forms/SearchField";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Box, Group, Stack } from "@mantine/core";
import { paginate } from "@utils/helper";
import {
	DataTable,
	type DataTableColumn,
	type DataTableSortStatus,
} from "mantine-datatable";
import { useMemo, useState } from "react";
import { useTranslateForms } from "../../../hooks/useTranslate.hook";
import { ApplyFilter, type ComplexFilter } from "../../../utils/filter.helper";
import { SortItems } from "../../../utils/sorting.helper";
import { ActionWithTooltip } from "../../Shared/ActionWithTooltip";
import classes from "./GenericItemList.module.css";

export type GenericItemListProps<T> = {
	items: T[];
	onAddAll?: (items: T[]) => void;
	onAddItem?: (item: T) => void;
	columns: DataTableColumn<T>[];
	idAccessor: keyof T | ((item: T) => string | number);
	pageSizes?: number[];

	// 🔍 Search support
	searchable?: boolean;
	searchValue?: string;
	onSearchChange?: (val: string) => void;
	onSearch?: (val: string) => void;
	searchFilter?: React.ReactNode;
	searchRightSectionWidth?: number;
	searchRightSection?: React.ReactNode;
	filter?: ComplexFilter;
};

export function GenericItemList<T>({
	items,
	onAddItem,
	onAddAll,
	columns,
	idAccessor,
	pageSizes = [5, 10, 20, 50, 100],
	searchable,
	searchValue,
	onSearchChange,
	onSearch,
	searchFilter,
	searchRightSection,
	searchRightSectionWidth,
	filter,
}: GenericItemListProps<T>) {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(pageSizes[3]);
	const [is_filter_open, setIsFilterOpen] = useState(false);

	// Translate general
	const addAllTooltip = useTranslateForms("generic_item_list.add_all_tooltip");

	// const [rows, setRows] = useState<T[]>([]);
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
		columnAccessor: columns[0].accessor as string,
		direction: "asc",
	});

	// Apply filtering
	// biome-ignore lint/correctness/useExhaustiveDependencies: Probably here for a reason
	const filteredItems = useMemo(() => {
		let result = items;
		if (filter) result = result ? ApplyFilter(items, filter) : items;
		return result;
	}, [items, searchValue, searchFilter, filter, sortStatus]);

	const rows = useMemo(() => {
		const result = SortItems<T>(filteredItems, {
			field: sortStatus.columnAccessor as string,
			direction: sortStatus.direction,
		});
		return paginate(result, page, pageSize);
	}, [filteredItems, page, pageSize, sortStatus]);

	return (
		<Stack>
			{searchable && (
				<SearchField
					value={searchValue ?? ""}
					onChange={onSearchChange ?? (() => {})}
					onSearch={onSearch}
					rightSection={
						<Group gap={4}>
							{searchRightSection}
							{onAddAll && (
								<ActionWithTooltip
									tooltip={addAllTooltip}
									icon={faAdd}
									actionProps={{ size: "sm" }}
									iconProps={{ size: "xs" }}
									onClick={() => onAddAll(filteredItems)}
								/>
							)}
						</Group>
					}
					rightSectionWidth={searchRightSectionWidth}
					filter={searchFilter}
					onFilterToggle={(open) => setIsFilterOpen(open)}
				/>
			)}

			<Box className={classes.datatable} data-filter={is_filter_open}>
				<DataTable
					records={rows}
					totalRecords={filteredItems.length}
					withTableBorder
					withColumnBorders
					page={page}
					recordsPerPage={pageSize}
					idAccessor={idAccessor as any}
					onPageChange={setPage}
					recordsPerPageOptions={pageSizes}
					onRecordsPerPageChange={setPageSize}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					onRowClick={(row) => onAddItem?.(row.record)}
					columns={columns}
				/>
			</Box>
		</Stack>
	);
}

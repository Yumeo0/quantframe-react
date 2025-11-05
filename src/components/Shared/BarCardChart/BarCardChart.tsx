import { Box, Paper, Title, useMantineTheme } from "@mantine/core";
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Tooltip,
	type TooltipCallbacks,
} from "chart.js";
import classes from "./BarCardChart.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import GetDefaultDatasetStyle from "./default.dataSetStyle";
import GetDefaultOptions from "./default.options";

// Type definitions
export type ClickColumn = {
	datasetIndex: number;
	datasetLabel: string;
	index: number;
	column: string;
	value: number;
};

export type BarCardChartProps = {
	title: string;
	labels: string[];
	showDatasetLabels?: boolean;
	horizontal?: boolean;
	chartStyle?: React.CSSProperties;
	context?: React.ReactNode;
	onColumnClick?: (event: ClickColumn) => void;
	tooltipShowColor?: boolean;
	boxWidth?: number;
	boxHeight?: number;
	overlay?: React.ReactNode;
	tooltipCallback?: Partial<TooltipCallbacks<"bar">>;
	datasets: {
		label?: string;
		data: number[];
		backgroundColor?: string;
	}[];
};

export function BarCardChart({
	labels,
	title,
	context,
	chartStyle,
	tooltipShowColor,
	boxWidth,
	boxHeight,
	tooltipCallback,
	showDatasetLabels,
	datasets,
	horizontal,
	overlay,
}: BarCardChartProps) {
	const theme = useMantineTheme();
	const cData = {
		labels: labels,
		datasets: datasets.map((dataset) => ({
			...GetDefaultDatasetStyle(theme.colors.gray[0]),
			...dataset,
		})),
	};
	return (
		<Paper className={classes.root}>
			<Box className={classes.chartContainer}>
				{overlay && <Box className={classes.overlay}>{overlay}</Box>}
				{useMemo(
					() => (
						<Bar
							style={{ ...chartStyle }}
							className={classes.chartCanvas}
							options={
								GetDefaultOptions(
									theme.colors.gray[0],
									showDatasetLabels,
									tooltipShowColor,
									boxWidth,
									boxHeight,
									tooltipCallback,
									horizontal,
								) as any
							}
							data={cData}
						/>
					),
					[
						boxHeight,
						boxWidth,
						// biome-ignore lint/correctness/useExhaustiveDependencies: idk seems to work
						cData,
						chartStyle,
						horizontal,
						showDatasetLabels,
						theme.colors.gray[0],
						tooltipCallback,
						tooltipShowColor,
					],
				)}
			</Box>
			<Title mt={5} order={4}>
				{title}
			</Title>

			{context && <Box pt={1}>{context}</Box>}
		</Paper>
	);
}

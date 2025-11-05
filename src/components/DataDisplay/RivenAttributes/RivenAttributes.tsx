import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Box, Group, Paper, Tooltip } from "@mantine/core";
import type { TauriTypes } from "$types";
import { RivenAttribute } from "../RivenAttribute/RivenAttribute";
import classes from "./RivenAttributes.module.css";
export type RivenAttributesProps = {
	tooltip: boolean;
	attributes: TauriTypes.StockRiven["attributes"];
};

export function RivenAttributes({ attributes, tooltip }: RivenAttributesProps) {
	// Functions

	return (
		<Group mt={5} classNames={classes} p={5}>
			{tooltip ? (
				<Tooltip
					withArrow
					openDelay={100}
					closeDelay={100}
					styles={{
						tooltip: {
							backgroundColor: "transparent",
							padding: 0,
							boxShadow: "none",
						},
						arrow: { backgroundColor: "transparent", borderWidth: 0 },
					}}
					label={
						<Paper withBorder p="xs">
							<Box
								style={{ display: "flex", flexDirection: "column", gap: "8px" }}
							>
								{attributes.map((attr) => (
									<RivenAttribute key={attr.url_name} value={attr} />
								))}
							</Box>
						</Paper>
					}
				>
					<ActionIcon size="sm" variant="outline">
						<FontAwesomeIcon icon={faInfo} />
					</ActionIcon>
				</Tooltip>
			) : (
				attributes.map((attr) => (
					<RivenAttribute key={attr.url_name} value={attr} />
				))
			)}
		</Group>
	);
}

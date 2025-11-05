import api from "@api/index";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import faPolarityAura from "@icons/faPolarityAura";
import faPolarityMadurai from "@icons/faPolarityMadurai";
import faPolarityNaramon from "@icons/faPolarityNaramon";
import faPolarityPenjaga from "@icons/faPolarityPenjaga";
import faPolarityUmbra from "@icons/faPolarityUmbra";
import faPolarityUnairu from "@icons/faPolarityUnairu";
import faPolarityVazarin from "@icons/faPolarityVazarin";
import faPolarityZenuri from "@icons/faPolarityZenuri";
import { Box, Collapse, type PaperProps, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { TauriTypes } from "$types";
import type { RivenAttribute, WFMarketTypes } from "$types/index";
import classes from "./RivenPreview.module.css";

export type RivenPreviewProps = {
	riven: WFMarketTypes.Auction | TauriTypes.StockRiven;
	paperProps?: PaperProps;
};

interface RivenAttributeWithUnits extends RivenAttribute {
	effect: string;
	units: string;
	symbol: string;
}

export function RivenPreview({ paperProps, riven }: RivenPreviewProps) {
	// State
	const { hovered, ref } = useHover();
	const [weapon, setWeapon] = useState<TauriTypes.CacheRivenWeapon | undefined>(
		undefined,
	);
	const [polarity, setPolarity] = useState<string>("");
	const [modName, setModName] = useState<string>("");
	const [attributes, setAttributes] = useState<RivenAttributeWithUnits[]>([]);
	const [mastery, setMastery] = useState<number>(0);
	const [reRolls, setReRolls] = useState<number>(0);
	const [rank, setRank] = useState<number>(0);
	// Fetch data from rust side
	const { data: weapons } = useQuery<TauriTypes.CacheRivenWeapon[], Error>({
		queryKey: ["cache_riven_weapons"],
		queryFn: () => api.cache.getRivenWeapons(),
	});
	const { data: allAttributes } = useQuery<
		TauriTypes.CacheRivenAttribute[],
		Error
	>({
		queryKey: ["cache_riven_attributes"],
		queryFn: () => api.cache.getRivenAttributes(),
	});
	const GetUnitSymbol = (unit: string | undefined) => {
		if (!unit) return "";
		if (unit === "multiply") return "+";
		if (unit === "percent") return "%";
		if (unit === "seconds") return "sec";
		return "";
	};
	// biome-ignore lint/correctness/useExhaustiveDependencies: GetUnitSymbol changes on every render
	useEffect(() => {
		if (!weapons || !allAttributes) return;
		let weapon_url_name = "";
		// Check id type
		if (typeof riven.id === "string") {
			const auction = riven as WFMarketTypes.Auction;
			if (!auction.item.attributes) return;
			weapon_url_name = auction.item.weapon_url_name;
			setPolarity(auction.item.polarity);
			setModName(auction.item.name);
			setAttributes(
				auction.item.attributes?.map((item) => {
					const attribute = allAttributes?.find(
						(attribute) => attribute.url_name === item.url_name,
					);
					const symbol = GetUnitSymbol(attribute?.unit);
					return {
						...item,
						effect: attribute?.effect || "",
						units: attribute?.unit || "",
						symbol,
					};
				}),
			);
			setMastery(auction.item.mastery_level);
			setReRolls(auction.item.re_rolls);
			setRank(auction.item.mod_rank);
		}
		if (typeof riven.id === "number") {
			// const stockRiven = riven as TauriTypes.StockRiven;
			// weapon_url_name = stockRiven.wfm_weapon_url;
			// setPolarity(stockRiven.polarity);
			// setModName(stockRiven.mod_name);
			// if (stockRiven.attributes)
			//   setAttributes(
			//     stockRiven.attributes.map((item) => {
			//       const attribute = allAttributes?.find((attribute) => attribute.url_name == item.url_name);
			//       let symbol = GetUnitSymbol(attribute?.unit);
			//       return {
			//         ...item,
			//         effect: attribute?.effect || "",
			//         units: attribute?.unit || "",
			//         symbol,
			//       };
			//     })
			//   );
			// setMastery(stockRiven.mastery_rank);
			// setReRolls(stockRiven.re_rolls);
			// setRank(stockRiven.sub_type?.rank || 0);
		}
		if (weapons && weapon_url_name !== "")
			setWeapon(weapons.find((item) => item.wfm_url_name === weapon_url_name));
	}, [riven, weapons, allAttributes]);
	const polarizes: Record<string, any> = {
		zenuri: faPolarityZenuri,
		unairu: faPolarityUnairu,
		umbra: faPolarityUmbra,
		penjaga: faPolarityPenjaga,
		naramon: faPolarityNaramon,
		madurai: faPolarityMadurai,
		aura: faPolarityAura,
		vazarin: faPolarityVazarin,
	};
	// compute a stable rank array for keys (avoid using index directly as key)
	const rankCount = Math.min(rank, 8);
	const rankArray = Array.from({ length: rankCount }, (_, idx) => idx + 1);
	return (
		<Box {...paperProps} className={classes.root} ref={ref}>
			{polarity !== "" && (
				<>
					{/* <FontAwesomeIcon className={classes.polarity} icon={faEnvelope} />, */}
					<FontAwesomeIcon
						className={classes.polarity}
						icon={polarizes[polarity]}
					/>
					<Text className={classes.weapon}>{weapon?.name}</Text>
					<Text className={classes.mod_name}>{modName}</Text>
					<Box
						className={classes.attributes}
						style={{
							display: "flex",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						{attributes.map((item) => {
							// use a stable key derived from the attribute data instead of the array index
							const key =
								(item.url_name ? `${item.url_name}` : item.effect || "attr") +
								`-${String(item.value)}`;
							return (
								<Text
									maw={"215"}
									truncate="end"
									key={key}
									className={classes.attribute_text}
								>
									{item.units.includes("multiply") && `${item.symbol}`}
									{item.value}
									{!item.units.includes("multiply") && `${item.symbol}`}
									{` ${item.effect}`}
								</Text>
							);
						})}
					</Box>
					<Text className={classes.mastery}>
						MR {mastery > 16 ? 16 : mastery}
					</Text>
					{reRolls > 0 && (
						<Text className={classes.reroll}>
							<FontAwesomeIcon icon={faArrowsRotate} />
							<Text component="span" ml={5}>
								{reRolls}
							</Text>
						</Text>
					)}
				</>
			)}
			<Box className={classes.rank}>
				{rankArray.map((r) => {
					return (
						<Text key={r} className={classes.circle} size="sm" component="span">
							●
						</Text>
					);
				})}
			</Box>
			<Collapse in={hovered} className={classes.hover}>
				<Text size="sm" c="gray" className={classes.hover_text}></Text>
			</Collapse>
		</Box>
	);
}

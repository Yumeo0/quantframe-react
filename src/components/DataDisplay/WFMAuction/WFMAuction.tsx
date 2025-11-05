import api, { WFMThumbnail } from "@api/index";
import { TextTranslate } from "@components/Shared/TextTranslate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	useTranslateCommon,
	useTranslateComponent,
	useTranslateEnums,
} from "@hooks/useTranslate.hook";
import {
	Avatar,
	Divider,
	Grid,
	Group,
	Image,
	Paper,
	type PaperProps,
	Stack,
	Text,
} from "@mantine/core";
import type { WFMarketTypes } from "$types/index";
import { TimerStamp } from "../../Shared/TimerStamp";
import { RivenAttribute } from "../RivenAttribute";
import classes from "./WFMAuction.module.css";

export type WFMAuctionProps = {
	auction: WFMarketTypes.Auction;
	show_user?: boolean;
	header?: React.ReactNode;
	footer?: React.ReactNode;
	show_border?: boolean;
	display_style: "grid" | "list";
	paperProps?: PaperProps;
};

export function WFMAuction({
	show_border,
	paperProps,
	auction,
	header,
	show_user,
	display_style,
}: WFMAuctionProps) {
	const itemNameValueKey = useTranslateCommon(
		"item_name.value",
		undefined,
		true,
	);
	const sellingPriceKey = useTranslateComponent(
		"wfm_auction.fields.selling_price",
		undefined,
		true,
	);
	const rivenKey = useTranslateComponent(
		"wfm_auction.fields.riven",
		undefined,
		true,
	);
	const platinumKey = useTranslateComponent(
		"wfm_auction.fields.platinum",
		undefined,
		true,
	);
	const ownerStatusTranslation = useTranslateEnums(
		`user_status.${auction.owner?.status ?? "offline"}`,
	);

	return (
		<Paper {...paperProps} classNames={classes} p={7} data-border={show_border}>
			{display_style === "grid" && (
				<Stack gap={3}>
					<Group justify="space-between">
						<Group>
							<Group>
								<Image
									width={32}
									height={32}
									fit="contain"
									src={
										auction?.properties?.image_url
											? WFMThumbnail(auction.properties.image_url)
											: undefined
									}
								/>
							</Group>
							<TextTranslate
								size="lg"
								i18nKey={itemNameValueKey}
								values={{
									name: `${auction?.properties?.item_name || "<Unknown Item>"}  ${auction.item.name}`,
									sub_type: ``,
									quantity: ``,
								}}
							/>
						</Group>
						{header}
					</Group>
					<Divider />
					<Grid>
						<Grid.Col span={9} p={"xs"}>
							<Group mt={5} mb={5} gap={"xs"}>
								{auction.item.attributes?.map((attr) => (
									<RivenAttribute key={attr.url_name} value={attr} />
								))}
							</Group>
						</Grid.Col>
						<Grid.Col
							span={3}
							display="flex"
							style={{
								justifyContent: "center",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<TextTranslate
								textProps={{ span: true }}
								i18nKey={sellingPriceKey}
								values={{
									price: auction.starting_price,
								}}
							/>
						</Grid.Col>
					</Grid>

					<Divider />
					<Group>
						<TextTranslate
							size="lg"
							i18nKey={rivenKey}
							components={{
								polarity: (
									<FontAwesomeIcon
										className={classes.polarity}
										icon={api.auction.polarityToIcon(auction.item.polarity)}
									/>
								),
							}}
							values={{
								mastery_level: auction.item.mastery_level,
								mod_rank: auction.item.mod_rank,
								re_rolls: auction.item.re_rolls,
								polarity: auction.item.polarity,
								name: `${auction?.properties?.item_name || "<Unknown Item>"}  ${auction.item.name}`,
								sub_type: ``,
							}}
						/>
					</Group>
					{show_user && auction.owner && (
						<Group>
							<Avatar
								size={"sm"}
								src={
									auction.owner.avatar
										? WFMThumbnail(auction.owner.avatar)
										: "https://cataas.com/cat"
								}
								alt="no image here"
							/>
							<Group>
								<Text> {auction.owner.ingame_name}</Text>
								<Text
									data-color-mode="text"
									data-user-status={auction.owner.status}
								>
									{ownerStatusTranslation}
								</Text>
							</Group>
						</Group>
					)}
				</Stack>
			)}
			{display_style === "list" && (
				<Grid>
					<Grid.Col span={6}>
						<Group>
							<TextTranslate
								color="gray.4"
								size="lg"
								i18nKey={itemNameValueKey}
								values={{
									name: `${auction?.properties?.item_name || "<Unknown Item>"}  ${auction.item.name}`,
									sub_type: `R(${auction.item.mod_rank})`,
								}}
							/>
						</Group>
						<Group>
							<TextTranslate
								textProps={{
									span: true,
								}}
								size="lg"
								i18nKey={platinumKey}
								values={{ platinum: auction.starting_price }}
							/>
						</Group>
					</Grid.Col>
					<Grid.Col span={3}>
						<Text
							size="lg"
							c="gray.4"
							className={classes.userName}
							truncate
							style={{
								borderBottomColor: `var(--qf-user-status-${
									(auction.owner?.status.toString() || "offline").includes(
										"in_game",
									)
										? "ingame"
										: auction.owner?.status
								})`,
								borderBottom: "rem(3px) solid",
							}}
						>
							{auction.owner?.ingame_name}
						</Text>
					</Grid.Col>
					{/* <Grid.Col span={5}>
            
          </Grid.Col> */}
					<Grid.Col span={3}>
						<TimerStamp date={new Date(auction.created)} />
					</Grid.Col>
				</Grid>
			)}
		</Paper>
	);
}

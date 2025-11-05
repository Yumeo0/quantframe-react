import { WFMThumbnail } from "@api/index";
import { TextTranslate } from "@components/Shared/TextTranslate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	useTranslateCommon,
	useTranslateComponent,
	useTranslateEnums,
} from "@hooks/useTranslate.hook";
import faAmberStar from "@icons/faAmberStar";
import faCyanStar from "@icons/faCyanStar";
import {
	Avatar,
	Box,
	Divider,
	Grid,
	Group,
	Image,
	Paper,
	type PaperProps,
	Rating,
	Stack,
	Text,
	useMantineTheme,
} from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import type { WFMarketTypes } from "$types/index";
import { TimerStamp } from "../../Shared/TimerStamp";
import { ItemName } from "../ItemName";
import classes from "./WFMOrder.module.css";

export type WFMOrderProps = {
	order: WFMarketTypes.Order;
	show_user?: boolean;
	footer?: React.ReactNode;
	show_border?: boolean;
	display_style: "grid" | "list";
	paperProps?: PaperProps;
};

export function WFMOrder({
	show_border,
	paperProps,
	order,
	footer,
	show_user,
	display_style,
}: WFMOrderProps) {
	const theme = useMantineTheme();

	const translateFieldQuantityKey = useTranslateComponent(
		"wfm_order.fields.quantity",
		{},
		true,
	);
	const translateFieldModRankKey = useTranslateComponent(
		"wfm_order.fields.mod_rank",
		{},
		true,
	);
	const translateFieldSubtypeKey = useTranslateComponent(
		"wfm_order.fields.subtype",
		{},
		true,
	);
	const translateFieldPlatinumKey = useTranslateComponent(
		"wfm_order.fields.platinum",
		{},
		true,
	);
	const translateUserStatus = useTranslateEnums(
		`user_status.${order.user?.status ?? "offline"}`,
		{},
	);
	const copyItemName = order?.properties?.item_name || "Unknown Item";
	const copyTitle = useTranslateCommon("notifications.copy_to_clipboard.title");
	const copyMessage = useTranslateCommon(
		"notifications.copy_to_clipboard.message",
		{
			message: copyItemName,
		},
	);

	return (
		<Paper
			{...paperProps}
			classNames={classes}
			p={7}
			data-border={show_border}
			data-color-mode="box-shadow"
			data-order-type={order.type}
		>
			{display_style === "grid" && (
				<Stack gap={3}>
					<Group ml={"xs"} justify="space-between">
						<Group>
							<Text
								style={{ cursor: "copy" }}
								onClick={() => {
									const name = copyItemName;
									navigator.clipboard.writeText(name);
									notifications.show({
										title: copyTitle,
										message: copyMessage,
										color: "green.7",
									});
								}}
								size="lg"
								fw={700}
							>
								{order?.properties?.item_name || "Unknown Item"}
							</Text>
						</Group>
						<Group>
							<TextTranslate
								size="md"
								i18nKey={translateFieldQuantityKey}
								values={{ quantity: order.quantity }}
							/>
						</Group>
					</Group>
					<Divider />
					<Group align="center" grow p={"sm"}>
						<Group>
							<Image
								w={"50%"}
								ml={"sm"}
								width={64}
								height={64}
								fit="contain"
								src={
									order?.properties?.image_url
										? WFMThumbnail(order.properties.image_url)
										: undefined
								}
							/>
						</Group>
						<Group justify="flex-end">
							<Box>
								{order.rank !== undefined && (
									<TextTranslate
										size="lg"
										i18nKey={translateFieldModRankKey}
										values={{
											mod_rank: order.rank,
											mod_max_rank:
												order.properties?.trade_sub_type?.max_rank || "?",
										}}
									/>
								)}
								{order.amberStars !== undefined && (
									<Rating
										fullSymbol={
											<FontAwesomeIcon
												icon={faAmberStar}
												color={theme.colors.yellow[7]}
											/>
										}
										value={order.amberStars}
										count={order.amberStars}
										readOnly
									/>
								)}
								{order.cyanStars !== undefined && (
									<Rating
										fullSymbol={
											<FontAwesomeIcon
												icon={faCyanStar}
												color={theme.colors.blue[7]}
											/>
										}
										value={order.cyanStars}
										count={order.cyanStars}
										readOnly
									/>
								)}
								{order.subtype && (
									<TextTranslate
										size="lg"
										i18nKey={translateFieldSubtypeKey}
										values={{
											sub_type: order.subtype
												? `${upperFirst(order.subtype)}`
												: "",
										}}
									/>
								)}
							</Box>
						</Group>
					</Group>
					<Divider />
					<Group align="center" grow p={3}>
						<Group>
							<TextTranslate
								textProps={{
									span: true,
								}}
								size="lg"
								i18nKey={translateFieldPlatinumKey}
								values={{ platinum: order.platinum }}
							/>
						</Group>
						<Group gap={"sm"} justify="flex-end">
							{footer}
						</Group>
					</Group>
					{show_user && order.user && (
						<Group>
							<Avatar
								size={"sm"}
								src={
									order.user.avatar
										? WFMThumbnail(order.user.avatar)
										: "https://cataas.com/cat"
								}
								alt="no image here"
							/>
							<Group>
								<Text> {order.user.ingame_name}</Text>
								<Text
									data-color-mode="text"
									data-user-status={order.user.status}
								>
									{translateUserStatus}
								</Text>
							</Group>
						</Group>
					)}
				</Stack>
			)}
			{display_style === "list" && (
				<Grid>
					<Grid.Col span={6}>
						<ItemName value={order} />
						<Group>
							<TextTranslate
								textProps={{
									span: true,
								}}
								size="lg"
								i18nKey={translateFieldPlatinumKey}
								values={{ platinum: order.platinum }}
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
									(order.user?.status.toString() || "offline") === "in_game"
										? "ingame"
										: order.user?.status
								})`,
								borderBottom: "rem(3px) solid",
							}}
						>
							{order.user?.ingame_name}
						</Text>
					</Grid.Col>
					{/* <Grid.Col span={5}>
            
          </Grid.Col> */}
					<Grid.Col span={3}>
						<TimerStamp date={order.createdAt} />
					</Grid.Col>
				</Grid>
			)}
		</Paper>
	);
}

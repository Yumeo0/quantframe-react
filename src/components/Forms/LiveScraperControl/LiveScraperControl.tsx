import api from "@api/index";
import { useAppContext } from "@contexts/app.context";
import { useLiveScraperContext } from "@contexts/liveScraper.context";
import { useTranslateComponent } from "@hooks/useTranslate.hook";
import { Button, Center, Group, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TextTranslate } from "../../Shared/TextTranslate";

export function LiveScraperControl() {
	// States
	const { is_running, message } = useLiveScraperContext();
	const { settings } = useAppContext();

	// State
	const [showMessage, setShowMessage] = useState(false);

	const errorLoginTitle = useTranslateComponent(
		"live_scraper_control.errors.login.title",
	);
	const errorLoginMessage = useTranslateComponent(
		"live_scraper_control.errors.login.message",
	);

	const promptStartTitle = useTranslateComponent(
		"live_scraper_control.prompts.start.title",
	);
	const promptStartMessage = useTranslateComponent(
		"live_scraper_control.prompts.start.message",
	);
	const promptStartConfirm = useTranslateComponent(
		"live_scraper_control.prompts.start.confirm",
	);
	const promptStartCancel = useTranslateComponent(
		"live_scraper_control.prompts.start.cancel",
	);

	const buttonStart = useTranslateComponent(
		"live_scraper_control.buttons.start",
	);
	const buttonStop = useTranslateComponent("live_scraper_control.buttons.stop");

	// Mutations
	const StartTradingMutation = useMutation({
		mutationFn: () => api.live_scraper.toggle(),
		onSuccess: async () => {},
		onError: () =>
			notifications.show({
				title: errorLoginTitle,
				message: errorLoginMessage,
				color: "red.7",
			}),
	});

	useEffect(() => {
		setShowMessage(!!message && message.i18nKey !== "");
	}, [message]);

	const ToggleLiveTrading = (start: boolean) => {
		if (start) {
			if (settings?.live_scraper.auto_delete)
				modals.openConfirmModal({
					title: promptStartTitle,
					children: <Text size="sm">{promptStartMessage}</Text>,
					labels: {
						confirm: promptStartConfirm,
						cancel: promptStartCancel,
					},
					onConfirm: async () => StartTradingMutation.mutate(),
				});
			else StartTradingMutation.mutate();
		} else {
			api.live_scraper.toggle();
		}
	};

	return (
		<Center>
			<Stack gap={5} justify="center">
				<Group justify="center">
					<Button
						loading={StartTradingMutation.isPending}
						onClick={() => ToggleLiveTrading(!is_running)}
					>
						{is_running ? buttonStop : buttonStart}
					</Button>
				</Group>
				{is_running && showMessage && (
					<TextTranslate
						i18nKey={
							message?.i18nKey ? `live_scraper_control.${message.i18nKey}` : ""
						}
						values={message?.values || {}}
					/>
				)}
			</Stack>
		</Center>
	);
}

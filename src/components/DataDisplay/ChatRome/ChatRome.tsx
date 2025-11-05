import api from "@api/index";
import { Loading } from "@components/Shared/Loading";
import { useAuthContext } from "@contexts/auth.context";
import { faChevronLeft, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTauriEvent } from "@hooks/useTauriEvent.hook";
import { useTranslateComponent } from "@hooks/useTranslate.hook";
import {
	Button,
	Collapse,
	Group,
	Paper,
	ScrollArea,
	Stack,
	Text,
	Textarea,
} from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { TauriTypes, type WFMarketTypes } from "$types/index";
import { useHasAlert } from "../../../hooks/useHasAlert.hook";
import { ChatMessage } from "../ChatMessage";

export type ChatRomeProps = {
	chat: WFMarketTypes.ChatData;
	goBack: () => void;
};

export const ChatRome = ({ chat, goBack }: ChatRomeProps) => {
	const { user } = useAuthContext();
	const defaultMsgLength = 30;
	const maxMsgLength = 400;

	// State's
	const [messages, setMessages] = useState<WFMarketTypes.ChatMessage[]>([]);
	const [filteredMessages, setFilteredMessages] = useState<
		WFMarketTypes.ChatMessage[]
	>([]);
	const [showCount, setShowCount] = useState(defaultMsgLength);
	const [msg, setMsg] = useState<string>("");
	const [atBottom, setAtBottom] = useState(true);
	const [isOptionsOpen, setIsOptionsOpen] = useState(false);
	const viewport = useRef<HTMLDivElement>(null);

	// Fetch data from rust side
	const { isFetching, data, isError, error } = useQuery({
		queryKey: ["chat_messages", chat.id],
		queryFn: () => api.chat.getChatMessages(chat.id),
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: scrollToBottom changes on every render
	useEffect(() => {
		setShowCount(defaultMsgLength);
		if (!data) return;
		//Filter by data
		setMessages(data);
		setTimeout(() => scrollToBottom(), 100);
	}, [data]);

	useEffect(() => {
		console.log("Messages", messages);
		if (messages.length > 0) {
			setFilteredMessages(messages.slice(0, showCount).reverse());
		}
	}, [messages, showCount]);

	// Translate general
	const useTranslateChatRome = (
		key: string,
		context?: { [key: string]: any },
		i18Key?: boolean,
	) => useTranslateComponent(`chat_rome.${key}`, { ...context }, i18Key);
	const useTranslateFields = (
		key: string,
		context?: { [key: string]: any },
		i18Key?: boolean,
	) => useTranslateChatRome(`fields.${key}`, { ...context }, i18Key);
	const useTranslateButtons = (
		key: string,
		context?: { [key: string]: any },
		i18Key?: boolean,
	) => useTranslateChatRome(`buttons.${key}`, { ...context }, i18Key);

	// Precompute translation strings (call hooks unconditionally)
	const t_button_back = useTranslateButtons("back_label");
	const t_button_options_label = useTranslateButtons("options.label");
	const t_button_options_delete = useTranslateButtons("options.delete");
	const t_button_send = useTranslateButtons("send_label");
	const t_field_message_too_long = useTranslateFields("message.too_long");
	const t_field_message_placeholder = useTranslateFields("message.placeholder");

	// Methods
	const scrollToBottom = () =>
		viewport?.current?.scrollTo({
			top: viewport.current.scrollHeight,
			behavior: "smooth",
		});
	const FindUser = (id: string) => {
		return chat.chat_with.find((user) => user.id === id);
	};

	const handleOnMessage = (newMessage: WFMarketTypes.ChatMessage) => {
		if (newMessage.chat_id !== chat.id) return;
		setMessages((msgs) => {
			const newMsgs = [...msgs];
			newMsgs.unshift(newMessage);
			return newMsgs;
		});
		if (atBottom) setTimeout(() => scrollToBottom(), 100);
	};

	const sendMessage = useMutation({
		mutationFn: (msg: string) => api.chat.send_message(chat.id, msg),
		onSuccess: async () => {
			setMsg("");
		},
		onError: (e) => {
			console.error(e);
		},
	});
	useTauriEvent(TauriTypes.Events.OnChatMessage, handleOnMessage, []);
	return (
		<Paper mt={25}>
			<Group
				justify="space-between"
				p={10}
				style={{
					boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
					position: "relative",
				}}
			>
				<Button
					leftSection={<FontAwesomeIcon icon={faChevronLeft} />}
					onClick={goBack}
				>
					{t_button_back}
				</Button>
				<Text fw={700} c={"blue.7"}>
					{chat.chat_name}
				</Text>
				<Button
					leftSection={<FontAwesomeIcon icon={faEllipsis} />}
					onClick={() => setIsOptionsOpen((o) => !o)}
				>
					{t_button_options_label}
				</Button>
				<Collapse
					in={isOptionsOpen}
					style={{
						position: "absolute",
						top: 56,
						right: 0,
						width: "100%",
						zIndex: 100,
						background: "blue",
					}}
				>
					<Paper p={10} radius={0} style={{ background: "blue" }}>
						<Text>{t_button_options_delete}</Text>
					</Paper>
				</Collapse>
			</Group>
			<Stack gap={0}>
				{isError && <Text c="red">Error: {JSON.stringify(error)}</Text>}
				{isFetching && <Loading />}
				<ScrollArea.Autosize
					p={10}
					h={`calc(100vh - ${useHasAlert() ? "280px" : "260px"})`}
					scrollbarSize={1}
					onBottomReached={() => setAtBottom(true)}
					onScrollPositionChange={(position) => {
						if (atBottom && position.y > 100) setAtBottom(false);
					}}
					onTopReached={() => setShowCount((c) => c + defaultMsgLength)}
					viewportRef={viewport}
				>
					<Stack gap={3}>
						{filteredMessages.map((message) => (
							<ChatMessage
								key={message.id}
								msg={message}
								user={FindUser(message.message_from)}
								sender={message.message_from.includes(user?.wfm_id ?? "")}
							/>
						))}
					</Stack>
				</ScrollArea.Autosize>
				<Paper radius={0} display={"flex"} p={10} h={75}>
					<Textarea
						w={"90%"}
						value={msg}
						onChange={(e) => setMsg(e.currentTarget.value)}
						error={
							msg.length > maxMsgLength ? t_field_message_too_long : undefined
						}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								sendMessage.mutateAsync(msg);
							}
						}}
						placeholder={t_field_message_placeholder}
						maxRows={5}
					></Textarea>
					<Button
						disabled={msg.length > maxMsgLength}
						color="blue"
						h={"100%"}
						ml={"md"}
						w={"10%"}
						onClick={() => sendMessage.mutateAsync(msg)}
					>
						{t_button_send}
					</Button>
				</Paper>
			</Stack>
		</Paper>
	);
};

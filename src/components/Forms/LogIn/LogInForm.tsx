import { useTranslateForms } from "@hooks/useTranslate.hook";
import {
	Anchor,
	Button,
	Divider,
	Group,
	Paper,
	type PaperProps,
	PasswordInput,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export type LogInFormProps = {
	onSubmit: (values: { email: string; password: string }) => void;
	is_loading?: boolean;
	hide_submit?: boolean;
	paperProps?: PaperProps;
	footerContent?: React.ReactNode;
};

export function LogInForm(props: LogInFormProps) {
	const title = useTranslateForms("log_in.title");
	const registerText = useTranslateForms("log_in.register");

	const emailLabel = useTranslateForms("log_in.fields.email.label");
	const emailPlaceholder = useTranslateForms("log_in.fields.email.placeholder");
	const emailErrorText = useTranslateForms("log_in.fields.email.error");

	const passwordLabel = useTranslateForms("log_in.fields.password.label");
	const passwordPlaceholder = useTranslateForms(
		"log_in.fields.password.placeholder",
	);
	const passwordErrorText = useTranslateForms("log_in.fields.password.error");

	const submitText = useTranslateForms("log_in.buttons.submit");

	// User form
	const form = useForm({
		initialValues: {
			email: "",
			name: "",
			password: "",
			terms: true,
		},
		validate: {
			email: (val: string) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
		},
	});
	return (
		<Paper radius="md" p="xl" withBorder {...props.paperProps}>
			<Text size="lg" fw={500}>
				{title}
			</Text>

			<Divider my="lg" />

			<form
				onSubmit={form.onSubmit(() => {
					props.onSubmit({
						email: form.values.email,
						password: form.values.password,
					});
				})}
			>
				<Stack>
					<TextInput
						required
						label={emailLabel}
						placeholder={emailPlaceholder}
						value={form.values.email}
						onChange={(event) =>
							form.setFieldValue("email", event.currentTarget.value)
						}
						error={form.errors.email ? emailErrorText : undefined}
						radius="md"
					/>

					<PasswordInput
						required
						label={passwordLabel}
						placeholder={passwordPlaceholder}
						value={form.values.password}
						onChange={(event) =>
							form.setFieldValue("password", event.currentTarget.value)
						}
						error={form.errors.password ? passwordErrorText : undefined}
						radius="md"
					/>
				</Stack>

				<Group justify="space-between" mt="xl">
					<Anchor component="button" type="button" c="dimmed" size="xs">
						{registerText}
					</Anchor>
					<Button
						disabled={props.hide_submit}
						loading={props.is_loading}
						type="submit"
						radius="xl"
					>
						{submitText}
					</Button>
				</Group>
			</form>
			{props.footerContent && (
				<Group mt={15} grow>
					{props.footerContent}
				</Group>
			)}
		</Paper>
	);
}

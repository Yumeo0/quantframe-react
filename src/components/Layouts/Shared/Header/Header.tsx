import { Group, useMantineTheme } from "@mantine/core";
import { Clock } from "../Clock";
import { Logo } from "../Logo";
import { UserMenu } from "../UserMenu";
import classes from "./Header.module.css";

export type HeaderProps = Record<string, never>;

export function Header(_: HeaderProps) {
	const theme = useMantineTheme();
	return (
		<Group
			ml={"sm"}
			mr={"sm"}
			justify="space-between"
			className={classes.header}
		>
			<Logo color={theme.other.logoColor} />
			<Clock />
			<UserMenu />
		</Group>
	);
}

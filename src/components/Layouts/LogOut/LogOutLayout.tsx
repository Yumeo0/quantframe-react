import { Header } from "@components/Layouts/Shared/Header";
import { useAuthContext } from "@contexts/auth.context";
import { AppShell } from "@mantine/core";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import classes from "./LogOutLayout.module.css";

export function LogOutLayout() {
	const { user } = useAuthContext();
	const navigate = useNavigate();

	useEffect(() => {
		if (user?.qf_banned || user?.wfm_banned) navigate("/error/banned");
	}, [user, navigate]);
	return (
		<AppShell classNames={classes} header={{ height: 65 }}>
			<AppShell.Header withBorder={false}>
				<Header />
			</AppShell.Header>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}

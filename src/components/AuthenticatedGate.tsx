import { useIsAuthenticated } from "@hooks/useIsAuthenticated.hook";
import type { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
	RenderError?: React.ComponentType;
	exclude?: boolean;
	goTo?: string;
	children?: JSX.Element;
};

const AuthenticatedGate: React.FC<Props> = ({
	children = undefined,
	exclude = false,
	RenderError = undefined,
	goTo,
}) => {
	// Call the hook unconditionally
	const auth: boolean = useIsAuthenticated();
	// Derive the final value based on `exclude`
	const isAuthenticated: boolean = exclude ? !auth : auth;

	if (!isAuthenticated) {
		if (goTo) return <Navigate to={goTo} />;
		if (RenderError) return <RenderError />;
		return null;
	}
	return children ? children : <Outlet />;
};
export default AuthenticatedGate;

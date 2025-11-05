import { AppContext } from "@contexts/app.context";
import { useContext } from "react";
export const useHasAlert = () => {
	const authState = useContext(AppContext);
	return authState.alerts.length > 0;
};

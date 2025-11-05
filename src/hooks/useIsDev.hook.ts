import { AppContext } from "@contexts/app.context";
import { useContext } from "react";
export const useIsDev = () => {
	const appState = useContext(AppContext);
	return appState.app_info?.is_dev ?? false;
};

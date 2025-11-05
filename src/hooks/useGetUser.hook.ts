import { AuthContext } from "@contexts/auth.context";
import { useContext } from "react";
export const useGetUser = () => {
	const authState = useContext(AuthContext);
	return authState.user;
};

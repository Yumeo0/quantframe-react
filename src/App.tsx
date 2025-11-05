import { AppRoutes } from "@components/Layouts/Routes";
import { PatreonModal } from "@components/Modals/PatreonModal/indexx";
import { PromptModal } from "@components/Modals/Prompt";
import { AppContextProvider } from "@contexts/app.context";
import { dom, library } from "@fortawesome/fontawesome-svg-core";
import faAmberStar from "@icons/faAmberStar";
import faCyanStar from "@icons/faCyanStar";
import faInfinity from "@icons/faInfinity";
import faMoneyBillTrendDown from "@icons/faMoneyBillTrendDown";
import faPlat from "@icons/faPlat";
import faPolarity from "@icons/faPolarity";
import faPolarityAny from "@icons/faPolarityAny";
import faPolarityAura from "@icons/faPolarityAura";
import faPolarityMadurai from "@icons/faPolarityMadurai";
import faPolarityNaramon from "@icons/faPolarityNaramon";
import faPolarityPenjaga from "@icons/faPolarityPenjaga";
import faPolarityUmbra from "@icons/faPolarityUmbra";
import faPolarityUnairu from "@icons/faPolarityUnairu";
import faPolarityVazarin from "@icons/faPolarityVazarin";
import faPolarityZenuri from "@icons/faPolarityZenuri";
import faTradingAnalytics from "@icons/faTradingAnalytics";
import faWebHook from "@icons/faWebHook";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "i18next";
import { useEffect } from "react";
import { initReactI18next } from "react-i18next";
import api from "./api";
import { ThemeProvider, useTheme } from "./contexts/theme.context";
import { dk } from "./lang/dk";
import { en } from "./lang/en";
import classes from "./modals.module.css";

library.add(faMoneyBillTrendDown);
library.add(faTradingAnalytics);
library.add(faAmberStar);
library.add(faCyanStar);
library.add(faInfinity);
library.add(faPlat);
library.add(faPolarity);
library.add(faPolarityAny);
library.add(faPolarityZenuri);
library.add(faPolarityUnairu);
library.add(faPolarityUmbra);
library.add(faPolarityPenjaga);
library.add(faPolarityNaramon);
library.add(faPolarityMadurai);
library.add(faPolarityAura);
library.add(faPolarityVazarin);
library.add(faWebHook);
dom.watch();
i18n.use(initReactI18next).init({
	resources: {
		en: { translation: en },
		dk: { translation: dk },
	},
	lng: "en",
	fallbackLng: "en",
	interpolation: { escapeValue: false },
});

// Create a Backend Client
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});
const modals = {
	prompt: PromptModal,
	patreon: PatreonModal,
	/* ...other modals */
};
export interface MantineModalsOverride {
	modals: typeof modals;
}
// AppContent component that uses the theme context
function AppContent() {
	const { theme, resolver } = useTheme();
	return (
		<MantineProvider
			defaultColorScheme="dark"
			theme={theme}
			cssVariablesResolver={resolver}
		>
			<Notifications position="bottom-right" />
			<ModalsProvider
				modals={modals}
				modalProps={{
					centered: true,
					classNames: classes,
					onClose() {},
				}}
			>
				<DatesProvider settings={{ locale: "en" }}>
					<AppContextProvider>
						<AppRoutes />
					</AppContextProvider>
				</DatesProvider>
				{/* <ReactQueryDevtools initialIsOpen={false} /> */}
			</ModalsProvider>
		</MantineProvider>
	);
}

function App() {
	useEffect(() => {
		window.onclick = async () => await api.analytics.setLastUserActivity();
	}, []);
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<AppContent />
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;

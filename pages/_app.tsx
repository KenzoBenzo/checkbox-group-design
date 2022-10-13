import type { AppProps } from "next/app";
import { SaasProvider, theme } from "@saas-ui/react";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SaasProvider theme={theme}>
			<Component {...pageProps} />
		</SaasProvider>
	);
}

export default MyApp;

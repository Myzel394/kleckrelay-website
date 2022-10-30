import * as inMilliseconds from "in-milliseconds"

import {QueryClient} from "@tanstack/react-query"

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
			refetchInterval: inMilliseconds.minutes(10),
			refetchOnMount: "always",
			staleTime: inMilliseconds.minutes(10),
		},
	},
})

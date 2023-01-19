export default function getNextUrl(defaultUrl = "/"): string {
	const nextUrlSuggested = new URLSearchParams(location.search).get("next") || ""

	if (
		nextUrlSuggested.startsWith("/") ||
		nextUrlSuggested.startsWith(`https://${window.location.host}`)
	) {
		return nextUrlSuggested
	}

	return defaultUrl
}

import {useLocation, useNavigate} from "react-router-dom"
import {useCallback} from "react"

export default function useNavigateToNext(defaultNextUrl = "/"): () => void {
	const navigate = useNavigate()
	const location = useLocation()

	const navigateToNext = useCallback(() => {
		const nextUrlSuggested =
			new URLSearchParams(location.search).get("next") || ""

		const nextUrl = (() => {
			if (
				nextUrlSuggested.startsWith("/") ||
				nextUrlSuggested.startsWith(`https://${window.location.host}`)
			) {
				return nextUrlSuggested
			}

			return defaultNextUrl
		})()

		setTimeout(() => navigate(nextUrl), 0)
	}, [location, navigate])

	return navigateToNext
}

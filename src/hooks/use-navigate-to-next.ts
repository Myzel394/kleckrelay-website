import {useLocation, useNavigate} from "react-router-dom"
import {useCallback} from "react"

import {getNextUrl} from "~/utils"

export default function useNavigateToNext(defaultNextUrl = "/"): () => void {
	const navigate = useNavigate()
	const location = useLocation()

	const navigateToNext = useCallback(() => {
		setTimeout(() => navigate(getNextUrl(defaultNextUrl)), 0)
	}, [location, navigate])

	return navigateToNext
}

import {useMemo} from "react"
import {useLocation} from "react-router-dom"

export default function useQueryParams<T>(): T {
	const location = useLocation()

	return useMemo(() => {
		const params = new URLSearchParams(location.search)

		const result: Record<string, string> = {}

		for (const [key, value] of params) {
			result[key] = value
		}

		return result as T
	}, [location.search])
}

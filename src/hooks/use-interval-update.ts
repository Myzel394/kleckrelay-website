import {useEffect, useState} from "react"

export default function useIntervalUpdate(
	updateIntervalInMilliSeconds = 1000,
): [Date, () => void] {
	const [, setForceUpdateValue] = useState<number>(0)
	const [startDate, setStartDate] = useState(() => new Date())

	useEffect(() => {
		const interval = setInterval(() => {
			setForceUpdateValue(value => value + 1)
		}, updateIntervalInMilliSeconds)

		return () => clearInterval(interval)
	}, [])

	return [startDate, () => setStartDate(new Date())]
}

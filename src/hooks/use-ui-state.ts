import {Dispatch, SetStateAction, useState} from "react"
import {useUpdateEffect} from "react-use"

export default function useUIState<T>(
	outerValue: T,
): [T, Dispatch<SetStateAction<T>>] {
	const [value, setValue] = useState<T>(outerValue)

	useUpdateEffect(() => {
		setValue(outerValue)
	}, [outerValue])

	return [value, setValue]
}

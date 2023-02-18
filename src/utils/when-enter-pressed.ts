import {KeyboardEventHandler} from "react"

export default function whenEnterPressed<T = HTMLDivElement>(callback: KeyboardEventHandler<T>) {
	return (event: any) => {
		if (event.key === "Enter") {
			callback(event)
		}
	}
}

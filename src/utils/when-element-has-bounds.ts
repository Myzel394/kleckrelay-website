export default function whenElementHasBounds(
	callback: (data: DOMRect) => void,
): (element: HTMLElement | undefined) => void {
	return element => {
		const domRect = element?.getBoundingClientRect() || {
			width: 0,
			height: 0,
		}

		if ((domRect?.width ?? 0) !== 0 && (domRect?.height ?? 0) !== 0) {
			callback(domRect as DOMRect)
		}
	}
}

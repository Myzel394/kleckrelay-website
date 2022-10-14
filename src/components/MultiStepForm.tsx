import React, {ReactElement, useEffect, useRef, useState} from "react"

import {Paper} from "@mui/material"

import {whenElementHasBounds} from "~/utils"

export interface MultiStepFormProps {
	steps: ReactElement[]
	index: number

	duration?: number
	easing?: string
}

function MultiStepForm({
	steps,
	index,
	duration = 900,
	easing = "ease-in-out",
}: MultiStepFormProps): ReactElement {
	const $currentElement = useRef<HTMLDivElement>(null)
	const $timeout = useRef<any>()

	const [currentIndex, setCurrentIndex] = useState<number>(index)

	const [currentSize, setCurrentSize] = useState<any>(null)
	const [nextSize, setNextSize] = useState<any>(null)

	const isTransitioning = currentIndex !== index

	useEffect(() => {
		if (index !== currentIndex) {
			$timeout.current = setTimeout(() => {
				setCurrentSize(null)
				setNextSize(null)
				setCurrentIndex(index)
			}, duration)
		}

		return $timeout.current?.cancel!
	}, [index, currentIndex])

	const hasSize = Boolean(
		(currentSize?.width || nextSize?.width) &&
			(currentSize?.height || nextSize?.height),
	)

	return (
		<div
			style={{
				position: "relative",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width:
					Math.max(currentSize?.width || 0, nextSize?.width || 0) ||
					"100%",
				height:
					Math.max(currentSize?.height || 0, nextSize?.height || 0) ||
					"100%",
				overflow: hasSize ? "hidden" : "visible",
			}}
		>
			<Paper
				key="paper"
				style={{
					...currentSize,
					position: "absolute",
					transition: easing,
					transitionDuration: isTransitioning
						? `${duration}ms`
						: "0ms",
					transformOrigin: isTransitioning
						? `${nextSize?.x - currentSize.x}px ${
								nextSize?.y - currentSize.y
						  }px`
						: "",
					// Scale the difference between currentSize and nextSize
					transform: isTransitioning
						? `
						scaleX(${nextSize.width / currentSize.width})
						scaleY(${nextSize.height / currentSize.height})
						translateX(${nextSize.x - currentSize.x}px)
						translateY(${nextSize.y - currentSize.y}px)
						 `
						: "scale(1)",
				}}
			></Paper>
			<div
				// @ts-ignore
				ref={ref => {
					if (ref === null) {
						return
					}

					// @ts-ignore
					$currentElement.current = ref

					const {
						width = 0,
						height = 0,
						x,
						y,
					} = ref.getBoundingClientRect()

					if (
						width !== 0 &&
						height !== 0 &&
						width !== currentSize?.width &&
						height !== currentSize?.height
					) {
						setCurrentSize({
							width: width,
							height: height,
							x: x,
							y: y,
						})
					}
				}}
				style={{
					position: "absolute",
					width: "max-content",
					height: "max-content",
					transition: easing,
					transitionDuration: isTransitioning ? `${duration}ms` : "",
					transform: isTransitioning ? "translateX(-100%)" : "",
				}}
			>
				{steps[currentIndex]}
			</div>
			<div
				// @ts-ignore
				ref={whenElementHasBounds(rect => {
					if (nextSize === null) {
						setNextSize({
							width: rect.width,
							height: rect.height,
							x: rect.x,
							y: rect.y,
						})
					}
				})}
				style={{
					position: "absolute",
					width: "max-content",
					height: "max-content",
					transition: easing,
					transitionDuration: isTransitioning ? `${duration}ms` : "",
					transform: isTransitioning
						? ""
						: nextSize?.x
						? "translateX(100%)"
						: "",
				}}
			>
				{currentIndex === steps.length - 1
					? null
					: steps[currentIndex + 1]}
			</div>
		</div>
	)
}

export default MultiStepForm

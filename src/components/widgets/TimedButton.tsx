import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import differenceInSeconds from "date-fns/differenceInSeconds"

import {LoadingButton, LoadingButtonProps} from "@mui/lab"

import {useIntervalUpdate} from "~/hooks"
import {isDev} from "~/constants/development"

export interface TimedButtonProps extends LoadingButtonProps {
	interval: number
}

export default function TimedButton({
	interval,
	children,
	onClick,
	disabled: parentDisabled = false,
	...props
}: TimedButtonProps): ReactElement {
	const {t} = useTranslation()

	const [startDate, resetInterval] = useIntervalUpdate(1000)

	const secondsPassed = differenceInSeconds(new Date(), startDate)
	const secondsLeft = (isDev ? 3 : interval) - secondsPassed

	return (
		<LoadingButton
			{...props}
			disabled={parentDisabled || secondsLeft > 0}
			onClick={event => {
				resetInterval()
				onClick?.(event)
			}}
		>
			<span>{children} </span>
			{secondsLeft > 0 && (
				<span>{t("components.TimedButton.remainingTime", {count: secondsLeft})}</span>
			)}
		</LoadingButton>
	)
}

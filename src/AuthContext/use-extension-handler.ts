import {useCallback, useRef, useState} from "react"
import {useNavigate} from "react-router-dom"
import {useEvent} from "react-use"

import {ExtensionKleckEvent} from "~/extension-types"
import {User} from "~/server-types"

export interface UseExtensionHandlerResult {
	sharePassword: () => void
	dispatchPasswordStatus: () => void
	closeDialog: (doNotAskAgain: boolean) => void
	showDialog: boolean
}

export default function useExtensionHandler(
	masterPassword: string,
	user: User,
): UseExtensionHandlerResult {
	const navigate = useNavigate()

	const $enterPasswordAmount = useRef<number>(0)

	const [doNotAskForPassword, setDoNotAskForPassword] = useState<boolean>(false)
	const [askForPassword, setAskForPassword] = useState<boolean>(false)

	const dispatchPasswordStatus = useCallback(() => {
		window.dispatchEvent(
			new CustomEvent("kleckrelay-blob", {
				detail: {
					type: "password-status",
					data: {
						status: (() => {
							if (doNotAskForPassword) {
								return "denied"
							}

							if (masterPassword) {
								return "can-ask"
							}

							return "not-entered"
						})(),
					},
				},
			}),
		)
	}, [doNotAskForPassword, masterPassword])

	// Handle extension password request
	const handleExtensionEvent = useCallback(
		(event: ExtensionKleckEvent) => {
			switch (event.detail.type) {
				case "password-status":
					dispatchPasswordStatus()
					break
				case "ask-for-password":
					setAskForPassword(true)
					break
				case "get-user":
					window.dispatchEvent(
						new CustomEvent("kleckrelay-blob", {
							detail: {
								type: "get-user",
								data: {
									user,
								},
							},
						}),
					)
					break
				case "enter-password":
					if ($enterPasswordAmount.current < 1) {
						$enterPasswordAmount.current += 1

						navigate("/enter-password")
					}

					break
			}
		},
		[dispatchPasswordStatus],
	)

	useEvent("kleckrelay-kleck", handleExtensionEvent)

	return {
		sharePassword: () => {
			setAskForPassword(false)

			if (doNotAskForPassword) {
				return
			}

			window.dispatchEvent(
				new CustomEvent("kleckrelay-blob", {
					detail: {
						type: "password",
						data: {
							password: masterPassword,
						},
					},
				}),
			)
		},
		dispatchPasswordStatus,
		closeDialog: (doNotAskAgain = false) => {
			setDoNotAskForPassword(doNotAskAgain)
			setAskForPassword(false)
		},
		showDialog: askForPassword && !doNotAskForPassword,
	}
}

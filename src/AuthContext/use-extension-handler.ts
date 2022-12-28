import {useCallback, useRef, useState} from "react"
import {useNavigate} from "react-router-dom"
import {useEvent} from "react-use"

import {ExtensionKleckEvent} from "~/extension-types"
import {User} from "~/server-types"
import {AUTHENTICATION_PATHS} from "~/constants/values"
import {queryClient} from "~/constants/react-query"

export interface UseExtensionHandlerResult {
	sharePassword: () => void
	dispatchPasswordStatus: () => void
	closeDialog: (doNotAskAgain: boolean) => void
	showDialog: boolean
}

export default function useExtensionHandler(
	encryptionPassword: string,
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

							if (encryptionPassword) {
								return "can-ask"
							}

							return "not-entered"
						})(),
					},
				},
			}),
		)
	}, [doNotAskForPassword, encryptionPassword])

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
									masterPasswordAvailable: Boolean(encryptionPassword),
								},
							},
						}),
					)
					break
				case "enter-password":
					if (
						$enterPasswordAmount.current < 1 &&
						!AUTHENTICATION_PATHS.includes(location.pathname)
					) {
						$enterPasswordAmount.current += 1

						navigate("/enter-password")
					}

					break
				case "refetch-aliases":
					if (document.visibilityState !== "visible") {
						return
					}

					;(async () => {
						await Promise.allSettled([
							queryClient.invalidateQueries({
								queryKey: ["get_alias"],
							}),
							queryClient.invalidateQueries({
								queryKey: ["get_aliases"],
							}),
						])
					})()
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
							password: encryptionPassword,
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

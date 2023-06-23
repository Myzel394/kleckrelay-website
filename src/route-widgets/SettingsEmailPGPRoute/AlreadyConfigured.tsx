import {AxiosError} from "axios"
import {useAsync} from "react-use"
import {readKey} from "openpgp"
import {FaLockOpen} from "react-icons/fa"
import {ReactElement, useContext} from "react"
import {useTranslation} from "react-i18next"

import {Alert, CircularProgress, Grid} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import {useMutation} from "@tanstack/react-query"

import {SimpleDetailResponse, User} from "~/server-types"
import {UpdatePreferencesData, updatePreferences} from "~/apis"
import {useErrorSuccessSnacks} from "~/hooks"
import {AuthContext} from "~/components"

export default function AlreadyConfigured(): ReactElement {
	const {t} = useTranslation(["settings-email-pgp", "common"])
	const {user, _updateUser} = useContext(AuthContext)
	const {showSuccess, showError} = useErrorSuccessSnacks()

	const {mutateAsync, isLoading} = useMutation<
		SimpleDetailResponse,
		AxiosError,
		UpdatePreferencesData
	>(updatePreferences, {
		onSuccess: (response, values) => {
			const newUser = {
				...user,
				preferences: {
					...user!.preferences,
					...values,
				},
			} as User

			if (response.detail) {
				showSuccess(response?.detail)
			}

			_updateUser(newUser)
		},
		onError: showError,
	})
	const {value: fingerprint, loading: isLoadingFingerprint} = useAsync(async () => {
		const key = await readKey({
			armoredKey: user!.preferences.emailGpgPublicKey!,
		})

		return key.getFingerprint()
	}, [user?.preferences?.emailGpgPublicKey])

	return (
		<Grid container spacing={4}>
			<Grid item>
				<Alert severity="success" variant="standard">
					{t("alreadyConfigured")}
					{isLoadingFingerprint ? <CircularProgress /> : <code>{fingerprint}</code>}
				</Alert>
			</Grid>
			<Grid item>
				<LoadingButton
					variant="contained"
					loading={isLoading}
					startIcon={<FaLockOpen />}
					onClick={() =>
						mutateAsync({
							emailGpgPublicKey: null,
						})
					}
				>
					{t("remove")}
				</LoadingButton>
			</Grid>
		</Grid>
	)
}

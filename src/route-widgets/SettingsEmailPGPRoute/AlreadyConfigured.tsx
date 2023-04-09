import {Alert, CircularProgress, Grid} from "@mui/material"
import {ReactElement, useContext} from "react"
import {useTranslation} from "react-i18next"
import {LoadingButton} from "@mui/lab"
import {SimpleDetailResponse, User} from "~/server-types"
import {UpdatePreferencesData, updatePreferences} from "~/apis"
import {useMutation} from "@tanstack/react-query"
import {AxiosError} from "axios"
import {useErrorSuccessSnacks} from "~/hooks"
import {AuthContext} from "~/components"
import {useAsync} from "react-use"
import {readKey} from "openpgp"

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
				</Alert>
				{isLoadingFingerprint ? <CircularProgress /> : <code>{fingerprint}</code>}
			</Grid>
			<Grid item>
				<LoadingButton
					variant="contained"
					loading={isLoading}
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

import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {MdContentCopy, MdDelete} from "react-icons/md"
import {useCopyToClipboard} from "react-use"

import {Alert, IconButton, ListItem, ListItemSecondaryAction, ListItemText} from "@mui/material"

import {APIKey} from "~/server-types"
import {DeleteButton, ErrorSnack, SuccessSnack} from "~/components"
import {deleteAPIKey} from "~/apis"
import {queryClient} from "~/constants/react-query"

export interface APIKeyListItemProps {
	apiKey: APIKey
	queryKey: readonly string[]
	privateKey?: string
}

export default function APIKeyListItem({
	queryKey,
	apiKey,
	privateKey,
}: APIKeyListItemProps): ReactElement {
	const {t} = useTranslation(["settings-api-keys", "common"])

	const [{value, error}, copy] = useCopyToClipboard()

	if (privateKey) {
		return (
			<>
				<Alert severity="success">
					<ListItem>
						<ListItemText>{privateKey}</ListItemText>
						<ListItemSecondaryAction>
							<IconButton edge="end" onClick={() => copy(privateKey)}>
								<MdContentCopy />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				</Alert>
				<SuccessSnack
					key={value}
					message={value && t("messages.apiKey.keyCopied", {ns: "common"})}
				/>
				<ErrorSnack message={error && t("messages.errors.copyFailed", {ns: "common"})} />
			</>
		)
	}

	return (
		<ListItem>
			<>
				<ListItemText primary={apiKey.label} secondary={apiKey.expiresAt.toString()} />
				<ListItemSecondaryAction>
					<DeleteButton
						onDelete={() => deleteAPIKey(apiKey.id)}
						onDone={() =>
							queryClient.invalidateQueries({
								queryKey,
							})
						}
						label={t("actions.delete.label")}
						description={t("actions.delete.description")}
						continueLabel={t("actions.delete.continueActionLabel")}
						successMessage={t("messages.apiKey.deleted", {ns: "common"})}
					>
						{onDelete => (
							<IconButton edge="end" onClick={onDelete}>
								<MdDelete />
							</IconButton>
						)}
					</DeleteButton>
				</ListItemSecondaryAction>
			</>
		</ListItem>
	)
}

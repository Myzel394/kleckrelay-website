import {ReactElement} from "react"
import {APIKey} from "~/server-types"
import {Alert, IconButton, ListItem, ListItemSecondaryAction, ListItemText} from "@mui/material"
import {useTranslation} from "react-i18next"
import {MdContentCopy, MdDelete} from "react-icons/md"
import {useCopyToClipboard} from "react-use"
import {ErrorSnack, SuccessSnack} from "~/components"

export interface APIKeyListItemProps {
	apiKey: APIKey
	privateKey?: string
}

export default function APIKeyListItem({apiKey, privateKey}: APIKeyListItemProps): ReactElement {
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
					<IconButton edge="end">
						<MdDelete />
					</IconButton>
				</ListItemSecondaryAction>
			</>
		</ListItem>
	)
}

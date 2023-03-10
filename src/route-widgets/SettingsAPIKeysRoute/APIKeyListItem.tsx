import {ReactElement} from "react"
import {APIKey} from "~/server-types"
import {IconButton, ListItem, ListItemSecondaryAction, ListItemText} from "@mui/material"
import {useTranslation} from "react-i18next"
import {MdDelete} from "react-icons/md"

export interface APIKeyListItemProps {
	apiKey: APIKey
}

export default function APIKeyListItem({apiKey}: APIKeyListItemProps): ReactElement {
	const {t} = useTranslation("settings-api-keys")

	return (
		<ListItem>
			<ListItemText primary={apiKey.label} secondary={apiKey.expiresAt.toString()} />
			<ListItemSecondaryAction>
				<IconButton edge="end">
					<MdDelete />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	)
}

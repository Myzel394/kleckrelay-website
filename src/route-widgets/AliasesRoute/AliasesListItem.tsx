import {ReactElement} from "react"
import {MdContentCopy, MdExtension} from "react-icons/md"
import {Link as RouterLink} from "react-router-dom"

import {ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText} from "@mui/material"

import {AliasTypeIndicator} from "~/components"
import {AliasList} from "~/server-types"

export interface AliasesListItemProps {
	alias: AliasList

	showExtensionIcon?: boolean
	onCopy?: (address: string) => void
}

const getAddress = (alias: AliasList): string => `${alias.local}@${alias.domain}`

export default function AliasesListItem({
	alias,
	showExtensionIcon,
	onCopy,
}: AliasesListItemProps): ReactElement {
	const isInCopyAddressMode = onCopy !== undefined
	const address = getAddress(alias)

	return (
		<ListItemButton
			// @ts-ignore
			component={isInCopyAddressMode ? undefined : RouterLink}
			key={alias.id}
			to={isInCopyAddressMode ? undefined : `/aliases/${btoa(address)}`}
			onClick={(event: any) => {
				if (isInCopyAddressMode) {
					event.preventDefault()
					event.stopPropagation()

					onCopy(address)
				}
			}}
		>
			<ListItemIcon>
				<AliasTypeIndicator type={alias.type} />
			</ListItemIcon>
			<ListItemText
				primary={
					<>
						<span>{alias.local}</span>
						<span style={{opacity: 0.5}}>@{alias.domain}</span>
					</>
				}
			/>
			{(() => {
				if (isInCopyAddressMode) {
					return (
						<ListItemSecondaryAction>
							<MdContentCopy />
						</ListItemSecondaryAction>
					)
				}

				if (showExtensionIcon) {
					return <MdExtension />
				}
			})()}
		</ListItemButton>
	)
}

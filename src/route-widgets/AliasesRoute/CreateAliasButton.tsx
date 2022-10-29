import {ReactElement, useState} from "react"
import {MdArrowDropDown} from "react-icons/md"
import {BsArrowClockwise} from "react-icons/bs"
import {FaPen} from "react-icons/fa"
import {AxiosError} from "axios"

import {
	Button,
	ButtonGroup,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	MenuList,
} from "@mui/material"
import {useMutation} from "@tanstack/react-query"

import {createAlias} from "~/apis"
import {Alias, AliasType} from "~/server-types"

export interface CreateAliasButtonProps {
	onRandomCreated: (alias: Alias) => void
	onCustomCreated: () => void
}

export default function CreateAliasButton({
	onRandomCreated,
	onCustomCreated,
}: CreateAliasButtonProps): ReactElement {
	const {mutate, isLoading} = useMutation<Alias, AxiosError, void>(
		() =>
			createAlias({
				type: AliasType.RANDOM,
			}),
		{
			onSuccess: onRandomCreated,
		},
	)

	const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)
	const open = Boolean(anchorElement)

	return (
		<>
			<ButtonGroup>
				<Button
					disabled={isLoading}
					startIcon={<BsArrowClockwise />}
					onClick={() => mutate()}
				>
					Create random alias
				</Button>
				<Button
					size="small"
					onClick={event => setAnchorElement(event.currentTarget)}
				>
					<MdArrowDropDown />
				</Button>
			</ButtonGroup>
			<Menu
				anchorEl={anchorElement}
				open={open}
				onClose={() => setAnchorElement(null)}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							setAnchorElement(null)
							onCustomCreated()
						}}
					>
						<ListItemIcon>
							<FaPen />
						</ListItemIcon>
						<ListItemText primary="Create Custom Alias" />
					</MenuItem>
				</MenuList>
			</Menu>
		</>
	)
}

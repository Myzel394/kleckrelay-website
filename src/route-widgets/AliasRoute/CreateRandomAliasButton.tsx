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

import {CreateAliasData, createAlias} from "~/apis"
import {Alias, AliasType} from "~/server-types"

export interface CreateRandomAliasButtonProps {
	onCreated: (alias: Alias) => void
}

export default function CreateRandomAliasButton({
	onCreated,
}: CreateRandomAliasButtonProps): ReactElement {
	const {mutate, isLoading} = useMutation<Alias, AxiosError, CreateAliasData>(
		createAlias,
		{
			onSuccess: onCreated,
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
					onClick={() =>
						mutate({
							type: AliasType.RANDOM,
						})
					}
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
					<MenuItem>
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

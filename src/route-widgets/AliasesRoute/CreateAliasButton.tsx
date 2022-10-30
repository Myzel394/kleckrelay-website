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
import {parseFastAPIError} from "~/utils"
import {ErrorSnack, SuccessSnack} from "~/components"
import CustomAliasDialog from "~/route-widgets/AliasesRoute/CustomAliasDialog"

export interface CreateAliasButtonProps {
	onCreated: (alias: Alias) => void
}

export default function CreateAliasButton({
	onCreated,
}: CreateAliasButtonProps): ReactElement {
	const [errorMessage, setErrorMessage] = useState<string>("")
	const {mutateAsync, isLoading, isSuccess} = useMutation<
		Alias,
		AxiosError,
		CreateAliasData
	>(values => createAlias(values), {
		onSuccess: onCreated,
		onError: error =>
			setErrorMessage(parseFastAPIError(error).detail as string),
	})

	const [showCustomCreateDialog, setShowCustomCreateDialog] =
		useState<boolean>(false)

	const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)
	const open = Boolean(anchorElement)

	return (
		<>
			<ButtonGroup>
				<Button
					disabled={isLoading}
					startIcon={<BsArrowClockwise />}
					onClick={() =>
						mutateAsync({
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
					<MenuItem
						disabled={isLoading}
						onClick={() => {
							setShowCustomCreateDialog(true)
							setAnchorElement(null)
						}}
					>
						<ListItemIcon>
							<FaPen />
						</ListItemIcon>
						<ListItemText primary="Create Custom Alias" />
					</MenuItem>
				</MenuList>
			</Menu>
			<CustomAliasDialog
				visible={showCustomCreateDialog}
				isLoading={isLoading}
				onCreate={async values => {
					await mutateAsync(values)
					setShowCustomCreateDialog(false)
				}}
				onClose={() => setShowCustomCreateDialog(false)}
			/>
			<ErrorSnack message={errorMessage} />
			<SuccessSnack
				message={isSuccess && "Created Alias successfully!"}
			/>
		</>
	)
}

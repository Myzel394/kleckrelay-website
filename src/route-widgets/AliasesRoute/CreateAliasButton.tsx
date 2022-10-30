import {ReactElement, useContext, useState} from "react"
import {MdArrowDropDown} from "react-icons/md"
import {BsArrowClockwise} from "react-icons/bs"
import {FaPen} from "react-icons/fa"
import {AxiosError} from "axios"
import update from "immutability-helper"

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
import {DEFAULT_ALIAS_NOTE} from "~/constants/values"
import AuthContext, {EncryptionStatus} from "~/AuthContext/AuthContext"
import CustomAliasDialog from "~/route-widgets/AliasesRoute/CustomAliasDialog"

export interface CreateAliasButtonProps {
	onCreated: (alias: Alias) => void
}

export default function CreateAliasButton({
	onCreated,
}: CreateAliasButtonProps): ReactElement {
	const {_encryptUsingMasterPassword, encryptionStatus} =
		useContext(AuthContext)

	const [errorMessage, setErrorMessage] = useState<string>("")

	const {mutateAsync, isLoading, isSuccess} = useMutation<
		Alias,
		AxiosError,
		CreateAliasData
	>(
		async values => {
			if (encryptionStatus === EncryptionStatus.Available) {
				values.encryptedNotes = await _encryptUsingMasterPassword(
					JSON.stringify(
						update(DEFAULT_ALIAS_NOTE, {
							data: {
								createdAt: {
									$set: new Date(),
								},
							},
						}),
					),
				)
			}

			return createAlias(values)
		},
		{
			onSuccess: onCreated,
			onError: error =>
				setErrorMessage(parseFastAPIError(error).detail as string),
		},
	)

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

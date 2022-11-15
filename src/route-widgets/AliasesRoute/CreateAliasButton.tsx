import {ReactElement, useContext, useRef, useState} from "react"
import {MdArrowDropDown} from "react-icons/md"
import {BsArrowClockwise} from "react-icons/bs"
import {FaPen} from "react-icons/fa"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import {SnackbarKey} from "notistack"
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
import {Alias, AliasList, AliasType, PaginationResult} from "~/server-types"
import {DEFAULT_ALIAS_NOTE} from "~/constants/values"
import {useErrorSuccessSnacks} from "~/hooks"
import {queryClient} from "~/constants/react-query"
import AuthContext, {EncryptionStatus} from "~/AuthContext/AuthContext"
import CustomAliasDialog from "~/route-widgets/AliasesRoute/CustomAliasDialog"

export function CreateAliasButton(): ReactElement {
	const {t} = useTranslation()
	const {showSuccess, showError} = useErrorSuccessSnacks()
	const {_encryptUsingMasterPassword, encryptionStatus} = useContext(AuthContext)

	const {mutateAsync, isLoading} = useMutation<Alias, AxiosError, CreateAliasData>(
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
			onError: showError,
			onSuccess: async alias => {
				showSuccess(t("relations.alias.mutations.success.aliasCreation"))

				await queryClient.cancelQueries({
					queryKey: ["get_aliases", ""],
				})

				queryClient.setQueryData<PaginationResult<AliasList>>(["get_aliases", ""], old => {
					if (old) {
						return update(old, {
							items: {
								$unshift: [alias],
							},
						})
					}

					return old
				})

				return alias
			},
		},
	)

	const [showCustomCreateDialog, setShowCustomCreateDialog] = useState<boolean>(false)

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
					{t("routes.AliasesRoute.actions.createRandomAlias.label")}
				</Button>
				<Button size="small" onClick={event => setAnchorElement(event.currentTarget)}>
					<MdArrowDropDown />
				</Button>
			</ButtonGroup>
			<Menu anchorEl={anchorElement} open={open} onClose={() => setAnchorElement(null)}>
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
						<ListItemText
							primary={t("routes.AliasesRoute.actions.createCustomAlias.label")}
						/>
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
		</>
	)
}

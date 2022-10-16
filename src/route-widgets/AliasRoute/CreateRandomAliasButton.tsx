import {ReactElement} from "react"
import {BsArrowClockwise} from "react-icons/bs"
import {AxiosError} from "axios"

import {Button} from "@mui/material"
import {useMutation} from "@tanstack/react-query"

import {CreateAliasData, createAlias} from "~/apis"
import {Alias, AliasType} from "~/server-types"

export interface CreateRandomAliasButtonProps {
	onCreated: (alias: Alias) => void
}

export default function CreateRandomAliasButton({
	onCreated,
}: CreateRandomAliasButtonProps): ReactElement {
	const {mutate} = useMutation<Alias, AxiosError, CreateAliasData>(
		createAlias,
		{
			onSuccess: onCreated,
		},
	)

	return (
		<Button
			startIcon={<BsArrowClockwise />}
			onClick={() =>
				mutate({
					type: AliasType.RANDOM,
				})
			}
		>
			Create random alias
		</Button>
	)
}

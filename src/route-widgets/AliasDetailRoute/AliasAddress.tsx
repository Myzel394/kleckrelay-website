import {useCopyToClipboard} from "react-use"
import {ReactElement} from "react"
import {MdContentCopy} from "react-icons/md"
import {useTranslation} from "react-i18next"

import {Button} from "@mui/material"

import {ErrorSnack, SuccessSnack} from "~/components"

export interface AliasAddressProps {
	address: string
}

export default function AliasAddress({address}: AliasAddressProps): ReactElement {
	const {t} = useTranslation()
	const [{value, error}, copyToClipboard] = useCopyToClipboard()

	return (
		<>
			<Button
				endIcon={<MdContentCopy />}
				variant="text"
				color="inherit"
				onClick={() => copyToClipboard(address)}
				sx={{textTransform: "none", fontWeight: "normal"}}
			>
				{address}
			</Button>
			<SuccessSnack
				key={value}
				message={value && t("relations.alias.mutations.success.addressCopiedToClipboard")}
			/>
			<ErrorSnack message={error && t("general.copyError")} />
		</>
	)
}

import {ReactElement} from "react"

import {DecryptionPasswordMissingAlert} from "~/components"

export default function WithEncryptionRequired(
	Component: any,
): (props: any) => ReactElement {
	return (props: any): ReactElement => {
		return (
			<DecryptionPasswordMissingAlert>
				<Component {...props} />
			</DecryptionPasswordMissingAlert>
		)
	}
}

import {ReactElement, useContext} from "react"

import {useEffectOnce} from "react-use"
import AuthContext from "~/AuthContext/AuthContext"

export default function ExtensionSignalHandler(): ReactElement {
	const {user} = useContext(AuthContext)
	const appDomain = import.meta.env.VITE_SERVER_BASE_URL
	const instanceData = {
		appDomain,
	}

	return (
		<script id="_#kleckrelay-instance-data" type="application/json">
			{JSON.stringify(instanceData)}
		</script>
	)
}

import {ReactElement} from "react"

export default function ExtensionSignalHandler(): ReactElement {
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

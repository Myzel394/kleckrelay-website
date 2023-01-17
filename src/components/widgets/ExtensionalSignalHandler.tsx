import {ReactElement} from "react"

export default function ExtensionSignalHandler(): ReactElement {
	const instanceData = {
		apiOrigin: import.meta.env.VITE_SERVER_BASE_URL,
	}

	return (
		<script id="_#kleckrelay-instance-data" type="application/json">
			{JSON.stringify(instanceData)}
		</script>
	)
}

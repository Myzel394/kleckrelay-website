import {client} from "~/constants/axios-client"

export default async function checkIsDomainDisposable(
	domain: string,
): Promise<boolean> {
	const {data} = await client.get(`https://api.mailcheck.ai/domain/${domain}`)

	return !data.mx || data.disposable
}

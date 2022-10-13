import axios from "axios"

export default async function checkIsDomainDisposable(
	domain: string,
): Promise<boolean> {
	const {data} = await axios.get(`https://api.mailcheck.ai/domain/${domain}`)

	return !data.mx || data.disposable
}

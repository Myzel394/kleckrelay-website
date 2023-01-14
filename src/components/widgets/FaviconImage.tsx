import React, {ReactElement, useState} from "react"

export interface FaviconImageProps
	extends Omit<
		React.DetailedHTMLProps<
			React.ImgHTMLAttributes<HTMLImageElement>,
			HTMLImageElement
		>,
		"src"
	> {
	url: string
}

const getDomain = (url: string): string => {
	const {hostname, port} = new URL(url)
	return `${hostname}${port ? `:${port}` : ""}`
}

export default function FaviconImage({
	url,
	...props
}: FaviconImageProps): ReactElement {
	const [source, setSource] = useState<string>(`${url}/favicon.ico`)

	return (
		<img
			{...props}
			src={source}
			onError={() =>
				setSource(
					`https://external-content.duckduckgo.com/ip3/${getDomain(
						url,
					)}.ico`,
				)
			}
		/>
	)
}

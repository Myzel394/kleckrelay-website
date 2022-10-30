import React, {ReactElement, useState} from "react"

export interface BackupImageProps
	extends Omit<
		React.DetailedHTMLProps<
			React.ImgHTMLAttributes<HTMLImageElement>,
			HTMLImageElement
		>,
		"src"
	> {
	fallbackSrc: string
	src: string
}

export default function BackupImage({
	fallbackSrc,
	src,
	...props
}: BackupImageProps): ReactElement {
	const [source, setSource] = useState<string>(src)

	return (
		<img {...props} src={source} onError={() => setSource(fallbackSrc)} />
	)
}

import {ImageProxyFormatType, ProxyUserAgentType} from "~/server-types"

export const IMAGE_PROXY_FORMAT_TYPE_NAME_MAP: Record<
	ImageProxyFormatType,
	string
> = {
	[ImageProxyFormatType.JPEG]: "JPEG",
	[ImageProxyFormatType.PNG]: "PNG",
	[ImageProxyFormatType.WEBP]: "WebP",
}

export const IMAGE_PROXY_USER_AGENT_TYPE_NAME_MAP: Record<
	ProxyUserAgentType,
	string
> = {
	[ProxyUserAgentType.APPLE_MAIL]: "Apple Mail",
	[ProxyUserAgentType.GOOGLE_MAIL]: "Google Mail",
	[ProxyUserAgentType.CHROME]: "Chrome Browser",
	[ProxyUserAgentType.FIREFOX]: "Firefox Browser",
	[ProxyUserAgentType.OUTLOOK_MACOS]: "Outlook / MacOS",
	[ProxyUserAgentType.OUTLOOK_WINDOWS]: "Outlook / Windows",
}

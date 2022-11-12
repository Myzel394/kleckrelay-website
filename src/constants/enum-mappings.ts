import {ImageProxyFormatType, ProxyUserAgentType} from "~/server-types"
import {createEnumMapFromTranslation} from "~/utils"

export const IMAGE_PROXY_FORMAT_TYPE_NAME_MAP = createEnumMapFromTranslation(
	"relations.alias.settings.imageProxyFormat.enumTexts",
	ImageProxyFormatType,
)
export const PROXY_USER_AGENT_TYPE_NAME_MAP = createEnumMapFromTranslation(
	"relations.alias.settings.proxyUserAgent.enumTexts",
	ProxyUserAgentType,
)

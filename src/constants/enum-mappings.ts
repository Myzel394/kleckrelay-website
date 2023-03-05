import {ImageProxyFormatType, ProxyUserAgentType} from "~/server-types"
import {createEnumMapFromTranslation} from "~/utils"

export const IMAGE_PROXY_FORMAT_TYPE_NAME_MAP = createEnumMapFromTranslation(
	"settings.fields.imageProxyFormat.values",
	ImageProxyFormatType,
)
export const PROXY_USER_AGENT_TYPE_NAME_MAP = createEnumMapFromTranslation(
	"settings.fields.proxyUserAgent.values",
	ProxyUserAgentType,
)

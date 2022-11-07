interface OSUrls {
	android: string
	// No ios support
}

const createUrl = (url: string, packageName: string): string =>
	`intent://${url}#Intent;scheme=https;package=${packageName};end`

const APP_LINK_MAP: Record<string, OSUrls> = {
	"googlemail.com": {
		android: createUrl("mail.google.com", "com.google.android.gm"),
	},
	"gmail.com": {
		android: createUrl("mail.google.com", "com.google.android.gm"),
	},
	"gmx.net": {
		android: createUrl("gmx.net", "de-DE.gmx.mobile.android.mail"),
	},
	"web.de": {
		android: createUrl("web.de", "de-DE.web.mobile.android.mail"),
	},
	"t-online.de": {
		android: createUrl("t-online.de", "de-DE.telekom.mail"),
	},
	"magenta.de": {
		android: createUrl("t-online.de", "de-DE.telekom.mail"),
	},
	"outlook.com": {
		android: createUrl("outlook.com", "com.microsoft.office.outlook"),
	},
	"yahoo.com": {
		android: createUrl("mail.yahoo.com", "com.yahoo.mobile.client.android.mai"),
	},
}

export default APP_LINK_MAP

import {AdminSettings} from "~/server-types"

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
	randomEmailIdMinLength: 6,
	randomEmailIdChars: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
	randomEmailLengthIncreaseOnPercentage: 0.0005,
	customEmailSuffixLength: 4,
	customEmailSuffixChars: "0123456789",
	userEmailEnableOtherRelays: true,
	userEmailEnableDisposableEmails: false,
	imageProxyStorageLifeTimeInHours: 24,
	enableImageProxy: true,
	enableImageProxyStorage: true,
	allowStatistics: true,
	allowAliasDeletion: false,
	maxAliasesPerUser: 0,
}

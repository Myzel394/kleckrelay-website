import {ReactElement, useContext} from "react"
import {BiStats} from "react-icons/bi"
import {MdSettings, MdTextSnippet} from "react-icons/md"
import {FaMask, FaServer} from "react-icons/fa"
import {Link as RouterLink, useLocation} from "react-router-dom"
import {useTranslation} from "react-i18next"

import {Button} from "@mui/material"

import {LockNavigationContext} from "~/components"

export enum NavigationSection {
	Overview,
	Aliases,
	Reports,
	Settings,
	Admin,
}

export interface NavigationButtonProps {
	section: NavigationSection
}

const SECTION_ICON_MAP: Record<NavigationSection, ReactElement> = {
	[NavigationSection.Overview]: <BiStats />,
	[NavigationSection.Aliases]: <FaMask />,
	[NavigationSection.Reports]: <MdTextSnippet />,
	[NavigationSection.Settings]: <MdSettings />,
	[NavigationSection.Admin]: <FaServer />,
}

const SECTION_TEXT_MAP: Record<NavigationSection, string> = {
	[NavigationSection.Overview]: "components.NavigationButton.overview",
	[NavigationSection.Aliases]: "components.NavigationButton.aliases",
	[NavigationSection.Reports]: "components.NavigationButton.reports",
	[NavigationSection.Settings]: "components.NavigationButton.settings",
	[NavigationSection.Admin]: "components.NavigationButton.admin",
}

const PATH_SECTION_MAP: Record<string, NavigationSection> = {
	"": NavigationSection.Overview,
	aliases: NavigationSection.Aliases,
	reports: NavigationSection.Reports,
	settings: NavigationSection.Settings,
	admin: NavigationSection.Admin,
}

export default function NavigationButton({section}: NavigationButtonProps): ReactElement {
	const {t} = useTranslation()
	const {handleAnchorClick} = useContext(LockNavigationContext)
	const location = useLocation()

	const currentSection = PATH_SECTION_MAP[location.pathname.split("/")[1]]
	const Icon = SECTION_ICON_MAP[section]
	const text = t(SECTION_TEXT_MAP[section])

	return (
		<Button
			fullWidth
			color="inherit"
			variant={section === currentSection ? "outlined" : "text"}
			startIcon={Icon}
			component={RouterLink}
			to={
				Object.keys(PATH_SECTION_MAP).find(path => PATH_SECTION_MAP[path] === section) ??
				"/"
			}
			onClick={handleAnchorClick}
		>
			{text}
		</Button>
	)
}

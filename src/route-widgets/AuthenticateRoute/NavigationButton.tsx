import {ReactElement} from "react"
import {BiStats} from "react-icons/bi"
import {MdMail, MdSettings} from "react-icons/md"
import {IoMdDocument} from "react-icons/io"
import {Link as RouterLink, useLocation} from "react-router-dom"

import {Button} from "@mui/material"

export enum NavigationSection {
	Overview,
	Aliases,
	Reports,
	Settings,
}

export interface NavigationButtonProps {
	section: NavigationSection
}

const SECTION_ICON_MAP: Record<NavigationSection, ReactElement> = {
	[NavigationSection.Overview]: <BiStats />,
	[NavigationSection.Aliases]: <MdMail />,
	[NavigationSection.Reports]: <IoMdDocument />,
	[NavigationSection.Settings]: <MdSettings />,
}

const SECTION_TEXT_MAP: Record<NavigationSection, string> = {
	[NavigationSection.Overview]: "Overview",
	[NavigationSection.Aliases]: "Aliases",
	[NavigationSection.Reports]: "Reports",
	[NavigationSection.Settings]: "Settings",
}

const PATH_SECTION_MAP: Record<string, NavigationSection> = {
	"/": NavigationSection.Overview,
	"/aliases": NavigationSection.Aliases,
	"/reports": NavigationSection.Reports,
	"/settings": NavigationSection.Settings,
}

export default function NavigationButton({
	section,
}: NavigationButtonProps): ReactElement {
	const location = useLocation()

	const currentSection = PATH_SECTION_MAP[location.pathname]
	const Icon = SECTION_ICON_MAP[section]
	const text = SECTION_TEXT_MAP[section]

	return (
		<Button
			fullWidth
			color="inherit"
			variant={section === currentSection ? "outlined" : "text"}
			startIcon={Icon}
			component={RouterLink}
			to={
				Object.keys(PATH_SECTION_MAP).find(
					path => PATH_SECTION_MAP[path] === section,
				) ?? "/"
			}
		>
			{text}
		</Button>
	)
}

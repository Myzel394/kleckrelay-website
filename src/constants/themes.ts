import {createTheme} from "@mui/material"

export const lightTheme = createTheme()

export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		secondary: {
			main: "#ACF",
			contrastText: "#FFF",
		},
	},
})

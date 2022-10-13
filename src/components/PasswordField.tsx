import {
	IconButton,
	InputAdornment,
	TextField,
	TextFieldProps,
} from "@mui/material"
import {ReactElement, useState} from "react"
import {MdVisibility, MdVisibilityOff} from "react-icons/md"

export interface PasswordFieldProps extends Omit<TextFieldProps, "type"> {}

export default function PasswordField({
	InputProps = {},
	...props
}: PasswordFieldProps): ReactElement {
	const [showPassword, setShowPassword] = useState<boolean>(false)

	return (
		<TextField
			{...props}
			type={showPassword ? "text" : "password"}
			InputProps={{
				...InputProps,
				endAdornment: (
					<InputAdornment position="end">
						<IconButton
							edge="end"
							onClick={() => setShowPassword(value => !value)}
						>
							{showPassword ? (
								<MdVisibilityOff />
							) : (
								<MdVisibility />
							)}
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	)
}

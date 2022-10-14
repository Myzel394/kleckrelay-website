import {MdChevronRight} from "react-icons/md"
import {TiCancel} from "react-icons/ti"
import React, {ReactElement, useEffect, useState} from "react"

import {
	Alert,
	Button,
	Grid,
	Snackbar,
	Typography,
	TypographyProps,
} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import {OverrideProps} from "@mui/types"

export interface SimpleFormProps {
	title: string
	description: string
	continueActionLabel: string

	children?: ReactElement[]
	cancelActionLabel?: string
	isSubmitting?: boolean
	titleVariant?: TypographyProps["variant"]
	titleComponent?: OverrideProps<any, any>["component"]
	nonFieldError?: string
}

export default function SimpleForm({
	title,
	description,
	children,
	continueActionLabel,
	cancelActionLabel,
	nonFieldError,
	titleVariant = "h4",
	titleComponent = "h1",
	isSubmitting = false,
}: SimpleFormProps): ReactElement {
	const [showSnackbar, setShowSnackbar] = useState<boolean>(false)

	useEffect(() => {
		if (nonFieldError) {
			setShowSnackbar(true)
		}
	}, [nonFieldError])

	return (
		<>
			<Grid
				container
				spacing={4}
				paddingX={2}
				paddingY={4}
				alignItems="center"
				justifyContent="center"
			>
				<Grid item>
					<Grid container spacing={2} direction="column">
						<Grid item>
							<Typography
								variant={titleVariant}
								component={titleComponent}
								align="center"
							>
								{title}
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="subtitle1" component="p">
								{description}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
				{children && (
					<Grid item>
						<Grid container spacing={3}>
							{children.map(input => (
								<Grid item key={input.key}>
									{input}
								</Grid>
							))}
						</Grid>
					</Grid>
				)}
				<Grid item>
					<Grid
						container
						justifyContent={
							cancelActionLabel ? "space-between" : "center"
						}
					>
						{cancelActionLabel && (
							<Grid item>
								<Button
									disabled={isSubmitting}
									startIcon={<TiCancel />}
									color="secondary"
								>
									{cancelActionLabel}
								</Button>
							</Grid>
						)}
						<Grid item>
							<LoadingButton
								loading={isSubmitting}
								variant="contained"
								type="submit"
								startIcon={<MdChevronRight />}
							>
								{continueActionLabel}
							</LoadingButton>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Snackbar
				open={showSnackbar}
				onClose={() => setShowSnackbar(false)}
				autoHideDuration={5000}
			>
				<Alert severity="error" variant="filled">
					{nonFieldError}
				</Alert>
			</Snackbar>
		</>
	)
}

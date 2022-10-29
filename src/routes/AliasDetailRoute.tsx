import {ReactElement} from "react"
import {useParams} from "react-router-dom"
import {AxiosError} from "axios"

import {useQuery} from "@tanstack/react-query"
import {Grid, Typography} from "@mui/material"

import {getAlias} from "~/apis"
import {Alias} from "~/server-types"
import AliasPreferencesForm from "~/route-widgets/AliasDetailRoute/AliasPreferencesForm"
import QueryResult from "~/components/QueryResult"
import SimplePage from "~/components/SimplePage"

export default function AliasDetailRoute(): ReactElement {
	const params = useParams()
	const address = atob(params.addressInBase64 as string)

	const query = useQuery<Alias, AxiosError>(
		["get_alias", params.addressInBase64],
		() => getAlias(address),
	)

	return (
		<SimplePage title="Alias Details">
			<QueryResult<Alias> query={query}>
				{alias => (
					<Grid container spacing={4}>
						<Grid item>
							<Typography variant="subtitle1">
								{address}
							</Typography>
						</Grid>
						<Grid item>
							<Grid container spacing={4}>
								<Grid item>
									<Typography variant="h6">
										Settings
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant="body1">
										These settings apply to this alias only.
										You can either set a value manually or
										refer to your defaults settings. Note
										that this does change in behavior. When
										you set a value to refer to your default
										setting, the alias will always use the
										latest value. So when you change your
										default setting, the alias will
										automatically use the new value.
									</Typography>
								</Grid>
								<Grid item>
									<AliasPreferencesForm alias={alias} />
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				)}
			</QueryResult>
		</SimplePage>
	)
}

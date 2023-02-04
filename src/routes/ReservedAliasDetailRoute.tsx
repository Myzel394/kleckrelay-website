import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {useParams} from "react-router-dom"
import {AxiosError} from "axios"

import {useQuery} from "@tanstack/react-query"
import {Grid} from "@mui/material"

import {QueryResult, SimplePage, SimplePageBuilder} from "~/components"
import {ReservedAlias} from "~/server-types"
import {getReservedAlias} from "~/apis"
import AliasActivationSwitch from "~/route-widgets/ReservedAliasDetailRoute/AliasActivationSwitch"
import AliasAddress from "~/route-widgets/AliasDetailRoute/AliasAddress"
import AliasUsersList from "~/route-widgets/ReservedAliasDetailRoute/AliasUsersList"

export default function ReservedAliasDetailRoute(): ReactElement {
	const {t} = useTranslation()
	const params = useParams()
	const queryKey = ["get_reserved_alias", params.id!]

	const query = useQuery<ReservedAlias, AxiosError>(queryKey, () => getReservedAlias(params.id!))

	return (
		<SimplePage title={t("routes.ReservedAliasDetailRoute.title")}>
			<QueryResult<ReservedAlias, AxiosError> query={query}>
				{alias => (
					<SimplePageBuilder.MultipleSections>
						{[
							<Grid
								key="basic"
								container
								spacing={1}
								direction="row"
								alignItems="center"
							>
								<Grid item>
									<AliasAddress address={`${alias.local}@${alias.domain}`} />
								</Grid>
								<Grid item>
									<AliasActivationSwitch
										id={alias.id}
										isActive={alias.isActive}
										queryKey={queryKey}
									/>
								</Grid>
							</Grid>,
							<AliasUsersList
								key="users"
								users={alias.users}
								id={alias.id}
								queryKey={queryKey}
							/>,
						]}
					</SimplePageBuilder.MultipleSections>
				)}
			</QueryResult>
		</SimplePage>
	)
}

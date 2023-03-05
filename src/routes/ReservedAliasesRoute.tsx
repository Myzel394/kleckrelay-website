import {ReactElement, useState, useTransition} from "react"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import {MdAdd, MdSearch} from "react-icons/md"
import {Link} from "react-router-dom"

import {
	Button,
	InputAdornment,
	List,
	ListItemButton,
	ListItemSecondaryAction,
	ListItemText,
	Switch,
	TextField,
} from "@mui/material"
import {useQuery} from "@tanstack/react-query"

import {PaginationResult, ReservedAlias} from "~/server-types"
import {getReservedAliases} from "~/apis"
import {NoSearchResults, QueryResult, SimplePage} from "~/components"
import EmptyStateScreen from "~/route-widgets/ReservedAliasesRoute/EmptyStateScreen"

export default function ReservedAliasesRoute(): ReactElement {
	const {t} = useTranslation(["admin-reserved-aliases", "common"])
	const [showSearch, setShowSearch] = useState<boolean>(false)
	const [searchValue, setSearchValue] = useState<string>("")
	const [queryValue, setQueryValue] = useState<string>("")
	const [, startTransition] = useTransition()
	const query = useQuery<PaginationResult<ReservedAlias>, AxiosError>(
		["getReservedAliases", {queryValue}],
		() =>
			getReservedAliases({
				query: queryValue,
			}),
		{
			onSuccess: ({items}) => {
				if (items.length) {
					setShowSearch(true)
				}
			},
		},
	)

	return (
		<SimplePage
			title={t("title")}
			pageOptionsActions={
				showSearch && (
					<TextField
						key="search"
						fullWidth
						value={searchValue}
						onChange={event => {
							setSearchValue(event.target.value)
							startTransition(() => {
								setQueryValue(event.target.value)
							})
						}}
						label={t("fields.search.label", {ns: "common"})}
						placeholder={t("pageActions.search.placeholder")}
						id="search"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<MdSearch />
								</InputAdornment>
							),
						}}
					/>
				)
			}
			actions={
				<Button
					component={Link}
					startIcon={<MdAdd />}
					to="/admin/reserved-aliases/create"
					variant="contained"
				>
					{t("actions.create.label")}
				</Button>
			}
		>
			<QueryResult<PaginationResult<ReservedAlias>, AxiosError> query={query}>
				{({items: aliases}) => {
					if (aliases.length === 0) {
						if (searchValue === "") {
							return <EmptyStateScreen />
						} else {
							return <NoSearchResults />
						}
					}

					return (
						<List>
							{aliases.map(alias => (
								<ListItemButton
									to={`/admin/reserved-aliases/${alias.id}`}
									component={Link}
									key={alias.id}
								>
									<ListItemText
										primary={
											<>
												<span>{alias.local}</span>
												<span style={{opacity: 0.4}}>@{alias.domain}</span>
											</>
										}
										secondary={t("userAmount", {
											count: alias.users.length,
										})}
									/>
									<ListItemSecondaryAction>
										<Switch checked={alias.isActive} />
									</ListItemSecondaryAction>
								</ListItemButton>
							))}
						</List>
					)
				}}
			</QueryResult>
		</SimplePage>
	)
}

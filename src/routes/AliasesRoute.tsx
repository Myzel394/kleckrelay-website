import {ReactElement, useState, useTransition} from "react"
import {AxiosError} from "axios"
import {MdSearch} from "react-icons/md"
import {useTranslation} from "react-i18next"
import {useCopyToClipboard, useKeyPress, useUpdateEffect} from "react-use"

import {useQuery} from "@tanstack/react-query"
import {
	Alert,
	Chip,
	Divider,
	Grid,
	InputAdornment,
	List,
	Snackbar,
	TextField,
	ToggleButton,
} from "@mui/material"

import {AliasList, AliasType, PaginationResult} from "~/server-types"
import {
	ALIAS_TYPE_ICON_MAP,
	ErrorSnack,
	NoSearchResults,
	QueryResult,
	SimplePage,
	SuccessSnack,
} from "~/components"
import {useIsAnyInputFocused} from "~/hooks"
import {CreateAliasButton} from "~/route-widgets/AliasesRoute/CreateAliasButton"
import AliasesListItem from "~/route-widgets/AliasesRoute/AliasesListItem"
import EmptyStateScreen from "~/route-widgets/AliasesRoute/EmptyStateScreen"
import getAliases from "~/apis/get-aliases"

enum SearchFilter {
	All = "all",
	Active = "active",
	Inactive = "inactive",
}

enum TypeFilter {
	All = "all",
	Custom = "custom",
	Random = "random",
}

export default function AliasesRoute(): ReactElement {
	const {t} = useTranslation()

	const [searchValue, setSearchValue] = useState<string>("")
	const [queryValue, setQueryValue] = useState<string>("")
	const [, startTransition] = useTransition()
	const [showSearch, setShowSearch] = useState<boolean>(false)
	const [searchFilter, setSearchFilter] = useState<SearchFilter>(SearchFilter.All)
	const [typeFilter, setTypeFilter] = useState<TypeFilter>(TypeFilter.All)

	const [{value, error}, copyToClipboard] = useCopyToClipboard()
	const [isPressingControl] = useKeyPress("Shift")
	const isAnyInputFocused = useIsAnyInputFocused()
	const [lockDisabledCopyMode, setLockDisabledCopyMode] = useState<boolean>(false)
	const isInCopyAddressMode = !isAnyInputFocused && !lockDisabledCopyMode && isPressingControl

	const query = useQuery<PaginationResult<AliasList>, AxiosError>(
		["get_aliases", queryValue, searchFilter, typeFilter],
		() =>
			getAliases({
				query: queryValue,
				active: (() => {
					switch (searchFilter) {
						case SearchFilter.All:
							return undefined
						case SearchFilter.Active:
							return true
						case SearchFilter.Inactive:
							return false
					}
				})(),
				type: (() => {
					switch (typeFilter) {
						case TypeFilter.All:
							return undefined
						case TypeFilter.Custom:
							return AliasType.CUSTOM
						case TypeFilter.Random:
							return AliasType.RANDOM
					}
				})(),
			}),
		{
			onSuccess: ({items}) => {
				if (items.length) {
					setShowSearch(true)
					setSearchFilter(SearchFilter.All)
					setTypeFilter(TypeFilter.All)
				}
			},
		},
	)

	useUpdateEffect(() => {
		if (!isPressingControl) {
			setLockDisabledCopyMode(false)
		}
	}, [isPressingControl])

	return (
		<SimplePage
			title={t("routes.AliasesRoute.title")}
			pageOptionsActions={
				showSearch && (
					<Grid container spacing={2} direction="column">
						<Grid item>
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
								label={t("routes.AliasesRoute.pageActions.search.label")}
								placeholder={t(
									"routes.AliasesRoute.pageActions.search.placeholder",
								)}
								id="search"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<MdSearch />
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item>
							<Grid container justifyContent="space-between">
								<Grid item>
									<Grid container spacing={1}>
										<Grid item>
											<Chip
												label={t(
													"routes.AliasesRoute.pageActions.searchFilter.active",
												)}
												variant={
													searchFilter === SearchFilter.Active
														? "filled"
														: "outlined"
												}
												onClick={() =>
													setSearchFilter(value => {
														if (value === SearchFilter.Active) {
															return SearchFilter.All
														}

														return SearchFilter.Active
													})
												}
											/>
										</Grid>
										<Grid item>
											<Chip
												label={t(
													"routes.AliasesRoute.pageActions.searchFilter.inactive",
												)}
												variant={
													searchFilter === SearchFilter.Inactive
														? "filled"
														: "outlined"
												}
												onClick={() =>
													setSearchFilter(value => {
														if (value === SearchFilter.Inactive) {
															return SearchFilter.All
														}

														return SearchFilter.Inactive
													})
												}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item>
									<Grid container spacing={1}>
										<Grid item>
											<Chip
												icon={ALIAS_TYPE_ICON_MAP[AliasType.CUSTOM]}
												label={t(
													"routes.AliasesRoute.pageActions.typeFilter.custom",
												)}
												variant={
													typeFilter === TypeFilter.Custom
														? "filled"
														: "outlined"
												}
												onClick={() =>
													setTypeFilter(value => {
														if (value === TypeFilter.Custom) {
															return TypeFilter.All
														}

														return TypeFilter.Custom
													})
												}
											/>
										</Grid>
										<Grid item>
											<Chip
												icon={ALIAS_TYPE_ICON_MAP[AliasType.RANDOM]}
												label={t(
													"routes.AliasesRoute.pageActions.typeFilter.random",
												)}
												variant={
													typeFilter === TypeFilter.Random
														? "filled"
														: "outlined"
												}
												onClick={() =>
													setTypeFilter(value => {
														if (value === TypeFilter.Random) {
															return TypeFilter.All
														}

														return TypeFilter.Random
													})
												}
											/>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				)
			}
		>
			<QueryResult<PaginationResult<AliasList>, AxiosError> query={query}>
				{({items: aliases}) => (
					<>
						<Grid container spacing={4} direction="column">
							<Grid item>
								{(() => {
									if (aliases.length === 0) {
										if (
											searchValue === "" &&
											searchFilter === SearchFilter.All &&
											typeFilter === TypeFilter.All
										) {
											return <EmptyStateScreen />
										} else {
											return <NoSearchResults />
										}
									}

									return (
										<List>
											{aliases.map(alias => (
												<AliasesListItem
													alias={alias}
													key={alias.id}
													onCopy={
														isInCopyAddressMode
															? alias => {
																	copyToClipboard(alias)
																	setLockDisabledCopyMode(true)
															  }
															: undefined
													}
												/>
											))}
										</List>
									)
								})()}
							</Grid>
							<Grid item>
								<CreateAliasButton />
							</Grid>
						</Grid>
						<SuccessSnack
							key={value}
							message={
								value &&
								t("relations.alias.mutations.success.addressCopiedToClipboard")
							}
						/>
						<ErrorSnack message={error && t("general.copyError")} />
						<Snackbar open={isInCopyAddressMode} autoHideDuration={null}>
							<Alert variant="standard" severity="info">
								{t("routes.AliasesRoute.isInCopyMode")}
							</Alert>
						</Snackbar>
					</>
				)}
			</QueryResult>
		</SimplePage>
	)
}

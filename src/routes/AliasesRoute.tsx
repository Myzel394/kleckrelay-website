import {ReactElement, useState, useTransition} from "react"
import {AxiosError} from "axios"
import {MdSearch} from "react-icons/md"
import {useTranslation} from "react-i18next"
import {useCopyToClipboard, useKeyPress, useUpdateEffect} from "react-use"

import {useQuery} from "@tanstack/react-query"
import {Alert, Grid, InputAdornment, List, Snackbar, TextField} from "@mui/material"

import {AliasList, PaginationResult} from "~/server-types"
import {ErrorSnack, NoSearchResults, QueryResult, SimplePage, SuccessSnack} from "~/components"
import {useIsAnyInputFocused} from "~/hooks"
import {CreateAliasButton} from "~/route-widgets/AliasesRoute/CreateAliasButton"
import AliasesListItem from "~/route-widgets/AliasesRoute/AliasesListItem"
import EmptyStateScreen from "~/route-widgets/AliasesRoute/EmptyStateScreen"
import getAliases from "~/apis/get-aliases"

export default function AliasesRoute(): ReactElement {
	const {t} = useTranslation()

	const [searchValue, setSearchValue] = useState<string>("")
	const [queryValue, setQueryValue] = useState<string>("")
	const [, startTransition] = useTransition()
	const [showSearch, setShowSearch] = useState<boolean>(false)

	const [{value, error}, copyToClipboard] = useCopyToClipboard()
	const [isPressingControl] = useKeyPress("Shift")
	const isAnyInputFocused = useIsAnyInputFocused()
	const [lockDisabledCopyMode, setLockDisabledCopyMode] = useState<boolean>(false)
	const isInCopyAddressMode = !isAnyInputFocused && !lockDisabledCopyMode && isPressingControl

	const query = useQuery<PaginationResult<AliasList>, AxiosError>(
		["get_aliases", queryValue],
		() =>
			getAliases({
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
					<TextField
						key="search"
						value={searchValue}
						onChange={event => {
							setSearchValue(event.target.value)
							startTransition(() => {
								setQueryValue(event.target.value)
							})
						}}
						label={t("routes.AliasesRoute.pageActions.search.label")}
						placeholder={t("routes.AliasesRoute.pageActions.search.placeholder")}
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
		>
			<QueryResult<PaginationResult<AliasList>, AxiosError> query={query}>
				{({items: aliases}) => (
					<>
						<Grid container spacing={4} direction="column">
							<Grid item>
								{(() => {
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

import {ReactElement} from "react"
import {AxiosError} from "axios"

import {UseQueryResult} from "@tanstack/react-query"

import {ErrorLoadingDataMessage} from "~/components/index"
import {parseFastAPIError} from "~/utils"

import LoadingData from "./LoadingData"

export interface QueryResultProps<TQueryFnData = unknown, TError = AxiosError> {
	query: UseQueryResult<TQueryFnData, TError>
	children: (data: TQueryFnData) => ReactElement
}

export default function QueryResult<TQueryFnData, TError = AxiosError>({
	query,
	children: render,
}: QueryResultProps<TQueryFnData, TError>): ReactElement {
	if (query.data) {
		return render(query.data)
	}

	if (query.isLoading) {
		return <LoadingData />
	}

	if (query.error) {
		return (
			<ErrorLoadingDataMessage
				message={parseFastAPIError(query.error as any as AxiosError).detail as string}
				onRetry={query.refetch}
			/>
		)
	}

	return <></>
}

import {FormikContextType} from "formik"
import {useContext, useEffect} from "react"

import LockNavigationContext from "./LockNavigationContext"

export interface LockNavigationContextProviderProps {
	formik: FormikContextType<any>
}

export default function FormikAutoLockNavigation({
	formik,
}: LockNavigationContextProviderProps): null {
	const {lock, release} = useContext(LockNavigationContext)

	const valuesStringified = JSON.stringify(formik.values)
	const initialValuesStringified = JSON.stringify(formik.initialValues)

	useEffect(() => {
		if (valuesStringified !== initialValuesStringified) {
			lock()
		} else {
			release()
		}
	}, [lock, release, valuesStringified, initialValuesStringified])

	return null
}

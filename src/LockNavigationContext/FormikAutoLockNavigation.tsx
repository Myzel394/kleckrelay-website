import {FormikContextType} from "formik"
import {useContext} from "react"
import {useDeepCompareEffect} from "react-use"
import deepEqual from "deep-equal"

import LockNavigationContext from "./LockNavigationContext"

export interface LockNavigationContextProviderProps {
	formik: FormikContextType<any>
}

export default function FormikAutoLockNavigation({
	formik,
}: LockNavigationContextProviderProps): null {
	const {lock, release} = useContext(LockNavigationContext)

	// TODO: Not working yet
	useDeepCompareEffect(() => {
		if (!deepEqual(formik.values, formik.initialValues)) {
			lock()
		} else {
			release()
		}
	}, [lock, release, formik.values, formik.initialValues])

	return null
}

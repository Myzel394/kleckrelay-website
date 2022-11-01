import {FormikContextType} from "formik"
import {useContext} from "react"
import {useShallowCompareEffect} from "react-use"
import deepEqual from "deep-equal"

import LockNavigationContext from "./LockNavigationContext"

export interface LockNavigationContextProviderProps {
	formik: FormikContextType<any>

	active?: boolean
}

export default function FormikAutoLockNavigation({
	formik,
	active = true,
}: LockNavigationContextProviderProps): null {
	const {lock, release} = useContext(LockNavigationContext)

	useShallowCompareEffect(() => {
		if (!deepEqual(formik.values, formik.initialValues) && active) {
			lock()
		} else {
			release()
		}
	}, [lock, release, formik.values, formik.initialValues, formik.isSubmitting, active])

	return null
}

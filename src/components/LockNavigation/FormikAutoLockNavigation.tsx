import {FormikContextType} from "formik"
import {useContext} from "react"
import deepEqual from "deep-equal"

import {useUpdateEffect} from "@react-hookz/web"

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

	useUpdateEffect(() => {
		if (!deepEqual(formik.values, formik.initialValues) && active) {
			lock()
		} else {
			release()
		}
	}, [lock, release, formik.values, formik.initialValues, formik.isSubmitting, active])

	return null
}

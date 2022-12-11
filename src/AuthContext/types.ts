import {ServerUser, User} from "~/server-types"

export interface ActionSetUser {
	type: "SET_USER"
	payload: User | ServerUser
}

export interface ActionSetPassword {
	type: "SET_PASSWORD"
	payload: string
}

export interface ActionLogout {
	type: "LOGOUT"
	payload?: null
}

export type Action = ActionSetUser | ActionSetPassword | ActionLogout

export interface State {
	user: User | ServerUser | null
	masterPassword: string | null
}

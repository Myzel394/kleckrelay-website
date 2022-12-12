import {Dispatch, SetStateAction, useEffect} from "react";
import {AxiosError} from "axios";

import {useMutation, useQuery} from "@tanstack/react-query";

import {REFRESH_TOKEN_URL, RefreshTokenResult, getMe, refreshToken} from "~/apis"
import {AuthenticationDetails, ServerUser, User} from "~/server-types";
import {client} from "~/constants/axios-client";

export interface UseAuthData {
    logout: () => void
    masterPasswordHash: string | null
    decryptUsingMasterPassword: (content: string) => string
    user: User | ServerUser | null
    updateUser: Dispatch<SetStateAction<User | ServerUser | null | undefined>>
}

export default function useUser({
    logout,
    masterPasswordHash,
    decryptUsingMasterPassword,
    user,
    updateUser,
}: UseAuthData) {

    const {mutateAsync: refresh} = useMutation<RefreshTokenResult, AxiosError, void>(refreshToken, {
        onError: () => logout(),
    })

    useQuery<AuthenticationDetails, AxiosError>(["get_me"], getMe, {
        refetchOnWindowFocus: "always",
        refetchOnReconnect: "always",
        retry: 2,
        enabled: user !== null,
    })

    // Decrypt user notes
    useEffect(() => {
        if (user && !user.isDecrypted && user.encryptedPassword && masterPasswordHash) {
            const note = JSON.parse(decryptUsingMasterPassword(user.encryptedNotes!))

            updateUser(
                prevUser =>
                    ({
                        ...(prevUser || {}),
                        notes: note,
                        isDecrypted: true,
                    } as User),
            )
        }
    }, [user, decryptUsingMasterPassword, updateUser, masterPasswordHash])

    // Refresh token and logout user if needed
    useEffect(() => {
        const interceptor = client.interceptors.response.use(
            response => response,
            async (error: AxiosError) => {
                if (error.isAxiosError) {
                    if (error.response?.status === 401) {
                        // Check if error comes from refreshing the token.
                        // If yes, the user has been logged out completely.
                        const request: XMLHttpRequest = error.request

                        if (request.responseURL === REFRESH_TOKEN_URL) {
                            await logout()
                        } else {
                            await refresh()
                        }
                    }
                }

                throw error
            },
        )

        return () => client.interceptors.response.eject(interceptor)
    }, [logout, refresh])
}

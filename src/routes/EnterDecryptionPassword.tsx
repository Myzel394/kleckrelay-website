import {ReactElement, useContext, useState} from "react"
import {useNavigate} from "react-router-dom"
import {buildEncryptionPassword} from "~/utils"
import {useUser} from "~/hooks"
import AuthContext from "~/AuthContext/AuthContext"

export default function EnterDecryptionPassword(): ReactElement {
	const navigate = useNavigate()
	const user = useUser()
	const {_setDecryptionPassword} = useContext(AuthContext)

	const [password, setPassword] = useState<string>("")

	return (
		<div>
			<input
				value={password}
				onChange={event => setPassword(event.target.value)}
			/>
			<button
				onClick={() => {
					const encryptionPassword = buildEncryptionPassword(
						password,
						user.email.address,
					)

					_setDecryptionPassword(encryptionPassword)
					navigate("/")
				}}
			>
				Ok
			</button>
		</div>
	)
}

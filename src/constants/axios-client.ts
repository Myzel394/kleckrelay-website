import applyCaseMiddleware from "axios-case-converter"
import axios from "axios"

export const client = applyCaseMiddleware(axios.create())

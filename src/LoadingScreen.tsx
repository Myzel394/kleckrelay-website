import {Typography} from "@mui/material";
import {ReactElement} from "react";
import {SingleElementWrapper} from "~/components";

export default function LoadingScreen(): ReactElement {
    return (
        <SingleElementWrapper>
            <Typography variant="h1" component="h1">Loading...</Typography>
        </SingleElementWrapper>
    )
}

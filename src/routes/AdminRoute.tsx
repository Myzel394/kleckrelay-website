import {ReactElement, useLayoutEffect} from "react";
import {useNavigateToNext, useUser} from "~/hooks";

export default function AdminRoute(): ReactElement {
    const navigateToNext = useNavigateToNext();
    const user = useUser();

    useLayoutEffect(() => {
        if (!user.isAdmin) {
            navigateToNext();
        }
    }, [user.isAdmin, navigateToNext])


}

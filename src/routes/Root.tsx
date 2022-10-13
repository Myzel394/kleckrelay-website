import {ReactElement} from "react";
import SingleElementWrapper from "~/components/SingleElementWrapper";
import MultiStepForm from "~/components/MultiStepForm";
import EmailForm from "~/route-widgets/root/EmailForm";
import YouGotMail from "~/route-widgets/root/YouGotMail";

export default function RootRoute(): ReactElement {
    return (
        <SingleElementWrapper>
            <MultiStepForm
                steps={[
                    () => (
                        <EmailForm
                            serverSettings={{}}
                            onSignUp={() => null}
                        />
                    ),
                    () => <YouGotMail domain={""} />,
                ]}
                index={0}
            />
        </SingleElementWrapper>
    );
}

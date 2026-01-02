import { useState } from "react";
import { Steps } from "../utils/types";

export const useProfileEditSteps = () => {
    const [activeStep, setActiveStep] = useState<number>(Steps.Initializing);

    const goToStep = (step: number) => {
        setActiveStep(step);
    };

    const goToDraftDetection = () => goToStep(Steps.DraftDialog);
    const goToProfileForm = () => goToStep(Steps.ProfileForm);
    const goToConfirmation = () => goToStep(Steps.Confirmation);

    return {
        activeStep,
        goToDraftDetection,
        goToProfileForm,
        goToConfirmation,
    };
};

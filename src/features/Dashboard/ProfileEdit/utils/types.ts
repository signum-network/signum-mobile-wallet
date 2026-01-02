export const Steps = {
    Initializing: -1,
    DraftDialog: 0,
    ProfileForm: 1,
    Confirmation: 2,
} as const

export const StepsAmount = Object.keys(Steps).length - 1;

export type ProfileEdit = {
    activeStep: number;
    publicKey: string;
    name: string;
    description: string;
    homepage: string;
    socialMediaLinks: string[];
    avatarCid: string;
    backgroundCid: string;
    avatarMimeType: string;
    backgroundMimeType: string;
};

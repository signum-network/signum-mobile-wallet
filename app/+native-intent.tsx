interface Props {
    path: string;
    initial: boolean
}

// see https://docs.expo.dev/router/advanced/native-intent/
export const redirectSystemPath = ({path}: Props) => {
    // ignore routing to v1 (which is part of the SRC22 spec)
    if(path.startsWith('signum://v1')) {
        return "/"
    }
    return path;
};

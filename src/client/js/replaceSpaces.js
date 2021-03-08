export const replaceSpaces = (str) => {
    //replace spaces with +
    const strNoSpaces = str.replace(/\s/g, '+')
    return strNoSpaces
}
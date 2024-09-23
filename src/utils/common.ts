export const getTimeStamp = () => {
    const date = new Date();
    return `${date.getFullYear()}:${date.getMonth()}:${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
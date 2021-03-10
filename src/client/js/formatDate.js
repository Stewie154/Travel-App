export const formatDate = (date, yearValue) => {
    let formattedDate = date.toString().split('').slice(0, 10).join('');
    return formattedDate + '  ' + yearValue;
}
export const calcDateDifference = (currentDate, tripDate) => {
    //get difference between dates in milliseconds 
    const msDiff = tripDate.getTime() - currentDate.getTime();
    //convert milliseconds to days
    const msInADay = 1000 * 60 * 60 * 24;
    //get difference in days
    const daysDiff = msDiff / msInADay
    //return whole number
    return Math.ceil(daysDiff)
}
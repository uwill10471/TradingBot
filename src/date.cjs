
function getFormattedDate(offset = 0) {
    const date = new Date();
    const targetDate = new Date(date);
    targetDate.setDate(date.getDate() - offset);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(targetDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getTodayDate(val) {
    return getFormattedDate(val);
}


function getYesterdayDate(val) {
    return getFormattedDate(val);
}


module.exports = {
    getTodayDate,
    getYesterdayDate
};

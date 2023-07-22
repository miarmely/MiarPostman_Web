export function dateFormatter(stringDate){
    let date = new Date(stringDate);  // string convert to Date
    let dd = date.getDate();
    let MM = date.getMonth() + 1;
    let yyyy = date.getFullYear();

    return `${dd}.${MM}.${yyyy}`;
}

export function dateTimeFormatter(stringDate){
    let date = new Date(stringDate);  // string convert to Date
    let dd = date.getDate();
    let MM = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    let HH = date.getHours();
    let mm = date.getMinutes();
    
    return `${dd}.${MM}.${yyyy} - ${HH}:${mm}`;
}
export function dateFormatter(stringDate) {
    let date = new Date(stringDate);  // string convert to Date
    let dd = date.getDate();
    let MM = date.getMonth() + 1;
    let yyyy = date.getFullYear();

    return `${dd}.${MM}.${yyyy}`;
}


export function dateTimeFormatter(stringDate) {
    let date = new Date(stringDate);  // string convert to Date
    let dd = date.getDate();
    let MM = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    let HH = date.getHours();
    let mm = date.getMinutes();

    return `${dd}.${MM}.${yyyy} - ${HH}:${mm}`;
}


export function listToString(list, lineWordLimit) {  // list elements concate to one string.
    let stringList = "";

    for (let index in list) {
        stringList += list[index];

        // add new line
        if (index != 0 && index % (lineWordLimit - 1) == 0)
            stringList += "<br>";

        // add comma
        else if (index != list.length - 1)
            stringList += ", ";
    }

    return stringList;
}
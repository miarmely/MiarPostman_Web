import { resetRoles, roleNameListToString } from "./miar_role.js";


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


export function updateLabel(label, message, timeout = 0) {
    $(label).empty();
    $(label).append(`<i>${message}</i>`);

    // delete label after timeout
    if (timeout != 0)
        setTimeout(
            () => $(label).empty()
            , timeout * 1000  // convert second to milisecond
        );
}


export function updateResultLabel(label) {
    $("#span_result").parent("tr")
    .removeAttr("hidden");

}


export function addPersonsToTable(table, response) {
    try {
        // when response is list (more than one value)
        response.forEach(function (person) {
            table.prepend(
                `<tr>
                    <td>${person.id}</td>
                    <td>${person.fullName}</td>
                    <td>${person.lastName}</td>
                    <td>${person.job}</td>
                    <td>${person.salary}</td>
                    <td>${roleNameListToString(person.roles, 3)}</td>
                    <td>${dateTimeFormatter(person.registerDate)}</td>
                </tr>`
            )
        })
    }
    catch (ex) {
        // when response not list (only one value)
        if (ex instanceof TypeError)
            table.prepend(
                `<tr>
                    <td>${response.id}</td>
                    <td>${response.fullName}</td>
                    <td>${response.lastName}</td>
                    <td>${response.job}</td>
                    <td>${response.salary}</td>
                    <td>${roleNameListToString(response.roles, 3)}</td>
                    <td>${dateTimeFormatter(response.registerDate)}</td>
                </tr>`
            )
    }
}


export function setEnabledDisabled(object) {  // expected object: { enabled: [], disabled: [] }
    // remove disabled
    if (typeof object["enabled"] != "undefined")
        object["enabled"].forEach(selector => {
            $(selector).removeAttr("disabled")
        })

    // add disabled
    if (typeof object["disabled"] != "undefined")
        object["disabled"].forEach(selector => {
            $(selector).attr("disabled", "")
        })
}


export function resetInputForm() {
    // reset inputs
    $("#div_input form")[0].reset();

    resetRoles();
}
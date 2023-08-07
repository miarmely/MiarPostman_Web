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


function updateLabel(selector, message) {
    $(selector).empty();
    $(selector).append(`<i>${message}</i>`);
}


export function updatePersonQuantityLabel(table, label) {
    // get total person quantity on table
    let personQuantity = table.children("tr").length;

    updateLabel(label, `<b>${personQuantity}</b>`)
}


export async function updateResultLabel(resultLabel, message, timeout) {
    // set message
    let controlledMessage = message;

    // when occured server error
    if (typeof controlledMessage == "undefined") {
        controlledMessage = "Server <b>Error</b>";
        timeout = 0;
        resetInputForm();
        
        // refresh page as automatic after 5 second
        setTimeout(() => { location.reload() }, 10000);
    }

    updateLabel(resultLabel, controlledMessage);
    
    // remove hidden of <tr>
    let tr_resultLabel = $(resultLabel).parent("tr");
    tr_resultLabel.removeAttr("hidden");
    
    // hide result label
    if (timeout != 0) {
        // wait timeout
        await new Promise((resolve) => {
            setTimeout(() => resolve(), timeout * 1000)
        });
8
        // add hidden of <tr>
        tr_resultLabel.attr("hidden", "");
    }
}


export function addPersonsToTable(table, response, personQuantityLabel) {
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

    catch (error) {
        // when response not list (only one value)
        if (error instanceof TypeError)
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

    // update personQuantity 
    updatePersonQuantityLabel(table, personQuantityLabel);
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


export function resetTable(table, personQuantityLabel){
    table.empty();
    updatePersonQuantityLabel(table, personQuantityLabel);
}

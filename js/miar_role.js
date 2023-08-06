import { setEnabledDisabled } from "./miar_tools.js";


export var roleCounter = 1;
export var roleLimit = 0;


export function newRoleButton_Clicked() {
    let table = $("#div_input tbody");

    // is previous role empty?
    let lastRoleVal = $(`#slct_role${roleCounter}`).val();
    if (!lastRoleVal) {
        alert(`You Can't Leave Role ${roleCounter} Blank!`)
        return;
    }

    // disable new role button  &&  disable previous role
    $(`#slct_role${roleCounter}`).attr("disabled", "");
    roleCounter += 1;

    let id = `slct_role${roleCounter}`;

    // add select to table
    table.append(`
        <tr>
            <td>Role ${roleCounter}:</td>
            <td>
                <select id=${id} required>
                </select>
            </td>
        </tr>`
    )

    // fill roles
    $("#slct_role1 option").clone().appendTo(`#${id}`);
    $(`#${id}`).val("") // reset display text.

    // disable previous selected roles
    for (let no = 1; no < roleCounter; no += 1) {
        let roleIndex = $(`#slct_role${no}`).prop("selectedIndex");
        $(`#${id} option:nth-child(${roleIndex + 1})`).attr("disabled", "");
    }

    // disable new role button
    if (roleCounter == roleLimit)
        $("#btn_newRole").attr("disabled", "");

    // show "- Delete Role" button
    $("#btn_deleteRole").removeAttr("hidden");
}


export function deleteRoleButton_Clicked() {
    $("#div_input tbody tr:last-child").remove();

    // enable "+ New Role" button
    if (roleCounter == roleLimit)
        $("#btn_newRole").removeAttr("disabled");

    // enable previous role
    roleCounter -= 1;
    $(`#slct_role${roleCounter}`).removeAttr("disabled");

    // hide "- Delete Role" button.
    if (roleCounter == 1)
        $("#btn_deleteRole").attr("hidden", "");
}


export function fillRole(roleNo, addBlankValue) {
    let slct_role = $(`#slct_role${roleNo}`);

    $.ajax({
        method: "GET",
        url: "http://localhost:5282/api/role",
        datatype: "json",
        statusCode: {
            200: function (response) {
                // add blank value to head
                if(addBlankValue)
                    slct_role.append(
                        "<option></option>"
                    )

                // add roles
                response.forEach(function (role) {
                    slct_role.append(
                        `<option>${role.roleName}</option>`
                    )
                })
                
                slct_role.val("");  // set select text as blank
                roleLimit = response.length;  // set role limit

                // enable new role button
                if(response.length != 1)
                    $("#btn_newRole").removeAttr("disabled");
            }
        }
    });
}


export function resetRoles() {
    // hide delete button
    $("#btn_deleteRole").attr("hidden", "");

    // remove role selects
    for (let no = roleCounter; no > 1; no -= 1)
        $(`#div_input tbody tr:last-child`).remove();

    // reset
    roleCounter = 1;
    $("#slct_role1").val("");

    setEnabledDisabled({
        "enabled" : ["#slct_role1", "#btn_newRole"]
    })
}


export function roleNameListToString(roleNamelist, lineWordLimit) {  // list elements concate to one string.
    let stringList = "";

    for (let index in roleNamelist) {
        stringList += roleNamelist[index];

        // add new line
        if (index != 0
            && index % (lineWordLimit - 1) == 0)
            stringList += "<br>";

        // add comma
        else if (index != roleNamelist.length - 1)
            stringList += ", ";
    }

    return stringList;
}


export function getRolesInList(){
    let roleNames = [];
    
    // add role names to list
    for (let no = 1; no <= roleCounter; no += 1){
        let roleName = $(`#slct_role${no}`).val();
        roleNames.push(roleName);
    }
        
    return roleNames;
}
  
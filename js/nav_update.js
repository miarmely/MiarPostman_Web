import { addPersonsToTable, dateTimeFormatter, resetInputForm, resetTable, updateResultLabel } from "./miar_tools.js"
import { deleteRoleButton_Clicked, fillRole, getRolesInList, newRoleButton_Clicked, resetRoles, roleCounter, roleNameListToString } from "./miar_role.js";


$(function () {
    fillRole(1, false, ["#btn_find", "#btn_update"]);


    $("#btn_find").click(function (event) {
        event.preventDefault();

        let table = $("#div_display_matched tbody");
        let id = $("#inpt_id").val();

        if (!id) {
            updateResultLabel("#td_resultLabel_find", "You Should <b>Enter Id</b>", 3);
            return;
        }

        // get matched employee
        $.ajax({
            method: "GET",
            url: `http://localhost:5282/api/employee/${id}`,
            datatype: "json",
            success: function (response) {
                // reset
                resetTable(table, "#spn_personQuantity_matched");
                resetUpdateMenu();

                addPersonsToTable(table, response, "#spn_personQuantity_matched");

                // fill inputs at update menu
                $("#inpt_fullName").val(response.fullName);
                $("#inpt_lastName").val(response.lastName);
                $("#inpt_job").val(response.job);
                $("#inpt_salary").val(response.salary);

                // add roles
                response.roles.forEach(function (roleName) {
                    // set default value
                    $(`#slct_role${roleCounter}`).val(roleName);

                    // add new slct_role
                    if (roleCounter < response.roles.length)
                        newRoleButton_Clicked();
                })
            },
            error: function (response) {
                resetTable(table, "#spn_personQuantity_matched");
                resetUpdateMenu();
                updateResultLabel("#td_resultLabel_find", response.responseText, 3);
            }
        })
    });


    $("#btn_newRole").click(function () {
        newRoleButton_Clicked();
    });


    $("#btn_deleteRole").click(function () {
        deleteRoleButton_Clicked();
    });


    $("#form_update").submit(function (event) {
        event.preventDefault();  // for to close auto reset to form.

        // set variables
        let matchedTable = $("#div_display_matched tbody");
        let updatedTable = $("#div_display_updated tbody");
        let id = $("#inpt_id").val();
        let data = {
            id: id,
            fullName: $("#inpt_fullName").val() ? $("#inpt_fullName").val() : null,
            lastName: $("#inpt_lastName").val() ? $("#inpt_lastName").val() : null,
            job: $("#inpt_job").val() ? $("#inpt_job").val() : null,
            salary: $("#inpt_salary").val() ? $("#inpt_salary").val() : null,
            roles: getRolesInList(),
        }

        // Http Put 
        if (data.fullName != "-1"
            && data.lastName != "-1"
            && data.job != "-1"
            && data.salary != -1) {
            $.ajax({
                method: "PUT",
                url: "http://localhost:5282/api/employee",
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: (response) => {
                    addPersonsToTable(updatedTable, response, "#spn_personQuantity_updated");
                },
                error: (response) => {
                    resetTable(matchedTable, "#spn_personQuantity_matched");
                    resetUpdateMenu();
                    updateResultLabel("#td_resultLabel", response.responseText, 3);
                }
            });
        }
    });


    function resetUpdateMenu() {
        // reset inputs and selects
        $("#inpt_fullName").val("");
        $("#inpt_lastName").val("");
        $("#inpt_job").val("");
        $("#inpt_salary").val("");
        resetRoles();

        // enable Role 1 
        $("#slct_role1").removeAttr("disabled");
    }
});
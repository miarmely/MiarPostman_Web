import { dateTimeFormatter, updateLabel } from "./miar_tools.js"
import { deleteRoleButton_Clicked, fillRole, getRolesInList, newRoleButton_Clicked, resetRoles, roleCounter, roleNameListToString } from "./miar_role.js";


$(function () {
    fillRole(1, false);

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


    $("#btn_find").click(function () {
        let table = $("#div_display_old tbody");

        // reset
        table.empty();
        resetUpdateMenu();

        let id = $("#inpt_id").val();

        // when id not enter
        if (!id) {
            alert("You Have To Enter Id.");
            return;
        }

        // get matched employee
        $.ajax({
            method: "GET",
            url: `http://localhost:5282/api/employee/${id}`,
            datatype: "json",
            statusCode: {
                200: function (person) {
                    updateLabel("#lbl_personQuantity_matched b", 1);

                    // add employee to table 
                    table.prepend(
                        `<tr><td>${person.id}</td>
                        <td>${person.fullName}</td>
                        <td>${person.lastName}</td>
                        <td>${person.job}</td>
                        <td>${person.salary}</td>
                        <td>${roleNameListToString(person.roles, 3)}</td>
                        <td>${dateTimeFormatter(person.registerDate)}</td></tr>`
                    )

                    // fill inputs at update menu
                    $("#inpt_fullName").val(person.fullName);
                    $("#inpt_lastName").val(person.lastName);
                    $("#inpt_job").val(person.job);
                    $("#inpt_salary").val(person.salary);

                    // fill roles
                    person.roles.forEach(function (roleName) {
                        // set default value
                        $(`#slct_role${roleCounter}`).val(roleName);

                        // add new slct_role
                        if (roleCounter < person.roles.length)
                            newRoleButton_Clicked();
                    })
                },
                404: function (response) {
                    alert(`Id:${id} Not Matched.`)
                },
            }
        })
    });


    $("#btn_newRole").click(function () {
        newRoleButton_Clicked();
    });


    $("#btn_deleteRole").click(function () {
        deleteRoleButton_Clicked();
    });


    $("#div_input form").submit(function (event) {
        event.preventDefault();  // for to close auto reset to form.
        let id = $("#inpt_id").val();

        // when inpt_id is empty
        if (!id)
            return;

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
                statusCode: {
                    200: function (response) {
                        // add updated employee to table
                        let table = $("#div_display_new tbody");
                        table.prepend(
                            `<tr>
                                <td>${response.id}</td>
                                <td>${response.fullName}</td>
                                <td>${response.lastName}</td>
                                <td>${response.job}</td>
                                <td>${response.salary}</td>
                                <td>${roleNameListToString(response.roles, 4)}</td>
                                <td>${dateTimeFormatter(response.registerDate)}</td>
                            </tr>`
                        );
                            
                        // update person quantity label
                        let updateQuantity = table.children("tr").length;
                        updateLabel("#lbl_personQuantity_updated b", updateQuantity)
                    },
                    404: function () {
                        alert(`Id:${id} Not Found!..`);
                    }
                }
            });
        }
    });
});
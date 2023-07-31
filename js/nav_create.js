import { dateTimeFormatter } from "./miar_tools.js"
import { deleteRoleButton_Clicked, fillRole, getRolesInList, newRoleButton_Clicked, resetRoles, roleCounter, roleListToString } from "./miar_role.js";


$(function () {
    fillTable();
    fillRole(1);


    function fillTable() {
        let table = $("#div_display tbody")
        let getData = {
            id: -1,
            fullName: "-1",
            lastName: "-1",
            job: "-1",
            salary: "-1",
            registerDate: new Date().toLocaleDateString(),
            roles: []
        }

        $.ajax({
            method: "GET",
            url: `http://localhost:5282/api/employee/condition`,
            traditional: true,
            data: getData,
            dataType: "json",
            statusCode: {
                200: function (response) {
                    response.forEach(function (personal) {
                        let roleNames = roleListToString(personal.roles, 4);

                        table.prepend(
                            `<tr><td>${personal.id}</td>
                            <td>${personal.fullName}</td>
                            <td>${personal.lastName}</td>
                            <td>${personal.job}</td>
                            <td>${personal.salary} TL</td>
                            <td>${roleNames}</td>
                            <td>${dateTimeFormatter(personal.registerDate)}</td></tr>`
                        )
                    })
                },
            }
        });
    }


    $("#div_input form").submit(function (event) {  // when save button clicked
        event.preventDefault();  // for to hide parameters on route
        let table = $("#div_display tbody");

        // set data of ajax
        let formData = {
            fullName: $("#inpt_fullName").val(),
            lastName: $("#inpt_lastName").val(),
            job: $("#inpt_job").val(),
            salary: $("#inpt_salary").val(),
            registerDate: new Date().toLocaleString(),
            roles: getRolesInList()
        }

        // send request to api/employee
        $.ajax({
            method: "POST",
            url: "http://localhost:5282/api/employee",
            contentType: "application/json",
            data: JSON.stringify(formData),
            dataType: "json",
            statusCode: {
                200: function (response) {
                    let roleNames = roleListToString(response.roles, 4);

                    table.prepend(
                        `<tr><td>${response.id}</td>
                        <td>${response.fullName}</td>
                        <td>${response.lastName}</td>
                        <td>${response.job}</td>
                        <td>${response.salary} TL</td>
                        <td>${roleNames}</td>
                        <td>${dateTimeFormatter(response.registerDate)}</td></tr>`
                    )

                    // reset
                    $("#div_input form")[0].reset();  // inputs
                    resetRoles();
                },
                400: function () {
                    alert("Please Write True Type On Inputs.")
                }
            }
        });
    })


    $("#btn_newRole").click(function () {
        newRoleButton_Clicked();
    });


    $("#btn_deleteRole").click(function () {
        deleteRoleButton_Clicked();
    });
});
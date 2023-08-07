import { addPersonsToTable, resetInputForm, updateResultLabel } from "./miar_tools.js"
import { deleteRoleButton_Clicked, fillRole, getRolesInList, newRoleButton_Clicked } from "./miar_role.js";


$(function () {
    fillTable();
    fillRole(1, false, ["#btn_create"]);


    function fillTable() {
        let table = $("#div_display tbody")
        let getData = {
            registerDate: new Date().toLocaleString(),
        }

        $.ajax({
            method: "GET",
            url: `http://localhost:5282/api/employee/condition`,
            data: getData,
            dataType: "json",
            statusCode: {
                200: function (response) {
                    addPersonsToTable(table, response, "#spn_personQuantity");
                },
            }
        });
    }


    $("#div_input form").submit(function (event) {  // when save button clicked
        event.preventDefault();  // for to hide parameters on route
        let table = $("#div_display tbody");

        // set data of ajax
        let postData = {
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
            data: JSON.stringify(postData),
            dataType: "json",
            success: function (response) {
                addPersonsToTable(table, response, "#spn_personQuantity");
                updateResultLabel("#td_resultLabel", "<b>Successfully</b> Create", 3);
                resetInputForm();
            },
            error: function () {
                updateResultLabel("#td_resultLabel", "Something Is Wrong!..", 3);
            }
        })
    })


    $("#btn_newRole").click(function () {
        newRoleButton_Clicked();
    });


    $("#btn_deleteRole").click(function () {
        deleteRoleButton_Clicked();
    });
});
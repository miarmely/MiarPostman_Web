import { addPersonsToTable, dateTimeFormatter, updateLabel } from "./miar_tools.js";
import { fillRole, roleNameListToString } from "./miar_role.js";


$(function () {
    fillRole("", true);


    $("#btn_display").click(function () {
        let getData = {
            id: $("#inpt_id").val().trim() ? $("#inpt_id").val().trim() : null,
            fullName: $("#inpt_fullName").val().trim() ? $("#inpt_fullName").val().trim() : null,
            lastName: $("#inpt_lastName").val().trim() ? $("#inpt_lastName").val().trim() : null,
            job: $("#inpt_job").val().trim() ? $("#inpt_job").val().trim() : null,
            salary: $("#inpt_salary").val().trim() ? $("#inpt_salary").val().trim() : null,
            roles: $("#slct_role").val() ? [$("#slct_role").val()] : [],
            registerDate: $("#inpt_registerDate").val().trim() ? $("#inpt_registerDate").val().trim() : null
        }

        // display all
        if (getData.id == null
            && getData.fullName == null
            && getData.lastName == null
            && getData.job == null
            && getData.salary == null
            && getData.roles.length == 0
            && getData.registerDate == null)
            getAllPersonals();

        // display with condition
        else getPersonalsByCondition(getData);
    });


    function getPersonalsByCondition(getData) {
        let table = $("#div_display tbody")
        table.empty();  // reset table

        $.ajax({
            method: "GET",
            url: "http://localhost:5282/api/employee/condition",
            traditional: true,
            data: getData,
            contentType: "application/json",
            datatype: "json",
            statusCode: {
                200: function (response) {
                    addPersonsToTable(table, response);
                },
                404: function () {
                    updateLabel("#lbl_result", "Employee <b>Not Found</b>");
                }
            }
        });
    }


    function getAllPersonals() {
        let table = $("#div_display tbody")
        table.empty();  // reset table

        $.ajax({
            method: "GET",
            url: "http://localhost:5282/api/employee",
            datatype: "json",
            statusCode: {
                200: function (response) {
                    // update personQuantity label
                    updateLabel("#lbl_personQuantity", `<b>${response.length}</b>`);

                    response.forEach(function (person) {
                        let roleNames = roleNameListToString(person.roles, 3);

                        table.prepend(
                            `<tr><td>${person.id}</td>
                            <td>${person.fullName}</td>
                            <td>${person.lastName}</td>
                            <td>${person.job}</td>
                            <td>${person.salary}</td>
                            <td>${roleNames}</td>
                            <td>${dateTimeFormatter(person.registerDate)}</td></tr>`
                        )
                    })
                },
                404: function () {
                    updateLabel("#lbl_result", "Employee <b>Not Found</b>", 3);
                }
            }
        });
    }
});
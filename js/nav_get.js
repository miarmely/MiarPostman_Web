import { dateTimeFormatter, listToString } from "./library.js";

$(function () {
    fillRole();

    function fillRole() {
        $.ajax({
            type: "GET",
            url: "http://localhost:5282/api/role",
            datatype: "json",
            statusCode: {
                200: function (response) {
                    response.forEach(function (role) {
                        $("#slct_role").append(
                            `<option>${role.roleName}</option>`
                        )
                    });

                    $("#slct_role").val("");  // reset
                }
            }
        })

    }


    function getPersonals() {
        let table = $("#display tbody");
        table.empty();  // reset table

        let queryData = {
            id: $("#inpt_id").val().trim() ? $("#inpt_id").val().trim() : -1,
            fullName: $("#inpt_fullName").val().trim() ? $("#inpt_fullName").val().trim() : -1,
            lastName: $("#inpt_lastName").val().trim() ? $("#inpt_lastName").val().trim() : -1,
            job: $("#inpt_job").val().trim() ? $("#inpt_job").val().trim() : -1,
            salary: $("#inpt_salary").val().trim() ? $("#inpt_salary").val().trim() : -1,
            registerDate: $("#inpt_registerDate").val().trim() ? $("#inpt_registerDate").val().trim() : -1,
            roles: $("#slct_role").val() ? [$("#slct_role").val()] : []
        }

        $.ajax({
            type: "GET",
            url: "http://localhost:5282/api/employee",
            traditional: true,
            data: queryData,
            datatype: "json",
            statusCode: {
                200: function (response) {
                    response.forEach(function (personal) {
                        let roleNames = listToString(personal.roles, 4);

                        table.prepend(
                            `<tr><td>${personal.id}</td>
                            <td>${personal.fullName}</td>
                            <td>${personal.lastName}</td>
                            <td>${personal.job}</td>
                            <td>${personal.salary} TL</td>
                            <td>${roleNames}</td>
                            <td>${dateTimeFormatter(personal.registerDate)}</td></tr>`
                        );
                    });
                },
                404: function () {
                    alert("Not Matched!..");
                }
            }
        });
    }


    $("#btn_display").click(function () {
        getPersonals();
    });
});
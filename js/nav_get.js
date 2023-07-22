import {dateTimeFormatter} from "./library.js";

$(function () {
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
        }

        $.ajax({
            type: "GET",
            url: "http://localhost:5282/api/employee",
            //url: `http://localhost:5282/api/employee?id=${id}&fullName=${fullName}&lastName=${lastName}&job=${job}&salary=${salary}&registerDate=${registerDate}`,
            datatype: "json",
            traditional: true,
            data: queryData,
            statusCode: {
                200: function (response) {
                    response.forEach(function (personal) {
                        table.prepend(
                            `<tr><td>${personal.id}</td>
                            <td>${personal.fullName}</td>
                            <td>${personal.lastName}</td>
                            <td>${personal.job}</td>
                            <td>${personal.salary} TL</td>
                            <td>${dateTimeFormatter(personal.registerDate)}</td></tr>
                        `);
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
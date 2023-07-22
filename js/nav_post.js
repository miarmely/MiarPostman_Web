import {dateTimeFormatter} from "./library.js";

$(function () {
    fillTable();

    function fillTable(){
        let todayDate = new Date().toLocaleDateString();
        let table = $("#display tbody")
        
        $.ajax({
            type: "GET",
            url: `http://localhost:5282/api/employee?id=-1&fullName=-1&lastName=-1&job=-1&salary=-1&registerDate=${todayDate}`,
            dataType: "json",
            statusCode: {
                200: function(response) {
                    response.forEach(function(personal){
                        table.prepend(
                            `<tr><td>${personal.id}</td>
                            <td>${personal.fullName}</td>
                            <td>${personal.lastName}</td>
                            <td>${personal.job}</td>
                            <td>${personal.salary}</td>
                            <td>${dateTimeFormatter(personal.registerDate)}</td></tr>`)
                    })
                },
            }
        })
    }

    $("#input form").submit(function (event) {
        event.preventDefault();  // for to hide parameters on route.
        
        // set variables for ajax
        let table = $("#display tbody");
        let formData = {
            "fullName": $("#inpt_fullName").val(),
            "lastName": $("#inpt_lastName").val(),
            "job": $("#inpt_job").val(),
            "salary": $("#inpt_salary").val(),
            "registerDate" : new Date().toLocaleString()
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:5282/api/employee",
            contentType: "application/json",
            data: JSON.stringify(formData),
            dataType: "json",
            statusCode: {
                200: function (response) {
                    table.prepend(
                        `<tr><td>${response.id}</td>
                        <td>${response.fullName}</td>
                        <td>${response.lastName}</td>
                        <td>${response.job}</td>
                        <td>${response.salary} TL</td>
                        <td>${dateTimeFormatter(response.registerDate)}</td></tr>`
                    )

                    $("#input form")[0].reset();
                },
                400: function(){
                    alert("Please Write True Type On Inputs.")
                }
            }
        });
    })
});
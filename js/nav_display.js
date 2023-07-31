import { dateTimeFormatter } from "./miar_tools.js";
import { fillRole, roleListToString } from "./miar_role.js";


$(function () {
    fillRole("");


    function getPersonalsByCondition(getData) {
        let table = $("#div_display tbody")
        table.empty();  // reset table

        $.ajax({
            method: "GET",
            url: "http://localhost:5282/api/employee/condition",
            traditional: true,
            data: getData,
            datatype: "json",
            statusCode: {
                200: function (response) {
                    response.forEach(function (personal) {
                        let roleNames = roleListToString(personal.roles, 4);

                        // add table
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


    function getAllPersonals(){
        let table = $("#div_display tbody")
        table.empty();  // reset table
        
        $.ajax({
            method: "GET",
            url: "http://localhost:5282/api/employee",
            datatype: "json",
            statusCode: {
                200: function(response){
                    response.forEach(function(person){
                        let roleNames = roleListToString(person.roles);

                        table.prepend(
                            `<tr><td>${person.id}</td>
                            <td>${person.id}</td>
                            <td>${person.fullName}</td>
                            <td>${person.lastName}</td>
                            <td>${person.job}</td>
                            <td>${roleNames}</td>
                            <td>${dateTimeFormatter(person.registerDate)}</td></tr>`
                        )
                    })
                },
                404: function(){
                    alert("Anything Personal Not Registered.");
                }
            }
        });
    }


    $("#btn_display").click(function () {
        let getData = {
            id: $("#inpt_id").val().trim() ? $("#inpt_id").val().trim() : -1,
            fullName: $("#inpt_fullName").val().trim() ? $("#inpt_fullName").val().trim() : -1,
            lastName: $("#inpt_lastName").val().trim() ? $("#inpt_lastName").val().trim() : -1,
            job: $("#inpt_job").val().trim() ? $("#inpt_job").val().trim() : -1,
            salary: $("#inpt_salary").val().trim() ? $("#inpt_salary").val().trim() : -1,
            roles: $("#slct_role").val() ? [$("#slct_role").val()] : [],
            registerDate: $("#inpt_registerDate").val().trim() ? $("#inpt_registerDate").val().trim() : -1
        }

        // display all
        if(getData.id == -1
            && getData.fullName == -1
            && getData.lastName == -1
            && getData.job == -1
            && getData.salary == -1
            && getData.roles.length == 0
            && getData.registerDate == -1)
                getAllPersonals();
        
        // display with condition
        else
            getPersonalsByCondition(getData);
    });
});
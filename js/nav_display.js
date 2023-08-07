import { addPersonsToTable, resetInputForm, resetTable, updatePersonQuantityLabel, updateResultLabel } from "./miar_tools.js";
import { fillRole } from "./miar_role.js";


$(function () {
    fillRole("", true, ["#btn_display"]);


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
        
        $.ajax({
            method: "GET",
            url: "http://localhost:5282/api/employee/condition",
            traditional: true,
            data: getData,
            contentType: "application/json",
            datatype: "json",
            success: (response) => {
                resetTable(table, "#spn_personQuantity");
                addPersonsToTable(table, response, "#spn_personQuantity");
            },
            error: (response) => {
                resetTable(table, "#spn_personQuantity");
                updateResultLabel("#td_resultLabel", response.responseText, 3);
            }
        });
    }


    function getAllPersonals() {
        let table = $("#div_display tbody");
        
        $.ajax({
            method: "GET",
            url: "http://localhost:5282/api/employee",
            datatype: "json",
            success: (response) => {
                resetTable(table, "#spn_personQuantity");
                addPersonsToTable(table, response, "#spn_personQuantity");
            },
            error: (response) => {
                resetTable(table, "#spn_personQuantity");
                updateResultLabel("#td_resultLabel", response.responseText, 3);
            }
        });
    }
});
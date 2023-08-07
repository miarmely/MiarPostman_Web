import { fillRole } from "./miar_role.js";
import { addPersonsToTable, resetInputForm, resetTable, setEnabledDisabled, updateResultLabel } from "./miar_tools.js";

$(function () {
    fillRole("", true, ["#btn_find"]);


    $("#btn_find").click(function () {
        // disable buttons
        setEnabledDisabled({
            "disabled": ["#btn_find", "#btn_delete"]
        });

        // reset table
        let table = $("#div_display tbody");
        let getData = getInputValuesInObject();

        // display all
        if (getData.id == null
            && getData.fullName == null
            && getData.lastName == null
            && getData.job == null
            && getData.salary == null
            && getData.roles.length == 0
            && getData.registerDate == null)
            displayAllEmployees(table);

        // display by condition
        else displayEmployeesByCondition(table, getData)
    });


    $("#div_input form").submit(function (event) { // delete button clicked
        event.preventDefault();

        // disable buttons
        setEnabledDisabled(
            { "disabled": ["#btn_find", "#btn_delete", "#btn_back"] }
        );

        let table = $("#div_display tbody");
        let deleteData = getInputValuesInObject();

        $.ajax({
            method: "DELETE",
            url: "http://localhost:5282/api/employee",
            data: JSON.stringify(deleteData),
            contentType: "application/json",
            success: () => {
                resetTable(table, "#spn_personQuantity");
                resetInputForm();
                updateResultLabel("#td_resultLabel", "<b>Successfully</b> Delete", 3);
                
                // enable find button
                $("#btn_find").removeAttr("disabled");
            },
            error: () => {
                updateResultLabel("#td_resultLabel", response.responseText, 3);

                // enable find button
                $("#btn_find").removeAttr("disabled");
            }
        })
    });


    function displayAllEmployees(table) {
        $.ajax({
            method: "GET",
            url: "http://localhost:5282/api/employee",
            datatype: "json",
            success: (response) => {
                table.empty();
                addPersonsToTable(table, response, "#spn_personQuantity");
                setEnabledDisabled({
                    "enabled": ["#btn_delete", "#btn_find"]
                });
            },
            error: (response) => {
                updateResultLabel("#td_resultLabel", response.responseText, 3);
                setEnabledDisabled({
                    "enabled": ["#btn_find"],
                    "disabled": ["btn_delete"]
                });
            }
        });
    }

    function displayEmployeesByCondition(table, getData) {
        $.ajax({
            method: "GET",
            url: "http://localhost:5282/api/employee/condition",
            data: getData,
            contentType: "application/json",
            traditional: true,
            datatype: "json",
            statusCode: {
                200: function (response) {
                    table.empty();
                    addPersonsToTable(table, response, "#spn_personQuantity");
                    setEnabledDisabled({
                        "enabled": ["#btn_find", "#btn_delete"]
                    });
                },
                404: function (response) {
                    updateResultLabel("#td_resultLabel", response.responseText, 3);
                    setEnabledDisabled({
                        "enabled": ["#btn_find"],
                        "disabled": ["#btn_delete"]
                    });
                }
            }
        });
    }


    function getInputValuesInObject() {
        return {
            id: $("#inpt_id").val() ? $("#inpt_id").val().trim() : null,
            fullName: $("#inpt_fullName").val() ? $("#inpt_fullName").val().trim() : null,
            lastName: $("#inpt_lastName").val() ? $("#inpt_lastName").val().trim() : null,
            job: $("#inpt_job").val() ? $("#inpt_job").val().trim() : null,
            salary: $("#inpt_salary").val() ? $("#inpt_salary").val().trim() : null,
            roles: $("#slct_role").val() ? [$("#slct_role").val().trim()] : [],
            registerDate: $("#inpt_registerDate").val() ? $("#inpt_registerDate").val().trim() : null
        }
    }
});
import { fillRole } from "./miar_role.js";
import { addPersonsToTable, setEnabledDisabled, updateResultLabel } from "./miar_tools.js";

$(function () {
    fillRole("", true);


    $("#btn_find").click(function () {
        setEnabledDisabled({
            "disabled": ["#btn_find", "#btn_delete", "#btn_back"]
        });

        // reset table
        let table = $("#div_display tbody");
        table.empty();

        updateResultLabel("<i><b>Loading</b>...</i>");

        let getData = getInputValuesInObject();

        // display all
        if (getData.id == null
            && getData.fullName == null
            && getData.lastName == null
            && getData.job == null
            && getData.salary == null
            && getData.roles.length == 0
            && getData.registerDate == null)
            $.ajax({
                method: "GET",
                url: "http://localhost:5282/api/employee",
                datatype: "json",
                statusCode: {
                    200: function (response) {
                        addPersonsToTable(table, response);
                        setEnabledDisabled({
                            "enabled": ["#btn_find", "#btn_delete"]
                        });
                    },
                    404: function () {
                        updateResultLabel(`<i> <b>0</b> results found </i>`);
                        setEnabledDisabled({
                            "enabled": ["#btn_find"],
                            "disabled": ["btn_delete"]
                        });

                        return;
                    }
                }
            });

        // display by condition
        else {
            $.ajax({
                method: "GET",
                url: "http://localhost:5282/api/employee/condition",
                data: getData,
                contentType: "application/json",
                traditional: true,
                datatype: "json",
                statusCode: {
                    200: function (response) {
                        addPersonsToTable(table, response);
                        setEnabledDisabled({
                            "enabled": ["#btn_find", "#btn_delete"]
                        });
                    },
                    404: function () {
                        updateResultLabel(`<i> <b>0</b> results found </i>`);
                        setEnabledDisabled({
                            "enabled": ["#btn_find"],
                            "disabled": ["#btn_delete"]
                        });

                        return;
                    }
                }
            });
        }
    })


    $("#div_input form").submit(function (event) { // delete button clicked
        event.preventDefault();

        // disable buttons
        setEnabledDisabled(
            { "disabled": ["#btn_find", "#btn_delete", "#btn_back"] }
        );

        let deleteData = getInputValuesInObject();

        $.ajax({
            method: "DELETE",
            url: "http://localhost:5282/api/employee",
            data: JSON.stringify(deleteData),
            contentType: "application/json",
            statusCode: {
                204: function () {
                    updateResultLabel("<i> <b>Successfully</b> Delete</i>")
                    
                    // enable find button
                    $("#btn_find").removeAttr("disabled");
                },
                404: function () {
                    updateResultLabel("<i> <b>Not Matched</b> </i>")

                    // enable find button
                    $("#btn_find").removeAttr("disabled");
                }
            }
        })
    });


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
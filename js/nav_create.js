import { addPersonsToTable, resetInputForm, updateLabel } from "./miar_tools.js"
import { deleteRoleButton_Clicked, fillRole, getRolesInList, newRoleButton_Clicked} from "./miar_role.js";


$(function () {
    fillTable();
    fillRole(1, false);


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
                    // update personQuantity label
                    updateLabel("#lbl_personQuantity b", response.length);
                    
                    addPersonsToTable(table, response);
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
            statusCode: {
                200: function (response) {
                    // update result label
                    $("#tr_lbl_result").removeAttr("hidden");  // remove hidden
                    updateLabel("#lbl_result", "<b>Successfully</b> Create", 3);

                    addPersonsToTable(table, response);
                    resetInputForm();
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
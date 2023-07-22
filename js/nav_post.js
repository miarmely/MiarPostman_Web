import {dateTimeFormatter} from "./library.js";

$(function () {
    fillTable();
    fillSelect();

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

    function fillSelect(){
        let roleSelect = $("#slct_role1");
        roleSelect.append(
            `<option>Admin</option>
            <option>Employee</option>
            <option>Manager</option>`
        );
    }


    $("#input form").submit(function (event) {  // when save button clicked
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

    let roleCounter = 1;  // for to set id of selects
    let roleLimit = $("#slct_role1 option").length
    $("#btn_newRole").click(function(){
        roleCounter+=1;
        let table = $("#input tbody");
        let id = `slct_role${roleCounter}`;

        table.append(`
            <tr><td>Role ${roleCounter}:</td>
                <td><select id=${id}>
                        <option>Admin</option>
                        <option>Employee</option>
                        <option>Manager</option>
                    </select>
                </td>
            </tr>`
        )
        
        // disable new role button
        if(roleCounter == roleLimit)   
            $("#btn_newRole").attr("disabled", ""); 
        
        // show "- Delete Role" button
        $("#btn_deleteRole").removeAttr("hidden");
    });

    $("#btn_deleteRole").click(function(){
        $("#input tbody tr:last-child").remove()
        
        // enable "+ New Role" button
        if(roleCounter == roleLimit)
            $("#btn_newRole").removeAttr("disabled");

        roleCounter-=1;
        
        // hide "- Delete Role" button.
        if(roleCounter == 1)  
            $("#btn_deleteRole").attr("hidden", "");

    });
});
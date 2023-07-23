import {dateTimeFormatter} from "./library.js";

$(function () {
    let roleCounter = 1;  // for to set id of selects
    let roleLimit = 0;
    
    fillTable();
    fillRole1("slct_role1");
    

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
                            <td>${personal.salary} TL</td>
                            <td>${dateTimeFormatter(personal.registerDate)}</td></tr>`)
                    })
                },
            }
        })
    }


    function fillRole1(){
        let slct_role1 = $(`#slct_role1`);
        
        $.ajax({
            type: "GET",
            url: "http://localhost:5282/api/role",
            datatype: "json",
            statusCode: {
                200: function(response){  // add roles to Role 1 Combobox
                    response.forEach(function(role){
                        slct_role1.append(
                            `<option>${role.roleName}</option>`
                        )
                    })

                    slct_role1.val("");  // set select text as blank
                    roleLimit = $("#slct_role1 option").length;

                    // enable new role button
                    $("#btn_newRole").removeAttr("disabled");
                }      
            }
        });    
    }


    $("#input form").submit(function (event) {  // when save button clicked
        event.preventDefault();  // for to hide parameters on route
        let table = $("#display tbody");

        // add roles to list
        let roles = [];
        for(let no=1; no<=roleCounter; no+=1)
            roles.push(
                $(`#slct_role${no}`).val()
            );

        // set variables for ajax
        let formData = {
            "fullName": $("#inpt_fullName").val(),
            "lastName": $("#inpt_lastName").val(),
            "job": $("#inpt_job").val(),
            "salary": $("#inpt_salary").val(),
            "registerDate" : new Date().toLocaleString(),
            "roles" : roles
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


    $("#btn_newRole").click(function(){
        // is previous role empty?
        let lastRoleVal = $(`#slct_role${roleCounter}`).val();
        if(!lastRoleVal){
            alert(`You Can't Leave Role ${roleCounter} Blank!`)
            return;
        }

        // disable new role button && disable previous role
        $(`#slct_role${roleCounter}`).attr("disabled", "");

        roleCounter+=1;
        let table = $("#input tbody");
        let id = `slct_role${roleCounter}`;
        
        // add select to table
        table.append(`
            <tr><td>Role ${roleCounter}:</td>
                <td><select id=${id} required>
                    </select>
                </td>
            </tr>`
        )

        // fill roles
        $("#slct_role1 option").clone().appendTo(`#${id}`);
        $(`#${id}`).val("") // reset display text.
        
        // disable previous selected roles
        for(let no=1; no<roleCounter; no+=1){
            let roleIndex = $(`#slct_role${no}`).prop("selectedIndex");
            $(`#${id} option:nth-child(${roleIndex+1})`).attr("disabled", "");
        }

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

        // enable previous role
        roleCounter-=1;
        $(`#slct_role${roleCounter}`).removeAttr("disabled");
        
        // hide "- Delete Role" button.
        if(roleCounter == 1)  
            $("#btn_deleteRole").attr("hidden", "");
    });
});
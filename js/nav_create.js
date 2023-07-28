import {dateTimeFormatter, listToString} from "./main.js"

$(function () {
    let roleCounter = 1;  // for to set id of selects
    let roleLimit = 0;
    
    fillTable();
    fillRole1();
    

    function fillTable(){
        let table = $("#div_display tbody")
        let getData = {
            id: -1,
            fullName: "-1",
            lastName: "-1",
            job: "-1",
            salary: "-1",
            registerDate: new Date().toLocaleDateString(),
            roles: []
        }
        
        $.ajax({
            method: "GET",
            url: `http://localhost:5282/api/employee/condition`,
            traditional: true,
            data: getData,
            dataType: "json",
            statusCode: {
                200: function(response) {
                    response.forEach(function(personal){
                        let roleNames = listToString(personal.roles, 4);
                        
                        table.prepend(
                            `<tr><td>${personal.id}</td>
                            <td>${personal.fullName}</td>
                            <td>${personal.lastName}</td>
                            <td>${personal.job}</td>
                            <td>${personal.salary} TL</td>
                            <td>${roleNames}</td>
                            <td>${dateTimeFormatter(personal.registerDate)}</td></tr>`
                        )
                    })
                },
            }
        });
    }


    function fillRole1(){
        let slct_role1 = $(`#slct_role1`);
        
        $.ajax({
            method: "GET",
            url: "http://localhost:5282/api/role",
            datatype: "json",
            statusCode: {
                200: function(response){  
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


    function resetRoles(){
        $("#btn_deleteRole").attr("hidden", "");

        // remove role selects
        for(let no=roleCounter; no>1; no-=1)
            $(`#div_input tbody tr:last-child`).remove();

        // reset
        roleCounter=1;
        $("#slct_role1").val("");
        
        // enable new role button
        $("#btn_newRole").removeAttr("disabled");
    }


    $("#div_input form").submit(function (event) {  // when save button clicked
        event.preventDefault();  // for to hide parameters on route
        let table = $("#div_display tbody");

        // add roles to list
        let roles = [];
        for(let no=1; no<=roleCounter; no+=1)
            roles.push(
                $(`#slct_role${no}`).val()
            );

        // set data of ajax
        let formData = {
            "fullName": $("#inpt_fullName").val(),
            "lastName": $("#inpt_lastName").val(),
            "job": $("#inpt_job").val(),
            "salary": $("#inpt_salary").val(),
            "registerDate" : new Date().toLocaleString(),
            "roles" : roles
        }

        // send request to api/employee
        $.ajax({
            method: "POST",
            url: "http://localhost:5282/api/employee",
            contentType: "application/json",
            data: JSON.stringify(formData),
            dataType: "json",
            statusCode: {
                200: function (response) {
                    let roleNames = listToString(response.roles, 4);
                    
                    table.prepend(
                        `<tr><td>${response.id}</td>
                        <td>${response.fullName}</td>
                        <td>${response.lastName}</td>
                        <td>${response.job}</td>
                        <td>${response.salary} TL</td>
                        <td>${roleNames}</td>
                        <td>${dateTimeFormatter(response.registerDate)}</td></tr>`
                    )

                    // reset
                    $("#div_input form")[0].reset();  // inputs
                    resetRoles();
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
        let table = $("#div_input tbody");
        let id = `slct_role${roleCounter}`;
        
        // add select to table
        table.append(`
            <tr><td>Role ${roleCounter}:</td>
                <td><select id=${id} class="role_select"required>
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
        $("#div_input tbody tr:last-child").remove()
        
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
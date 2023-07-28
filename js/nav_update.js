import { dateTimeFormatter, listToString } from "./main.js"


$(function () {
    $("#btn_find").click(function () {
        let table = $("#div_display_old tbody");
        let btn_update = $("#btn_update");
        table.empty();  // reset

        let id = $("#inpt_id").val();

        // when id not enter
        if (!id){
            alert("You Have To Enter Id.");
            btn_update.attr("disabled", "");
            return;
        }
    
        // get matched employee
        $.ajax({
            method: "GET",
            url: `http://localhost:5282/api/employee/${id}`,
            datatype: "json",
            statusCode: {
                200: function (person) {
                    // disable update button
                    btn_update.removeAttr("disabled");

                    // add employee to table 
                    let roleNames = listToString(person.roles);
                    table.prepend(
                        `<tr><td>${person.id}</td>
                        <td>${person.fullName}</td>
                        <td>${person.lastName}</td>
                        <td>${person.job}</td>
                        <td>${person.salary}</td>
                        <td>${roleNames}</td>
                        <td>${dateTimeFormatter(person.registerDate)}</td></tr>`
                    )
                },
                404: function (response) {
                    alert(`Id:${id} Not Matched.`)
                    
                    // enable update button
                    btn_update.attr("disabled", "");
                },
            }
        })
    });


    $("#btn_update").click(function () {
        

    });
});
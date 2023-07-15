$(function () {
    function getPersonalById(id, table) {  // get personal by id
        $.ajax({
            type: "GET",
            url: `http://localhost:5282/api/employee/${id}`,
            dataType: "json",
            statusCode: {
                200: function (response) {
                    // add personels to table
                    table.append(`<tr><td>${response.id}</td>
                        <td>${response.fullName}</td>
                        <td>${response.lastName}</td>
                        <td>${response.job}</td>
                        <td>${response.salary}</td><tr>
                    `);
                },
                404: function (response) {
                    alert(`Id:${id} Not Found!..`);
                }
            }
        });
    }

    function getAllPersonal(table) {
        $.ajax({
            type: "GET",
            url: "http://localhost:5282/api/employee",
            datatype: "json",
            statusCode: {
                200: function (response) {
                    response.forEach(function(personal){
                        table.append(`<tr><td>${personal.id}</td>
                            <td>${personal.fullName}</td>
                            <td>${personal.lastName}</td>
                            <td>${personal.job}</td>
                            <td>${personal.salary}</td></tr>
                        `);
                    });    
                },
                404: function () {
                    alert("Database Is Empty!..");
                }
            }
        });
    }

    $("#btn_display").click(function () {
        let id = $("#inpt_id").val();
        let fullName = $("#inpt_fullName").val();
        let lastName = $("#inpt_lastName").val();
        let job = $("#inpt_job").val();
        let salary = $("#inpt_salary").val();
        let table = $("#display tbody");

        table.empty(); // reset table

        // when id entered
        if (id) getPersonalById(id, table);

        // when id didn't enter
        else {
            // when all inputs is empty
            if (!fullName && !lastName && !job && !salary) getAllPersonal(table)
        }
    });
});
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
                404: function () {
                    alert(`Id:${id} Not Found!..`);
                }
            }
        });
    }

    function getPersonals() {
        let id = $("#inpt_id").val().trim() ? $("#inpt_id").val().trim() : -1;
        let fullName = $("#inpt_fullName").val().trim() ? $("#inpt_fullName").val().trim() : -1
        let lastName = $("#inpt_lastName").val().trim() ? $("#inpt_lastName").val().trim() : -1
        let job = $("#inpt_job").val().trim() ? $("#inpt_job").val().trim() : -1
        let salary = $("#inpt_salary").val().trim() ? $("#inpt_salary").val().trim() : -1
        let table = $("#display tbody");

        table.empty(); // reset table

        $.ajax({
            type: "GET",
            url: `http://localhost:5282/api/employee?id=${id}&fullName=${fullName}&lastName=${lastName}&job=${job}&salary=${salary}`,
            datatype: "json",
            statusCode: {
                200: function (response) {
                    response.forEach(function (personal) {
                        table.append(
                            `<tr><td>${personal.id}</td>
                            <td>${personal.fullName}</td>
                            <td>${personal.lastName}</td>
                            <td>${personal.job}</td>
                            <td>${personal.salary}</td></tr>
                        `);
                    });
                },
                404: function () {
                    alert("Not Matched!..");
                }
            }
        });
    }

    $("#btn_display").click(function () {
        getPersonals();
    });
});
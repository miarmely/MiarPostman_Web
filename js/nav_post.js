$(function () {
    $("#input form").submit(function (event) {
        event.preventDefault();  // for to hide parameters on route. 

        let table = $("#display tbody");
        let formData = {
            "fullName": $("#inpt_fullName").val(),
            "lastName": $("#inpt_lastName").val(),
            "job": $("#inpt_job").val(),
            "salary": $("#inpt_salary").val()
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
                        <td>${response.salary}</td></tr>`
                    )
                }
            }
        });
    })
});
$(function () {    
    function dateFormatter(stringDate){
        let date = new Date(stringDate);  // string convert to Date
        let dd = date.getDate();
        let MM = date.getMonth() + 1;
        let yyyy = date.getFullYear();
        let HH = date.getHours();
        let mm = date.getMinutes();
        return `${dd}.${MM}.${yyyy} - ${HH}:${mm}`;
    }

    $("#input form").submit(function (event) {
        event.preventDefault();  // for to hide parameters on route. 
        
        // set variables for ajax
        let table = $("#display tbody");
        let formData = {
            "fullName": $("#inpt_fullName").val(),
            "lastName": $("#inpt_lastName").val(),
            "job": $("#inpt_job").val(),
            "salary": $("#inpt_salary").val(),
            "registerDate" : new Date()
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
                        <td>${dateFormatter(response.registerDate)}</td></tr>`
                    )
                }
            }
        });
    })
});
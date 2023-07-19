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


    function getPersonals() {
        let id = $("#inpt_id").val().trim() ? $("#inpt_id").val().trim() : -1;
        let fullName = $("#inpt_fullName").val().trim() ? $("#inpt_fullName").val().trim() : -1;
        let lastName = $("#inpt_lastName").val().trim() ? $("#inpt_lastName").val().trim() : -1;
        let job = $("#inpt_job").val().trim() ? $("#inpt_job").val().trim() : -1;
        let salary = $("#inpt_salary").val().trim() ? $("#inpt_salary").val().trim() : -1;
        let registerDate = $("#inpt_registerDate").val().trim() ? $("#inpt_registerDate").val().trim() : -1;
        let table = $("#display tbody");

        table.empty(); // reset table

        $.ajax({
            type: "GET",
            url: `http://localhost:5282/api/employee?id=${id}&fullName=${fullName}&lastName=${lastName}&job=${job}&salary=${salary}&registerDate=${registerDate}`,
            datatype: "json",
            statusCode: {
                200: function (response) {
                    response.forEach(function (personal) {
                        table.prepend(
                            `<tr><td>${personal.id}</td>
                            <td>${personal.fullName}</td>
                            <td>${personal.lastName}</td>
                            <td>${personal.job}</td>
                            <td>${personal.salary} TL</td>
                            <td>${dateFormatter(personal.registerDate)}</td></tr>
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
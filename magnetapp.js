var userSavedSymptomObject = {};
// this object should be an object of arrays centered on the symptom with multiple dates and multiple intensities

$("#add-symptom-button").on("click", function runSymptom (event) {
	event.preventDefault();

    var userSymptomInput = $("#new-symptom-input").val().trim();
    var userDateInput = $("#new-symptom-date").val();
    var userIntensityInput = $("#intensity option:selected").text();

    var savingSymptomObject = {
    	symptom: $("#new-symptom-input").val().trim(),
    	date: $("#new-symptom-date").val(),
    	intensity: $("#intensity option:selected").text()

    };

    // create new row for new symptom
	var symptomContainer = $("<tr>");
	// symptom is tagged with item-symptom name
	symptomContainer.attr("id", "item-" + userSymptomInput);

	var symptomListTr = "<td>" + userSymptomInput + "</td><td>" + userDateInput + "</td><td>" + userIntensityInput + "</td><td><input type='button' id='checkbox'></td>";

	symptomContainer.append(symptomListTr);

	// attach new symptom data to table
	$(".table-symptoms").append(symptomContainer);

	$("#new-symptom-input").val('');
	$("#new-symptom-date").val('');
	$("#intensity").val('');
	$("#new-symptom-input").focus();

});


$(document).on("click", "#checkbox", function(e) {
	$(this).closest('tr').remove();
});


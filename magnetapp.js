var userSavedSymptomList = [];

$("#add-symptom-button").on("click", function runSymptom (event) {
	event.preventDefault();

    var reportedSymptom = $("#new-symptom-input").val().trim();

    userSavedSymptomList.push(reportedSymptom);

	var symptomList = $("<p>");

	symptomList.attr("id", "item-" + reportedSymptom);
	symptomList.append(" " + reportedSymptom);


// adds delete button to each symptom
	var symptomRemoveBtn = $("<button>");

	symptomRemoveBtn.attr("data-symptom", reportedSymptom);
	symptomRemoveBtn.addClass("checkbox");
	symptomRemoveBtn.append("X");

	symptomList = symptomList.prepend(symptomRemoveBtn);

	$("#reported-symptoms").append(symptomList);
	$("#new-symptom-input").val("");

});


$(document.body).on("click", ".checkbox", function() {
	var historicalSymptom = $(this).attr("data-symptom");
	$("#item-" + historicalSymptom).remove();
});


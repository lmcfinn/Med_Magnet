var userSavedSymptomList = [];

$("#add-symptom-button").on("click", function runSymptom (event) {
	event.preventDefault();

    var reportedSymptom = $("#new-symptom").val().trim();

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
	$("#new-symptom").val("");

});


$(document.body).on("click", ".checkbox", function() {
	var historicalSymptom = $(this).attr("data-symptom");
	$("#item-" + historicalSymptom).remove();
});


// function newButton(event) {
// 	symptomVal = $('#new-symptom').val().trim();


// 		newSymptom = $('<li class="list-group-item"' + symptomVal + '"><span>' + symptomVal + '</span></li>');
// 		$('#symptoms-list-group').append(newSymptom);
// 	$('#new-symptom').val('');
// };

// $(document).ready(function() {
// 		$('#add-button').click(newButton);
// 	$(document).keypress(function(e) {
// 		if(e.which === 13) {
// 			newButton();
// 		}
// 	});
// });
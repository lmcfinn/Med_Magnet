  

  
		    	$(document).ready(function(){

		    		// Create an array of all the drugs
		    		var drugArray = [" ","Synthroid","Videx","Vicodin","Amoxil","Prinivil","Nexium","Lipitor","Zocor","Plavix","Singulair","Lopressor","Zithromax","Glucophage","Zoloft","Advil","Ambien","Lasix","Prilosec","Desyrel","Diovan","Ultram","Cymbalta","Coumadin","Norvasc","Percocet","Seroquel","Phenergan","Flonase","Xanax","Klonopin","Lotensin","Mobic","Celexa","Keflex","Spiriva","Neurontin","Abilify","K-Tab","Medrol","Concerta","Claritin","Coreg","Soma","Lanoxin","Namenda","Tenormin","Valium","Prozac","Adderall","Viagra"]

	    			// Create option list of all the drugs
	    			for (var i = 0; i < drugArray.length; i++) {
		    				
    					$(".drugselect").append("<option>" + drugArray[i] + "</option>");

		    		}

		    		// Execute the Chosen plugin
		    		$(".drugselect").chosen({
		    			// Set the drop down bar width
		    			width: "80%"
		    		});

		    		var drugSelected;

		    		// Connect with and initiate Firebase
		    	// 	var config = {
			    // 		 apiKey: "AIzaSyBiY4bFR2V-P7j3AAiknm5p8-Bq_O1yB_Q",
						 // authDomain: "med-magnet-test.firebaseapp.com",
						 // databaseURL: "https://med-magnet-test.firebaseio.com",
						 // storageBucket: "med-magnet-test.appspot.com",
						 // messagingSenderId: "527778945969"
			    // 	};
			    // 	firebase.initializeApp(config);
			    // 	var database = firebase.database();
			    	
 					
 					// Add the drugs to drugList
			    	$(".addbutton").on("click", function() {
				   
				      	event.preventDefault();

				      	// Assign value to the var drugSelected
				      	drugSelected = $(".drugselect").val();

			    	 	// Push the value to Firebase
			    	 	database.ref().push({

					    	drugSelected
					  	 
					  	});

				    });

			    	// Retrieve data from Firebase to display in the table
				    database.ref().on("child_added", function(childSnapshot) {

				    	var userDrug = childSnapshot.val().drugSelected;

				    	// Append data to the DOM (data from firebase)
				    	$(".table > #drugname").append("<tr><td class='drugadded btn btn-primary btn-sm'>" + userDrug + "</td>" + "<td><button class='deletebtn btn btn-danger btn-xs'>Delete</button></td>" + "</tr>");

				    });


			    	// OnCick function to make ajax call to display side effects of each drug from the API database
				    $(document).on("click", ".drugadded", function(){

				  //   	Setting up the ajax URL
						var drugPicked = $(this).text().toUpperCase();

						var queryURL = "https://api.fda.gov/drug/event.json?search=patient.drug.openfda.brand_name.exact:(%22" + drugPicked + "%22)&count=patient.reaction.reactionmeddrapt.exact"
				    	$.ajax({
				          url: queryURL,
				          method: "GET"
				        })
				        .done(function(response) {

				        	console.log(response);


				        	// Call the first 10 side effects
				        	for( var i = 0; i < 10; i++ ) {

				        		$("#effectdisplay").append('"' + response.results[i].term + '"; ');

				        	}
				        });

				        // Clear out previous side effects
				        $("#effectdisplay").empty();
				    });

				    // Listen for clicks to delete a drug selected
				    $(document).on("click", ".deletebtn", function(){

				    	// Delete "tr" from the DOM, but not on Firebase
				    	$(this).parents("tr").remove();

				    	// How to delete data from Firebase??
				    	database.ref().on("child_removed", function(childSnapshot) {

				    		database.ref().child().remove()

				    	});
				    });
		    	});


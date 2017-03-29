//URL = Base + (event or label) + apiKey + searchParm

//global variable to use inside api functions
var openFDA = {
		baseURL: 'https://api.fda.gov/drug/',
		eventURL: 'event.json',
		labelURL: 'label.json',
		apiKey: '?api_key=ARrMTzhGwZEZgbpDbWgpT0CH3dMqmZVYCca84sX5',
};


$(document).ready(function(){

	//openFDA side effects array based on drug brand name
	function getSideEffects( drug , callback ){
		var sideEffects = [];

		//SEARCH drug brand name exact AND COUNT number of reports for that reaction 
		var searchParm = '&search=patient.drug.openfda.brand_name.exact:(%22' 
						+ drug.toUpperCase() + 
						'%22)&count=patient.reaction.reactionmeddrapt.exact';

		var url = openFDA.baseURL + openFDA.eventURL + openFDA.apiKey + searchParm;

		$.ajax({
			url: url,
			method: 'GET',
		}).done(function(response){

			// 5 for number of side effects to return
			for(var i=0; i < 5; i++){
				sideEffects.push( response.results[i].term );
			}
		
			if (callback) {
				callback(sideEffects);
			} else {
				console.log('no callback passed to getSideEffects()');
			}
		});
	}


	//openFDA warnings and precautions by drug brand name
	function getWarning( drug , callback ){
		var warning = '';

		var searchParm = '&search=openfda.brand_name:(%22' + drug.toUpperCase() + '%22)'; 

		var url = openFDA.baseURL + openFDA.labelURL + openFDA.apiKey + searchParm;

		$.ajax({
			url: url,
			method: 'GET',
		}).done(function(response){
			
			//if drug has warning message
			if( response.results[0].warnings ){
				warning = response.results[0].warnings[0];
			}else if(response.results[0].warnings_and_cautions){
				warning = response.results[0].warnings_and_cautions[0];
			}else{
				warning = 'Warning label not supplied by drug producer.'
			}

			if (callback) {
				callback(warning);
			} else {
				console.log('no callback passed to getWarning()');
			}
		});

	}


	//openFDA reported drugs with adverse interacyions of drug brand name
	function getConflictingDrugs( drug , callback ){
		var conflictingDrugs = [];

		var searchParm = '&search=patient.drug.openfda.brand_name.exact:(%22' 
						+ drug.toUpperCase() + 
						'%22)+AND+patient.drug.drugcharacterization:%223%22'; 

		var url = openFDA.baseURL + openFDA.eventURL + openFDA.apiKey + searchParm;


		$.ajax({
			url: url,
			method: 'GET',
		}).done(function(response){

			var reportedConflicts = response.results[0].patient.drug

			// 5 for number of side effects to return
			for(var i=0; i < reportedConflicts.length; i++){

				//check for duplicate conflict entry
				if( conflictingDrugs.indexOf( reportedConflicts[i].medicinalproduct ) === -1 &&
					reportedConflicts[i].medicinalproduct !== drug.toUpperCase() ){

					conflictingDrugs.push( reportedConflicts[i].medicinalproduct );

				}

			}
		
			if (callback) {
				callback(conflictingDrugs);
			} else {
				console.log('no callback passed to getConflictingDrugs()');
			}
		});

	}
});

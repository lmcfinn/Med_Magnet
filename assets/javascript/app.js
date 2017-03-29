$(document).ready(function() {
    var userEtag = '';
    var currentUser = {};
    var userSavedSymptomObject = {};
    var drugSelected = [];
    var currentUserID = "0120";
    var currentUserImg = "http://i0.wp.com/radaronline.com/wp-content/uploads/2014/06/seth-rogan-james-franco.jpg?resize=236%2C169"
    var currentUserName = "James Franco"
        // firebas congfig and cached functions
    var config = {
        apiKey: "AIzaSyAUYsyg6BMEAfnFRIk2rjrtjQGJ_hQhgO8",
        authDomain: "my-awesome-project-2b194.firebaseapp.com",
        databaseURL: "https://my-awesome-project-2b194.firebaseio.com",
        storageBucket: "my-awesome-project-2b194.appspot.com",
        messagingSenderId: "901877515687"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var databaseRef = database.ref();
    var userList = database.ref('users/');





    var getUser = function(userID) {
        database.ref('/users/' + userID).once('value').then(function(snapshot) {
            currentUser = snapshot.val();
            console.log(currentUser);
            if (!currentUser) {
                writeUserData(userID, currentUserName, currentUserImg, drugSelected, userSavedSymptomObject);
                location.reload(true);
            } else {
                currentUserName = currentUser.username;
                currentUserImg = currentUser.profile_picture;
                drugSelected = JSON.parse(currentUser.drugList);
                userSavedSymptomObject = JSON.parse(currentUser.symptomsList);
                writeUserData(userID, currentUserName, currentUserImg, drugSelected, userSavedSymptomObject);
            }
        });
    };


    var delete_cookie = function(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    var signout = function() {
        hello('google').logout()
        localStorage.removeItem('hello');
        delete_cookie('NID');
        document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://dangnabit.github.io/Med_Magnet/index.html";
    };

    var signin = function() {
        hello('google').login();
    };

    // Hello init, contains browers secret
    hello.init({
        google: "901877515687-0d07o7leoihhv3ina4bqcv40ab347q86.apps.googleusercontent.com"
    }, {
        redirect_uri: 'https://dangnabit.github.io/Med_Magnet/index.html'
    });

    hello.on('auth.login', function(auth) {
        // Call user information, for the given network
        hello(auth.network).api('me').then(function(r) {
            
            // Inject it into the container
            var label = $('#profile' + auth.network);
            if (!label) {
                label = document.createElement('div');
                label.id = 'profile_' + auth.network;
                document.getElementById('profile').appendChild(label);
            }
            label.innerHTML = '<img src="' + r.thumbnail + '" /> Hey ' + r.name;
            var googSession = hello('google').getAuthResponse()
            var googAccessToken = googSession.access_token
            var googExpires = googSession.expires
            console.log(googAccessToken);
            console.log(googExpires);
            currentUserID = r.id;
            currentUserImg = r.thumbnail;
            currentUserName = r.name;
            getuser(currentUserID);
            writeUserData(currentUserID, currentUserName, currentUserImg, drugSelected, userSavedSymptomObject);
        });
    });

    // writes user data to firebase
    var writeUserData = function(userId, name, imageUrl, drugs, symptoms) {
        firebase.database().ref('users/' + userId).update({
            username: name,
            profile_picture: imageUrl,
            drugList: JSON.stringify(drugs),
            symptomsList: JSON.stringify(symptoms)
        });
    }

    $('#signin').on('click', function() {
        signin();
    })

    $('#signout').on('click', function() {
        signout();
    })


    var setDrugtoProfile = function(drugs) {
        writeUserData(currentUserID, currentUserName, currentUserImg, drugs, userSavedSymptomObject);
    }


    getUser(currentUserID);



    //URL = Base + (event or label) + apiKey + searchParm

    //global variable to use inside api functions
    var openFDA = {
        baseURL: 'https://api.fda.gov/drug/',
        eventURL: 'event.json',
        labelURL: 'label.json',
        apiKey: '?api_key=ARrMTzhGwZEZgbpDbWgpT0CH3dMqmZVYCca84sX5',
    };




    // Create an array of all the drugs
    var drugArray = [' ', 'Abilify', 'Accupril', 'Aciphex', 'Actonel', 'Actos', 'Adderall', 'Advair', 'Advil', 'Aldactone', 'Aleve', 'Altace', 'Amaryl', 'Ambien', 'Amoxil', 'AndroGel', 'Apresoline', 'Aricept', 'Ativan', 'Augmentin', 'Avapro', 'Avodart', 'Bactroban', 'Bentyl', 'Biaxin', 'Brilinta', 'Buspar', 'Bystolic', 'Caltrate', 'Cardizem', 'Cardura', 'Catapres', 'Ceftin', 'Celebrex', 'Celexa', 'Cialis', 'Cipro', 'Claritin', 'Cleocin', 'Clovate', 'Cogentin', 'Concerta', 'Coreg', 'Coumadin', 'Cozaar', 'Crestor', 'Cymbalta', 'Deltasone', 'Depakote', 'Desyrel', 'Detrol', 'Dexilant', 'Diabeta', 'Diflucan', 'Dilantin', 'Diovan', 'Ditropan', 'Dolophine', 'Dramamine', 'Duragesic', 'Dyazide', 'Effexor', 'Elavil', 'Enbrel', 'Estrace', 'Evista', 'Exelon', 'Flagyl', 'Flexeril', 'Flomax', 'Flonase', 'Focalin', 'Folvite', 'Fosamax', 'Gablofen', 'Glucophage', 'Glucotrol', 'HCTZ', 'Humalog', 'Humira', 'Hytrin', 'Hyzaar', 'Imitrex', 'Inderal', 'Januvia', 'K-Tab', 'Keflex', 'Kenalog', 'Keppra', 'Klonopin', 'Lamictal', 'Lanoxin', 'Lantus', 'Lasix', 'Latuda', 'Levaquin', 'Levemir', 'Levitra', 'Lexapro', 'Lipitor', 'Lopid', 'Lopressor', 'Lotensin', 'Lovenox', 'Lunesta', 'Lyrica', 'Macrobid', 'Medrol', 'Mevacor', 'Minocin', 'Mobic', 'Mycostatin', 'Namenda', 'Nasonex', 'Neurontin', 'Nexium', 'NitroStat SL', 'Nizoral', 'Norvasc', 'Novolog', 'Omnicef', 'Omnipred', 'Onglyza', 'OxyContin', 'Pamelor', 'Patanol', 'Paxil', 'Pen VK', 'Pepcid', 'Percocet', 'Phenergan', 'Plavix', 'Pradaxa', 'Pravachol', 'Premarin', 'Prevacid', 'Prilosec', 'Prinivil', 'Prinizide', 'Pristiq', 'ProAir HFA', 'Procardia', 'Proscar', 'Protonix', 'Prozac', 'Pyridium', 'Reglan', 'Relafen', 'Remeron', 'Requip', 'Restoril', 'Rheumatrex', 'Risperdal', 'Robaxin', 'Robitussin', 'Seroquel', 'Singulair', 'Soma', 'Spiriva', 'Strattera', 'Suboxone', 'Symbicort', 'Synthroid', 'Tamiflu', 'Tenormin', 'Tessalon', 'Topamax', 'Travatan', 'Tricor', 'Tylenol #2', 'Uceris', 'Uloric', 'Ultram', 'Valium', 'Valtrex', 'Vasotec', 'Verelan', 'VESIcare', 'Viagra', 'Vicodin', 'Victoza', 'Voltaren', 'Vytorin', 'Vyvanse', 'Wellbutrin', 'Xalatan', 'Xanax', 'Xarelto', 'Xopenex', 'Zanaflex', 'Zantac', 'Zetia', 'Zithromax', 'Zocor', 'Zofran', 'Zoloft', 'Zovirax', 'Zyloprim', 'Zyprexa', 'Zyrtec'];
    // Create option list of all the drugs
    for (var i = 0; i < drugArray.length; i++) {

        $(".drugselect").append("<option>" + drugArray[i] + "</option>");

    }

    // Execute the Chosen plugin
    $(".drugselect").chosen({
        // Set the drop down bar width
        width: "80%"
    });





    // Add the drugs to drugList
    $(".addbutton").on("click", function() {

        event.preventDefault();


        drugSelected.push($(".drugselect").val());

        console.log("array: " + drugSelected)

        setDrugtoProfile(drugSelected);
    });

    // Retrieve druglist from Firebase to display in the table
    database.ref('users/' + currentUserID + '/drugList').on("value", function(snapshot) {
        var drugList = JSON.parse(snapshot.val());
        renderDrugList(drugList);
    });


    var renderDrugList = function(drugList) {     
        $(".table > #drugname").empty();
        for (var i = 0; i < drugList.length; i++) {
            // Append data to the DOM (data from firebase)
            $(".table > #drugname").append("<tr><td class='drugadded btn btn-primary btn-sm'>" + drugList[i] + "</td>" + "<td><button class='deletebtn btn btn-danger btn-xs' data-drug=" + drugList[i] + ">Delete</button></td>" + "</tr>");
        }
    }

    // OnCick function to make ajax call to display side effects of each drug from the API database
    $(document).on("click", ".drugadded", function() {
        //      Setting up the ajax URL
        var drugPicked = $(this).text().toUpperCase();
        getSideEffects(drugPicked, function(sideEffects) {

            for (var i = 0; i < sideEffects.length; i++) {
                $("#effectdisplay").append("<tr><td>" + sideEffects[i] + "</td></tr>");
            }
        })

        getConflictingDrugs(drugPicked, function(drugConflicts) {

            for (var i = 0; i < drugConflicts.length; i++) {
                $("#conflictdisplay").append("<tr><td>" + drugConflicts[i] + "</td></tr>");
            }
        });

        // Clear out previous side effects
        $("#effectdisplay").empty();
        $("#conflictdisplay").empty();
    });

    // Listen for clicks to delete a drug selected
    $(document).on("click", ".deletebtn", function() {

        // Delete "tr" from the DOM, but not on Firebase
        $(this).parents("tr").remove();

        var toDelete = this.dataset.drug;
        var index = drugSelected.indexOf(toDelete);

        console.log(toDelete, index)
        drugSelected.splice(index, 1);
        renderDrugList(drugSelected);
        writeUserData(currentUserID, currentUserName, currentUserImg, drugSelected, userSavedSymptomObject);

    });

    //openFDA side effects array based on drug brand name
    function getSideEffects(drug, callback) {
        var sideEffects = [];

        //SEARCH drug brand name exact AND COUNT number of reports for that reaction 
        var searchParm = '&search=patient.drug.openfda.brand_name.exact:(%22' + drug.toUpperCase() +
            '%22)&count=patient.reaction.reactionmeddrapt.exact';

        var url = openFDA.baseURL + openFDA.eventURL + openFDA.apiKey + searchParm;

        $.ajax({
            url: url,
            method: 'GET',
        }).done(function(response) {

            // 5 for number of side effects to return
            for (var i = 0; i < 5; i++) {
                sideEffects.push(response.results[i].term);
            }

            if (callback) {
                callback(sideEffects);
            } else {
                console.log('no callback passed to getSideEffects()');
            }
        });
    }


    //openFDA warnings and precautions by drug brand name
    function getWarning(drug, callback) {
        var warning = '';

        var searchParm = '&search=openfda.brand_name:(%22' + drug.toUpperCase() + '%22)';

        var url = openFDA.baseURL + openFDA.labelURL + openFDA.apiKey + searchParm;

        $.ajax({
            url: url,
            method: 'GET',
        }).done(function(response) {

            //if drug has warning message
            if (response.results[0].warnings) {
                warning = response.results[0].warnings[0];
            } else if (response.results[0].warnings_and_cautions) {
                warning = response.results[0].warnings_and_cautions[0];
            } else {
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
    function getConflictingDrugs(drug, callback) {
        var conflictingDrugs = [];

        var searchParm = '&search=patient.drug.openfda.brand_name.exact:(%22' + drug.toUpperCase() +
            '%22)+AND+patient.drug.drugcharacterization:%223%22';

        var url = openFDA.baseURL + openFDA.eventURL + openFDA.apiKey + searchParm;


        $.ajax({
            url: url,
            method: 'GET',
        }).done(function(response) {

            var reportedConflicts = response.results[0].patient.drug

            // 5 for number of side effects to return
            for (var i = 0; i < reportedConflicts.length; i++) {

                //check for duplicate conflict entry
                if (conflictingDrugs.indexOf(reportedConflicts[i].medicinalproduct) === -1 &&
                    reportedConflicts[i].medicinalproduct !== drug.toUpperCase()) {

                    conflictingDrugs.push(reportedConflicts[i].medicinalproduct);

                }

            }

            if (callback) {
                callback(conflictingDrugs);
            } else {
                console.log('no callback passed to getConflictingDrugs()');
            }
        });

    }





    database.ref('users/' + currentUserID + '/symptomsList').on("value", function(snapshot) {
        var symptomList = JSON.parse(snapshot.val());

        $("#symptomsDisplay").empty();

        for (symptom in symptomList) {

            for (var i = 0; i < symptomList[symptom].length; i++) {
                // console.log(symptomList[symptom][i]);
                // console.log(symptomList[symptom][i].date);
                // console.log(symptomList[symptom][i].intensity);

                var symptomContainer = $("<tr>");
                // symptom is tagged with item-symptom name
                symptomContainer.attr("id", "item-" + symptom);

                var symptomListTr = "<td>" + symptom + "</td><td>" + symptomList[symptom][i].date + "</td><td>" + symptomList[symptom][i].intensity + "</td><td><input type='button' id='checkbox' data-symptom=" + symptom.replace(/\s/g, '-') + " data-index-number= " + i + "></td>";

                symptomContainer.append(symptomListTr);

                // attach new symptom data to table
                $("#symptomsDisplay").append(symptomContainer);

                $("#new-symptom-input").val('');
                $("#new-symptom-date").val('');
                $("#intensity").val('');
                $("#new-symptom-input").focus();

            }
        }

    });



    // this object should be an object of arrays centered on the symptom with multiple dates and multiple intensities

    $("#add-symptom-button").on("click", function runSymptom(event) {
        event.preventDefault();



        var userSymptomInput = $("#new-symptom-input").val().trim();
        var userDateInput = $("#new-symptom-date").val();
        var userIntensityInput = $("#intensity option:selected").text();


        if (userSavedSymptomObject[userSymptomInput] === undefined) {
            userSavedSymptomObject[userSymptomInput] = [];
        }

        userSavedSymptomObject[userSymptomInput].push({
            date: $("#new-symptom-date").val(),
            intensity: $("#intensity option:selected").text()
        });

        console.log(userSavedSymptomObject);

        writeUserData(currentUserID, currentUserName, currentUserImg, drugSelected, userSavedSymptomObject);

        // create new row for new symptom


    });




    $(document).on("click", "#checkbox", function(e) {
        $(this).closest('tr').remove();
        var tableIndex = this.dataset.indexNumber;
        var tableSymptom = this.dataset.symptom;
        removeTR(tableSymptom, tableIndex);

    });


    var removeTR = function(symptom, index) {
        console.log(symptom + " :" + index);

        symptom = symptom.replace(/-/g, " ");

        if (index) {
            userSavedSymptomObject[symptom].splice(index, 1);
            console.log(userSavedSymptomObject[symptom].length);
        }
        console.log(typeof(index))

        if (typeof(index) === 'undefined' || userSavedSymptomObject[symptom].length === 0) {
            console.log("DELETE");
            delete userSavedSymptomObject[symptom];
        }


        console.log(userSavedSymptomObject);
        writeUserData(currentUserID, currentUserName, currentUserImg, drugSelected, userSavedSymptomObject);
        console.log("HELP");
    }


    $('#drugPanelBtn').on('click', function() {
        if ($('#symptomPanel').hasClass('open')) {
            $('#symptomPanel').removeClass('open');
        }


        if ($('#drugPanel').hasClass('open')) {
            $('#drugPanel').removeClass('open');
        } else {
            $('#drugPanel').addClass('open');
        }


    });

    $('#symptomPanelBtn').on('click', function() {
        if ($('#drugPanel').hasClass('open')) {
            $('#drugPanel').removeClass('open');
        }


        if ($('#symptomPanel').hasClass('open')) {
            $('#symptomPanel').removeClass('open');
        } else {
            $('#symptomPanel').addClass('open');
        }



    });




});

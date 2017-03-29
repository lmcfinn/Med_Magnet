$(document).ready(function() {
    var userEtag = '';
    var currentUser = {};
    var userSavedSymptomObject = {};
    var drugSelected = [];
    var currentUserID;
    var currentUserImg;
    var currentUserName = "Sign in to load your data!"
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

    var isDrugPanelOpen = false;
    var isSympPanelOpen = false;


    if (localStorage.getItem('userLogon')) {
        console.log('Current User Detected');
        currentUserID = localStorage.getItem('userLogon');
    } else {
        currentUserID = "Default";
    }


    var getUser = function(userID) {
        database.ref('/users/' + userID).once('value').then(function(snapshot) {
            currentUser = snapshot.val();
            // console.log(currentUser);
            if (!currentUser) {
                writeUserData(userID, currentUserName, currentUserImg, drugSelected, userSavedSymptomObject);
                location.reload(true);
                $('#username').text('Hey ' + currentUserName + '! Thanks for joining MedMagnet!');
                $('#profileImg').attr('src', currentUserImg);
            } else {
                // console.log('Works');
                currentUserName = currentUser.username;
                currentUserImg = currentUser.profile_picture;
                drugSelected = JSON.parse(currentUser.drugList);
                userSavedSymptomObject = JSON.parse(currentUser.symptomsList);
                writeUserData(userID, currentUserName, currentUserImg, drugSelected, userSavedSymptomObject);
                if (currentUserName === "") {
                    $('#username').text('Welcome back ' + currentUserName + '!');
                } else {
                    $('#username').text(currentUserName);
                }


                if (currentUserImg) {
                    $('#profileImg').attr('src', currentUserImg);
                }
                renderDrugList(drugSelected);
            }
        });
    };


    var delete_cookie = function(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    var signout = function() {
        hello('google').logout()
        localStorage.removeItem('hello');
        localStorage.removeItem('userLogon');
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
            var googSession = hello('google').getAuthResponse()
            var googAccessToken = googSession.access_token
            var googExpires = googSession.expires
            currentUserID = r.id;
            currentUserImg = r.thumbnail;
            currentUserName = r.name;
            $('#username').text('Welcome back ' + currentUserName + '!');
            $('#profileImg').attr('src', currentUserImg);
            $('#signOut').removeClass('hidden');

            console.log(currentUserID);
            localStorage.setItem('userLogon', currentUserID);
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
        localStorage.setItem('userLogon', userId);
    }

    $('#signIn').on('click', function() {
        signin();
    })

    $('#signOut').on('click', function() {
        signout();
    })


    var setDrugtoProfile = function(drugs) {
        writeUserData(currentUserID, currentUserName, currentUserImg, drugs, userSavedSymptomObject);
    }






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

        // console.log("array: " + drugSelected)

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
            $(".table > #drugname").append("<tr><td class='drugadded btn btn-primary btn-sm'>" + drugList[i] + "</td>" + "<td class='deletebtn btn btn-danger btn-xs' data-drug=" + drugList[i] + ">x</td>" + "</tr>");
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

        // console.log(toDelete, index)
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

        $("#symptomTable").empty();

        for (symptom in symptomList) {

            for (var i = 0; i < symptomList[symptom].length; i++) {
                // console.log(symptomList[symptom][i]);
                // console.log(symptomList[symptom][i].date);
                // console.log(symptomList[symptom][i].intensity);

                var symptomContainer = $("<tr>");
                // symptom is tagged with item-symptom name
                symptomContainer.attr("id", "item-" + symptom);

                var symptomListTr = "<td>" + symptom + "</td><td>" + symptomList[symptom][i].date + "</td><td>" + symptomList[symptom][i].intensity + "</td><td><input type='button' id='checkbox' data-symptom=" + symptom.replace(/\s/g, '-') + " data-index-number= " + i + " value='x'></td>";

                symptomContainer.append(symptomListTr);

                // attach new symptom data to table
                $("#symptomTable").append(symptomContainer);

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



        var userSymptomInput = $(".new-symptom-input").val();
        var userDateInput = $("#new-symptom-date").val();
        var userIntensityInput = $("#intensity option:selected").text();


        console.log(userSymptomInput + userDateInput + userIntensityInput);

        if (userSymptomInput && userDateInput && userIntensityInput) {

            if (userSavedSymptomObject[userSymptomInput] === undefined) {
                userSavedSymptomObject[userSymptomInput] = [];
            }

            userSavedSymptomObject[userSymptomInput].push({
                date: $("#new-symptom-date").val(),
                intensity: $("#intensity option:selected").text()
            });



            writeUserData(currentUserID, currentUserName, currentUserImg, drugSelected, userSavedSymptomObject);
        }
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


        if (typeof(index) === 'undefined' || userSavedSymptomObject[symptom].length === 0) {

            delete userSavedSymptomObject[symptom];
        }


        console.log(userSavedSymptomObject);
        writeUserData(currentUserID, currentUserName, currentUserImg, drugSelected, userSavedSymptomObject);
        console.log("HELP");
    }


    $('#clickLeft').on('click', function() {

        if (!isDrugPanelOpen) {
            $('#drugCanvas').fadeIn('slow', function() {});
        } else {
            $('#drugCanvas').fadeOut('slow', function() {});
        }

        if (isSympPanelOpen) {
            $('#symptomCanvas').fadeOut('fast', function() {});
        }

        if ($('#symptomPanel').hasClass('open')) {
            $('#symptomPanel').removeClass('open');
            isSympPanelOpen = false;
        }

        if ($('#drugPanel').hasClass('open')) {
            $('#drugPanel').removeClass('open');
            isDrugPanelOpen = false;
        } else {
            $('#drugPanel').addClass('open');
            isDrugPanelOpen = true;
        }
    });

    $('#clickRight').on('click', function() {

        if (!isSympPanelOpen) {
            setTimeout(function() {
                $('#symptomCanvas').fadeIn('slow', function() {});
            }, 1500)
        } else {
            $('#symptomCanvas').fadeOut('fast', function() {});
        }

        if (isDrugPanelOpen) {
            $('#drugCanvas').fadeOut('slow', function() {});
        }


        if ($('#drugPanel').hasClass('open')) {
            $('#drugPanel').removeClass('open');
            isDrugPanelOpen = false;
        }


        if ($('#symptomPanel').hasClass('open')) {
            $('#symptomPanel').removeClass('open');
            isSympPanelOpen = false;
        } else {
            $('#symptomPanel').addClass('open');
            isSympPanelOpen = true;
        }


    });



    getUser(currentUserID);





    var symptomSelectionArray = [' ', 'cachexia', 'loss of appetite', 'weight loss', 'weight gain', 'dry mouth', 'fatigue', 'malaise', 'asthenia', 'muscle weakness', 'pyrexia', 'jaundice', 'pain', 'abdominal pain', 'back pain', 'arm pain', 'leg pain', 'chest pain', 'neck pain', 'finger pain', 'foot pain', 'mouth pain', 'knee pain', 'hip pain', 'joint pain', 'bruising', 'epistaxis', 'tremor', 'convulsions', 'muscle cramps', 'amaurosis fugax', 'blurred vision', 'Dalrymples sign', 'double vision', 'exophthalmos', 'mydriasis', 'miosis', 'nystagmus', 'eye pain', 'red eye', 'blindness', 'loss of vision', 'anorexia', 'bloating', 'belching', 'blood in stool', 'melena', 'hematochezia', 'constipation', 'diarrhea', 'loose stool', 'dysphagia', 'dyspepsia', 'flatulence', 'gas', 'fecal incontinence', 'haematemesis', 'blood in vomit', 'nausea', 'odynophagia', 'sore throat', 'tinnitus', 'ear pain', 'dizziness', 'vertigo', 'proctalgia fugax', 'rectal pain', 'anal itching', 'syncope', 'pyrosis', 'fainting', 'passing out', 'hypothermia', 'rectal malodor', 'foul smelling stool', 'hypothermia', 'hyperthermia', 'steatorrhea', 'discharge', 'vomiting', 'rectal discharge', 'penile discharge', 'mucous', 'bleeding', 'rectal bleeding', 'swelling', 'swelling', 'deformity', 'claudication', 'sweats', 'night sweats', 'palpitation', 'heart flutter', 'chills', 'shivering', 'tachycardia', 'fast heartrate', 'bradycardia', 'slow heartrate', 'arrhythmia', 'irregular heartbeat', 'irregular heartrate', 'acalculia', 'acrophobia', 'agnosia', 'dysuria', 'difficulty urinating', 'hematuria', 'blood in urine', 'agoraphobia', 'impotence', 'akathisia', 'polyuria', 'alexia', 'urinary frequency', 'retrograde ejaculation', 'anhedonia', 'urinary incontinence', 'urine retention', 'anxiety', 'hypoventilation', 'apraxia', 'hypoventilation', 'hyperventilation', 'arachnophobia', 'ataxia', 'bradypnea', 'bradykinesia', 'slow movment', 'slow breathing', 'difficulty breathing', 'apnea', 'stopped breathing', 'cough', 'cataplexy', 'fear', 'chorea', 'dyspnea', 'irregular breathing', 'claustrophobia', 'hemoptysis', 'bloody cough', 'confusion', 'pleuritic chest pain', 'air bubble', 'depression', 'overdose', 'sputum production', 'snot', 'excessive mucous', 'tachypnea', 'fast breathing', 'dysarthria', 'dysgraphia', 'abrasion', 'alopecia', 'hair loss', 'dystonia', 'flaccid muscles', 'flaccidity', 'euphoria', 'blister', 'anasarca', 'hallucination', 'edema', 'headache', 'hirsutism', 'hair growth', 'hemiballismus', 'ballismus', 'laceration', 'paresthesia', 'homocidal ideation', 'insomnia', 'rash', 'urticaria', 'pimples', 'bumps', 'red dots', 'mania', 'paralysis', 'abnormal vaginal bleeding', 'excessive vaginal bleeding', 'bloody show', 'painful intercourse', 'pelvic pain', 'infertility', 'labour pains', 'vaginal bleeding in pregnancy', 'vaginal discharge', 'vaginismus', 'paranoia', 'phobia', 'prosopagnosia', 'sciatica', 'somnolence', 'sleepiness', 'suicidal ideation', 'tic', 'toothache', 'light headed', 'nauseated', 'sick', 'short of breath', 'sweaty', 'sleepy', 'tired', 'thirsty', 'weak'];
    // Create option list of all the drugs
    for (var i = 0; i < drugArray.length; i++) {

        $(".new-symptom-input").append("<option>" + symptomSelectionArray[i] + "</option>");

    }

    $(".new-symptom-input").chosen({
        // Set the drop down bar width
        width: "40%"
    });


});

$(document).ready(function() {
    var userEtag = '';
    var currentUser = {};
    var userSavedSymptomObject = {};
    var drugSelected = [];
    var currentUserID = '107580231397808901546';
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

    var googleMapsKey = 'AIzaSyAUYsyg6BMEAfnFRIk2rjrtjQGJ_hQhgO8';

    getGeoTags();

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
        if (userId !== 'Default') {

            firebase.database().ref('users/' + userId).update({
                username: name,
                profile_picture: imageUrl,
                drugList: JSON.stringify(drugs),
                symptomsList: JSON.stringify(symptoms)
            });
            localStorage.setItem('userLogon', userId);
        }
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
    var drugArray = [' ', 'Abilify', 'Accupril', 'Aciphex', 'Actonel', 'Actos', 'Adderall', 'Advil', 'Aldactone', 'Aleve', 'Altace', 'Amaryl', 'AndroGel', 'Aricept', 'Ativan', 'Augmentin', 'Avapro', 'Avodart', 'Bactroban', 'Bentyl', 'Biaxin', 'Brilinta', 'Bystolic', 'Cardura', 'Catapres', 'Ceftin', 'Celebrex', 'Celexa', 'Cialis', 'Cipro', 'Claritin', 'Cleocin', 'Cogentin', 'Concerta', 'Coreg', 'Coumadin', 'Cozaar', 'Crestor', 'Cymbalta', 'Deltasone', 'Depakote', 'Detrol', 'Dexilant', 'Diabeta', 'Diflucan', 'Dilantin', 'Diovan', 'Dolophine', 'Duragesic', 'Dyazide', 'Elavil', 'Enbrel', 'Estrace', 'Evista', 'Exelon', 'Flagyl', 'Flomax', 'Focalin', 'Fosamax', 'Gablofen', 'Glucophage', 'Glucotrol', 'Humalog', 'Humira', 'Hyzaar', 'Imitrex', 'Januvia', 'K-Tab', 'Keflex', 'Kenalog', 'Keppra', 'Klonopin', 'Lamictal', 'Lanoxin', 'Lantus', 'Lasix', 'Latuda', 'Levaquin', 'Levemir', 'Levitra', 'Lexapro', 'Lipitor', 'Lopid', 'Lopressor', 'Lotensin', 'Lovenox', 'Lunesta', 'Lyrica', 'Macrobid', 'Medrol', 'Mevacor', 'Minocin', 'Mobic', 'Namenda', 'Nasonex', 'Neurontin', 'Nexium', 'Nizoral', 'Norvasc', 'Novolog', 'Omnipred', 'Onglyza', 'OxyContin', 'Pamelor', 'Patanol', 'Paxil', 'Pepcid', 'Percocet', 'Phenergan', 'Plavix', 'Pradaxa', 'Pravachol', 'Premarin', 'Prevacid', 'Prilosec', 'Prinivil', 'ProAir HFA', 'Procardia', 'Proscar', 'Prozac', 'Pyridium', 'Reglan', 'Remeron', 'Requip', 'Restoril', 'Rheumatrex', 'Risperdal', 'Robaxin', 'Seroquel', 'Singulair', 'Soma', 'Spiriva', 'Suboxone', 'Symbicort', 'Synthroid', 'Tamiflu', 'Tenormin', 'Tessalon', 'Topamax', 'Tricor', 'Uceris', 'Uloric', 'Ultram', 'Valium', 'Valtrex', 'Vasotec', 'Verelan', 'VESIcare', 'Viagra', 'Vicodin', 'Victoza', 'Voltaren', 'Vytorin', 'Vyvanse', 'Xalatan', 'Xanax', 'Xarelto', 'Xopenex', 'Zanaflex', 'Zantac', 'Zetia', 'Zithromax', 'Zocor', 'Zofran', 'Zoloft', 'Zovirax', 'Zyloprim', 'Zyprexa'];
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
        var $drugSelect = $('.drugselect').val();
        var index = drugSelected.indexOf($drugSelect);
        if (index < 0){
            drugSelected.push($drugSelect);
            setDrugtoProfile(drugSelected);
        }
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

            if(conflictingDrugs.length > 10){
                conflictingDrugs = conflictingDrugs.splice(0,10);
            }

            if (callback) {
                callback(conflictingDrugs);
            } else {
                console.log('no callback passed to getConflictingDrugs()');
            }
        });

    }


    function makePieChart() {
        var columnData = [];

        for (var symptomKey in userSavedSymptomObject) {
            var currentSymptomArray = [symptomKey];
            currentSymptomArray.push(userSavedSymptomObject[symptomKey].length);

            columnData.push(currentSymptomArray);
        }
        console.log(columnData);

        var chart = c3.generate({
            bindto: '#pieChart',
            data: {
                columns: columnData,
                type: 'pie',
            }
        });
    } //end of makePieChart()



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


            $('.new-symptom-input').val('');
            writeUserData(currentUserID, currentUserName, currentUserImg, drugSelected, userSavedSymptomObject);
        }
        // create new row for new symptom

        makePieChart();
    });







    $(document).on("click", "#checkbox", function(e) {
        $(this).closest('tr').remove();
        var tableIndex = this.dataset.indexNumber;
        var tableSymptom = this.dataset.symptom;
        removeTR(tableSymptom, tableIndex);
        makePieChart();
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
        
    }

    //Drug Panel Fade in - Fade Out
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

    //Symptom Panel Fade in - Fade Out
    $('#clickRight').on('click', function() {

        if (!isSympPanelOpen) {
            setTimeout(function() {
                $('#symptomCanvas').fadeIn('slow', function() { makePieChart(); });
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





    var symptomSelectionArray = [' ','abdominal pain','abnormal vaginal bleeding','abrasion','acalculia','acrophobia','agnosia','agoraphobia','air bubble','akathisia','alexia','alopecia','amaurosis fugax','anal itching','anasarca','anhedonia','anorexia','anxiety','apnea','apraxia','arachnophobia','arm pain','arrhythmia','asthenia','ataxia','back pain','ballismus','belching','bleeding','blindness','blister','bloating','blood in stool','blood in urine','blood in vomit','bloody cough','bloody show','blurred vision','bradycardia','bradykinesia','bradypnea','bruising','bumps','cachexia','cataplexy','chest pain','chills','chorea','claudication','claustrophobia','confusion','constipation','convulsions','cough', 'Dalrymples sign', 'deformity','depression','diarrhea','difficulty breathing','difficulty urinating','discharge','dizziness','double vision','dry mouth','dysarthria','dysgraphia','dyspepsia','dysphagia','dyspnea','dystonia','dysuria','ear pain','edema','epistaxis','euphoria','excessive mucous','excessive vaginal bleeding','exophthalmos','eye pain','fainting','fast breathing','fast heartrate','fatigue','fear','fecal incontinence','finger pain','flaccid muscles','flaccidity','flatulence','foot pain','foul smelling stool','gas','haematemesis','hair growth','hair loss','hallucination','headache','heart flutter','hematochezia','hematuria','hemiballismus','hemoptysis','hip pain','hirsutism','homocidal ideation','hyperthermia','hyperventilation','hypothermia','hypothermia','hypoventilation','hypoventilation','impotence','infertility','insomnia','irregular breathing','irregular heartbeat','irregular heartrate','jaundice','joint pain','knee pain','labour pains','laceration','leg pain','light headed','loose stool','loss of appetite','loss of vision','malaise','mania','melena','miosis','mouth pain','mucous','muscle cramps','muscle weakness','mydriasis','nausea','nauseated','neck pain','night sweats','nystagmus','odynophagia','overdose','pain','painful intercourse','palpitation','paralysis','paranoia','paresthesia','passing out','pelvic pain','penile discharge','phobia','pimples','pleuritic chest pain','polyuria','proctalgia fugax','prosopagnosia','pyrexia','pyrosis','rash','rectal bleeding','rectal discharge','rectal malodor','rectal pain','red dots','red eye','retrograde ejaculation','sciatica','shivering','short of breath','sick','sleepiness','sleepy','slow breathing','slow heartrate','slow movment','snot','somnolence','sore throat','sputum production','steatorrhea','stopped breathing','suicidal ideation','sweats','sweaty','swelling','swelling','syncope','tachycardia','tachypnea','thirsty','tic','tinnitus','tired','toothache','tremor','urinary frequency','urinary incontinence','urine retention','urticaria','vaginal bleeding in pregnancy','vaginal discharge','vaginismus','vertigo','vomiting','weak','weight gain','weight loss'];
    // Create option list of all the drugs
    for (var i = 0; i < drugArray.length; i++) {

        $(".new-symptom-input").append("<option>" + symptomSelectionArray[i] + "</option>");

    }

    $(".new-symptom-input").chosen({
        // Set the drop down bar width
        width: "40%"
    });

    //for embedding google maps with nearby pharmacies
    function getGeoTags() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $('iframe').attr('src', 'https://www.google.com/maps/embed/v1/search?key=' + googleMapsKey +'&q=Pharmacy&center=' + position.coords.latitude + ',' + position.coords.longitude + "&zoom=15");
            });
        } else {
            $('iframe').attr('src',
                'https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d11877.71094677172!2d-87.62855171696631!3d41.905162785034655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1spharmacy!5e0!3m2!1sen!2sus!4v1490798248002'
            );
        }
    }

});

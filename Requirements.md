
# Project Overview

### Patient
* **Drug record**
  - Consider limit scope of most popular drugs
  - autocomplete drug options
  - use api to pull side effects
  - use api for drug conflicts


* **Symptom Input**
  - What it is
  - When
  - severity
  - visually display (github contrib graph)
  
* **Pharmacy Search(stretch goal)**
  - uses location to map out pharmacies nearby
  
* Preferred Pharamacy (stretch goal)

### Doctor

* **List Of Patience**

  - Full records when clicked on
  - Symptom timeline each patient
  - per-patient notepad

* Script notifier

# Class Requirements
### Must use at least two APIs
* Open FDA (side-effects):  https://open.fda.gov/api/
* National Library of Medicine (conflicting drugs): https://rxnav.nlm.nih.gov/InteractionAPIREST.html
* Google Maps for pharmacies (stretch goal)

### Must use AJAX to pull data
* See APIs above
* Firebase API get & set

### Must utilize at least one new library or technology that we haven’t discussed
* OAuth (stretch goal)
* animate.css (Maybe)
* bootstrap validator: http://1000hz.github.io/bootstrap-validator/
* Harvest Combobox (input)


### Must have a polished frontend / UI 
* Harvest Combobox: https://harvesthq.github.io/chosen/

### Must meet good quality coding standards (indentation, scoping, naming)

### Must NOT use alerts, confirms, or prompts (look into modals!)

### Must have some sort of repeating element (table, columns, etc)
* Table showing drug information
* Table for patient list (Doctor version)

### Must use Bootstrap or Alternative CSS Framework
* Bootstrap

### Must be Deployed (Heroku or Firebase)
* Firebase for hosting and database

### Must have User Input Validation 
* bootstrap validator: http://1000hz.github.io/bootstrap-validator/
* Autocomplete for drugs (push array of drugs into jquery UI)

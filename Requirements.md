# Project Overview

Trello Link: https://trello.com/b/czziz46D/med-magnet

* **Drug record**
  - Limit scope to top 200 most popular drugs
  - autocomplete drug options
  - use api to pull side effects
  - use api for drug conflicts

* **Symptom Input**
  - What it is
  - When
  - severity
  - visually display
  
* **Pharmacy Search(stretch goal)**
  - uses location to map out pharmacies nearby
 

# Class Requirements
### Must use at least two APIs
* Open FDA (side-effects):  https://open.fda.gov/api/
* Google Oauth via hello.js

### Must use AJAX to pull data
* See APIs above
* Firebase API get & set

### Must utilize at least one new library or technology that we haven’t discussed
* OAuth (hello.js)
* Harvest Combobox (input)
* C3.js pie chart (D3 based data visualization)


### Must have a polished frontend / UI 
* Harvest Combobox: https://harvesthq.github.io/chosen/

### Must meet good quality coding standards (indentation, scoping, naming)

### Must NOT use alerts, confirms, or prompts (look into modals!)

### Must have some sort of repeating element (table, columns, etc)
* Table showing drug information ( top side-effects, conflicting drugs
* Table for symptoms entered

### Must use Bootstrap or Alternative CSS Framework
* Bootstrap

### Must be Deployed (Heroku or Firebase)
* Firebase for hosting and database

### Must have User Input Validation 
* Autocomplete for drugs Combobox using predefined drug list
* date input form type for symptom
* List selector for symptom intensity

let prepopulatedRating = null;

$('#ddnYear').on('change', function (event, value) {
    clearFields();
    let selectedYear = $(this).val();
    if (value)
        selectedYear = value;
    if (selectedYear !== '') {
        callServer('/terms/termsbyyear', selectedYear)
            .then((terms) => {

                if (terms) {

                    let optionString = '<option value="">Please select</option>';
                    for (let index = 0; index < terms.length; index++) {
                        optionString += `<option value="${terms[index]}">${terms[index]}</option>`;
                    }
                    if (value)
                        $(this).val(value);
                    $('#ddnTerm').attr('disabled', false).html(optionString).focus();
                    if (prepopulatedRating && prepopulatedRating.term)
                        $('#ddnTerm').trigger('change', prepopulatedRating.term);
                }
            })
            .catch((err) => {
                console.log(`Error while recieving terms for ${selectedYear}`);
            });
    }
    else
        alert('Please select correct year');
});

$('#ddnTerm').on('change', function (event, value) {
    clearFields('#ddnTerm');
    let selectedTerm = $(this).val();
    if (value)
        selectedTerm = value;
    let selectedYear = $('#ddnYear').val();
    if (selectedTerm !== '') {
        let data = { year: selectedYear, term: selectedTerm };
        callServer('/terms/getDepartments', data)
            .then((departments) => {

                if (departments) {

                    let optionString = '<option value="">Please select</option>';
                    for (let index = 0; index < departments.length; index++) {
                        optionString += `<option value="${departments[index]._id}">${departments[index].dept}</option>`;
                    }
                    if (value)
                        $(this).val(value);
                    $('#ddnDepartment').attr('disabled', false).html(optionString).focus();
                    if (prepopulatedRating && prepopulatedRating.department)
                        $('#ddnDepartment').trigger('change', prepopulatedRating.department);
                }
            })
            .catch((err) => {
                console.log(`Error while recieving department for ${selectedYear} and ${selectedTerm}`);
            });
    }
    else
        alert('Please select correct term');
});

$('#ddnDepartment').on('change', function (event, value) {
    clearFields('#ddnDepartment');

    let selectedDepartment = $(this).val();
    if (value)
        selectedDepartment = value;

    if (selectedDepartment !== '') {
        callServer('/courses/getCourses', selectedDepartment)
            .then((courses) => {

                if (courses) {

                    let optionString = '<option value="">Please select</option>';
                    for (let index = 0; index < courses.length; index++) {
                        optionString += `<option value="${courses[index]._id}">${courses[index].value}-${courses[index].name}</option>`;
                    }
                    if (value)
                        $(this).val(value);
                    $('#ddnCourses').attr('disabled', false).html(optionString).focus();
                    if (prepopulatedRating && prepopulatedRating.courses)
                        $('#ddnCourses').trigger('change', prepopulatedRating.courses);
                }
            })
            .catch((err) => {
                console.log(`Error while recieving courses for ${selectedDepartment}`);
            });
    }
    else
        alert('Please select correct department');
});

/*
* Function to be called on change of course dropdown. In case of prepopulation for edit of ratings form, value will be set
* This will make server call to get professor list.
* if value is set, the value in the professor dropdown will be selected automatically
*/
$('#ddnCourses').on('change', function (event, value) {
    clearFields('#ddnCourses');

    let selectedDepartment = $(this).val();
    if (value)
        selectedDepartment = value;

    if (selectedDepartment !== '') {
        callServer('/courses/getProfessors', selectedDepartment)
            .then((courses) => {

                if (courses) {

                    let optionString = '<option value="">Please select</option>';
                    for (let index = 0; index < courses.length; index++) {
                        optionString += `<option value="${courses[index]._id}">${courses[index].name}</option>`;
                    }
                    if (value)
                        $(this).val(value);
                    $('#ddnProfessors').attr('disabled', false).html(optionString).focus();
                    $('#ddnRatings, #txtComments, #takeAgain, #grading, #assignments').attr('disabled', false);

                    loadDropDowns();
                    if (prepopulatedRating) {
                        $('#ddnProfessors').val(prepopulatedRating.professors);
                        $('#ddnRatings').val(prepopulatedRating.ratings);
                        $('#takeAgain').val(prepopulatedRating.takeAgain);
                        $('#grading').val(prepopulatedRating.grading);
                        $('#assignments').val(prepopulatedRating.assignments);
                        $('#txtComments').val(prepopulatedRating.comments).focus();
                    }
                }
            })
            .catch((err) => {
                console.log(`Error while recieving professors for ${selectedDepartment}`);
            });
    }
    else
        alert('Please select correct course');
});

$(document).ready(function () {
    if (prepopulatedRating) {
        $('#hdnRowId').val(prepopulatedRating._id);
        $('#ddnYear').trigger('change', prepopulatedRating.year);
    }
});

/*
* Function to clear the fields
*/
function clearFields(name) {

    let names = '#ddnTerm, #ddnDepartment, #ddnCourses, #ddnProfessors, #takeAgain, #grading, #assignments, #ddnRatings, #txtComments';
    if (name) {
        let index = names.indexOf(name);
        if (index > -1)
            names = names.substr(index + 1 + name.length);
    }
    $(names).val('').attr('disabled', true);

}

function loadDropDowns() {
    loadTakeAgainDdn();
    loadGradingDdn();
    loadAssignments();
    loadTotalRatings();
}

/*
* Function to load the takeagain dropdown based on the takeAgain object defined in the utility.js
*/
function loadTakeAgainDdn() {

    let htmlString = '<option value="">Please select</option>';
    let _keys = Object.keys(takeAgain);
    for (let index = 0; index < _keys.length; index++) {
        htmlString += `<option value="${_keys[index]}">${takeAgain[_keys[index]]}</option>`;
    }

    $('#takeAgain').html(htmlString);
}

/*
* Function to load the grading dropdown based on the grading object defined in the utility.js
*/
function loadGradingDdn() {

    let htmlString = '<option value="">Please select</option>';
    let _keys = Object.keys(grading);
    for (let index = 0; index < _keys.length; index++) {
        htmlString += `<option value="${_keys[index]}">${grading[_keys[index]]}</option>`;
    }

    $('#grading').html(htmlString);
}

/*
* Function to load the assignment dropdown based on the assignments object defined in the utility.js
*/
function loadAssignments() {
    let htmlString = '<option value="">Please select</option>';
    let _keys = Object.keys(assignments);
    for (let index = 0; index < _keys.length; index++) {
        htmlString += `<option value="${_keys[index]}">${assignments[_keys[index]]}</option>`;
    }

    $('#assignments').html(htmlString);
}

/*
* Function to load the ratings dropdown based on the overallRatings object defined in the utility.js
*/
function loadTotalRatings() {
    let htmlString = '<option value="">Please select</option>';
    let _keys = Object.keys(overallRatings);
    for (let index = 0; index < _keys.length; index++) {
        htmlString += `<option value="${_keys[index]}">${overallRatings[_keys[index]]}</option>`;
    }

    $('#ddnRatings').html(htmlString);

}

/*
* This on click event is used for validating the ratings form
* This will get all the input elements within the form except hidden field
* Then it will iterate over all the fields and find first element which is not disabled but whose value is empty
* if any such element is found then it will find corresponding label and show error required message as per label.
* loop will break against that element else it will hide the error div and submit the form
*/
$('#btnSubmit').on('click', function (event) {
    
    let elems = $('#frmRatings')
        .find(':input')
        .not(':hidden, #txtComments')
        .each((index, elem) => {
            if ($(elem).is(':not(":disabled")') && $(elem).val() === '') {
                event.preventDefault();
                let _label = $('#frmRatings').find(`label[for="${elem.id}"]`);
                if (_label) {
                    $('#divCustomMsg').html(`${$(_label).text()} is required`).show().addClass('alert alert-danger');
                }
                $(elem).focus();
                return false;
            }
            $('#divCustomMsg').hide().remove('alert alert-danger');
        });

});
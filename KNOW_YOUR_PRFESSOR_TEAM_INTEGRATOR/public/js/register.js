/*
* Function to check if the username typed by user is already present in the database or not.
* if the username is already taken, then it will show error message forcing user to select unique username
*/
$('#txtUsername')
    .on('blur', function () {
        let ctrl = $(this);
        let value = ctrl.val();
        if (value) {
            showLoadingDiv(true);
            callServer('/users/checkExistingUsername', value)
                .then((result) => {
                    if (!result || (result && !result.proceed)) {
                        $('#divCustomMsg').html(result.message).show().addClass('alert alert-danger');
                        ctrl.val('');
                        ctrl.focus();
                    }
                    else
                        $('#divCustomMsg').hide().remove('alert alert-danger');
                    showLoadingDiv(false);
                })
                .catch((err) => {
                    console.log(err);
                    showLoadingDiv(false);
                })
        }
        else
            $('#divCustomMsg').hide().remove('alert alert-danger');
    });

/*
* Function to check if the email typed by user is already present in the database or not.
* if the email is already taken, then it will show error message forcing user to select unique email
*/
$('#txtEmail')
    .on('blur', function () {
        let ctrl = $(this);
        let value = ctrl.val();
        if (value) {
            showLoadingDiv(true);
            callServer('/users/checkExistingEmailId', value)
                .then((result) => {
                    if (!result || (result && !result.proceed)) {
                        $('#divCustomMsg').html(result.message).show().addClass('alert alert-danger');
                        ctrl.val('');
                        ctrl.focus();
                    }
                    else
                        $('#divCustomMsg').hide().remove('alert alert-danger');
                    showLoadingDiv(false);
                })
                .catch((err) => {
                    console.log(err);
                    showLoadingDiv(false);
                })
        }
        else
            $('#divCustomMsg').hide().remove('alert alert-danger');
    });

/*
* In case any error is shown form submission is canceled.
*/
$('#btnSubmit').on('click', function (event) {
    if ($('#divCustomMsg').is(':visible')) {
        event.preventDefault();
        return false;
    }
})
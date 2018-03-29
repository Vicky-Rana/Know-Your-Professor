/*
* function to make ajax call. To avoid any dataleakage from the url, the method is set to POST default.
*/
function callServer(url, dataToSend) {
    return new Promise((resolve, reject) => {
        let serverData = JSON.stringify(dataToSend);
        $.ajax({
            url: url,
            method: 'POST',
            data: { serverData: serverData },
            success: function (data, textStatus, jqXHR) {
                if (data.textStatus !== null)
                    resolve(data);
                else
                    reject();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reject(errorThrown);                
            }
        });
    });
}

function showLoadingDiv(bshow) {
    if (bshow)
        $('#divLoading').show();
    else
        $('#divLoading').hide();
}

let takeAgain = {
    "1": "Yes",
    "2": "No"
};

let assignments = {
    "1": "Very Easy",
    "2": "Easy",
    "3": "Difficult",
    "4": "Very Difficult"
};

let overallRatings = {
    "1": "Poor",
    "2": "Good",
    "3": "Better",
    "4": "Best",
    "5": "Best of Best"
};

let grading = {
    "1": "Fair",
    "2": "Neutral",
    "3": "Not fair"
};
$('#txtProfessorName')
    .autocomplete({
        source: function (request, response) {

            callServer('/SearchProfessorByName', request.term)
                .then((result) => {

                    response($.map(result, function (item) {
                        return {
                            value: item._id,
                            label: item.name
                        };
                    }));
                })
                .catch((err) => {
                    console.log(err);
                    alert('error');
                });
        },
        focus: function (event, ui) {
            $(this).val(ui.item.label);
            return false;
        },
        select: function (event, ui) {
            this.value = ui.item.label;
            event.preventDefault();
            getProfInfo(ui.item.value, this.value);
        }
    });

function getProfInfo(profId, name) {
    $('#divComments').html('');
    callServer('/getOpenProfessorRatings', profId)
        .then((result) => {
            $('#lblProfName').text(name);
            $('#lblOverallRating').text(overallRatings[result.averageRatings]);

            let commentResult = result.commentsByUser;

            for (let index = 0; index < result.commentsByUser.length; index++) {
                let comment = result.commentsByUser[index];

                //grading
                let gradingComment = `<div class='well ratingsAllProf'> 
                                  <div>
                                  <label>GRADING CRITERIA: </label>
                                  <label>${grading[comment.grading]}</label>
                                  </div>
                                  <div>
                                  <label>LEVEL OF DIFFICULTY: </label>
                                  <label>${assignments[comment.assignments]}</label >
                                  </div>
                                  <div>
                                  <label> WOULD YOU TAKE THIS PROF AGAIN ?: </label>
                                  <label>${takeAgain[comment.takeAgain]}</label>
                                  </div>
                                  <div>
                                  <label>COMMENTS: </label>
                                  <label>${comment.comments}</label ></div>`;
                                  
                $('#divComments').append(gradingComment);
            }
        })
        .catch((err) => {
            console.log(err);
           // alert('Error');
        });
}
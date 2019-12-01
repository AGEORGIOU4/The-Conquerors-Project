//JAVASCRIPT FOR TESTING

const TESTING_API_LIST = "https://codecyprus.org/th/test-api/list?number-of-ths=2";


function getTestingList(){
fetch(TESTING_API_LIST)
    .then(response =>response.json()) //ParseJSON text to JavaScript object
    .then(jsonObject => {
        console.log(jsonObject); //TODO - Success, do something with the data.
        // Give some alert messages if status is error
        status = jsonObject.status;
        if (status === "ERROR") {
            alert(jsonObject.errorMessages);
        } else {
            // Change the questions paragraph content by adding the question from the server
            question.innerHTML = jsonObject.questionText;
            // Question attributes
            let typeOfQuestion = jsonObject.questionType;
            skipQuestion = jsonObject.canBeSkipped;
            let requiresLocation = jsonObject.requiresLocation;
            getTypeOfQuestion(typeOfQuestion);
            getLocation(requiresLocation);
            questionCanBeSkipped(skipQuestion);
        }
    });
}
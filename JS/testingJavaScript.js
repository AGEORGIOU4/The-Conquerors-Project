//JAVASCRIPT FOR TESTING

const TESTING_API_LIST = "https://codecyprus.org/th/test-api/list?number-of-ths=2";



fetch(TESTING_API_LIST)
    .then(response =>response.json()) //ParseJSON text to JavaScript object
    .then(jsonObject => {
        console.log(jsonObject); //TODO - Success, do something with the data.
    });

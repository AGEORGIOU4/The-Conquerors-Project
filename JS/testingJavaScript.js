//JAVASCRIPT FOR TESTING

const FIRST_TESTING_API_LIST = "https://codecyprus.org/th/test-api/list?number-of-ths=2";
const SECOND_TESTING_API_LIST = "https://codecyprus.org/th/test-api/list?number-of-ths=10";
const THIRD_TESTING_API_LIST = "https://codecyprus.org/th/test-api/list?number-of-ths=20";
const TESTING_API_START = "https://codecyprus.org/th/test-api/start?player=inactive";


let list = document.getElementById("challenges2");
function getTwoChallengesTest() {

    document.getElementById("challenges").style.display = 'block';
    fetch(FIRST_TESTING_API_LIST)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            console.log(jsonObject);
            let array = jsonObject.treasureHunts;
            for (let i = 0; i < array.length; i++) {
                list = document.getElementById("challenges");
                let uuid = array[i].uuid;
                let listItem = document.createElement("li");
                listItem.innerHTML = "<a href='https://codecyprus.org/th/test-api/start?player=Jacobs&app=Team2&treasure-hunt-id=" + uuid + "'>" + array[i].description + "</a>";
                list.appendChild(listItem);
            }

        });

}

function getTenChallengesTest() {

    document.getElementById("challenges2").style.display = 'block';
    fetch(SECOND_TESTING_API_LIST)
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject);
            let array = jsonObject.treasureHunts;
            for (let i = 0; i < array.length; i++){
                list = document.getElementById("challenges2");

                let uuid = array[i].uuid;
                let listItem = document.createElement("li");
                listItem.innerHTML = "<a href='https://codecyprus.org/th/test-api/start?player=Jacobs&app=Team2&treasure-hunt-id=" + uuid + "'>" + array[i].description + "</a>";
                list.appendChild(listItem);
            }

        })
}

function getTwentyChallengesTest() {

    document.getElementById("challenges3").style.display = 'block';
    fetch(THIRD_TESTING_API_LIST)
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject);
            let array = jsonObject.treasureHunts;

            for (let i = 0; i < array.length; i++){
                list = document.getElementById("challenges3");

                let uuid = array[i].uuid;
                let listItem = document.createElement("li");
                listItem.innerHTML = "<a href='https://codecyprus.org/th/test-api/start?player=Jacobs&app=Team2&treasure-hunt-id=" + uuid + "'>" + array[i].description  + "</a>";

                list.appendChild(listItem);
            }

        })
}

function  clearTheTestList() {
    document.getElementById("challenges").style.display = 'none';
    document.getElementById("challenges2").style.display = 'none';
    document.getElementById("challenges3").style.display = 'none';
    document.getElementById("testButton1").style.display = 'block';
    document.getElementById("testButton2").style.display = 'block';
    document.getElementById("testButton3").style.display = 'block';

}

    function getStartTest(uuid){
    fetch(TESTING_API_START + uuid)
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject);
            let array = jsonObject.errorMessages;
            for (let i = 0; i<array.length; i++){
                let error = array[i].status;
                let list = document.getElementById("errors");
                let errorList = document.createElement("li");
                errorList.innerHTML = "<a href='https://codecyprus.org/th/test-api/start?player=Jacobs&app=Team2&treasure-hunt-id=" + uuid + "'>" + array[i].name + "</a>";
                list.appendChild(errorList);
            }
            if (status === "ERROR"){
                alert(jsonObject.errorMessages);
            }
        });
}

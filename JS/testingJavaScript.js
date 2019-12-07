//JAVASCRIPT FOR TESTING


const FIRST_TESTING_API_LIST = "https://codecyprus.org/th/test-api/list?number-of-ths=2";
const SECOND_TESTING_API_LIST = "https://codecyprus.org/th/test-api/list?number-of-ths=10";
const THIRD_TESTING_API_LIST = "https://codecyprus.org/th/test-api/list?number-of-ths=20";
const TESTING_API_START = "https://codecyprus.org/th/test-api/start?player=inactive";

let uuid = "";
let list = document.getElementById("challenges");

function getTwoChallengesTest() {


    fetch(FIRST_TESTING_API_LIST)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            console.log(jsonObject);
            let array = jsonObject.treasureHunts;
            for (let i = 0; i < array.length; i++) {

                document.getElementById("titleFour").style.display = "block";
                document.getElementById("firstResult").style.display = 'block';
                list = document.getElementById("firstResult");
                let uuid = array[i].uuid;
                let listItem = document.createElement("li");
                listItem.innerHTML = "<a href='https://codecyprus.org/th/test-api/start?player=Jacobs&app=Team2&treasure-hunt-id=" + uuid + "'>" + array[i].description + "</a>";
                list.appendChild(listItem);
            }

        });

}

function getTenChallengesTest() {


    fetch(SECOND_TESTING_API_LIST)
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject);
            let array = jsonObject.treasureHunts;
            for (let i = 0; i < array.length; i++) {

                document.getElementById("titleFive").style.display = "block";
                document.getElementById("secondResult").style.display = 'block';

                list = document.getElementById("secondResult");

                let uuid = array[i].uuid;
                let listItem = document.createElement("li");
                listItem.innerHTML = "<a href='https://codecyprus.org/th/test-api/start?player=Jacobs&app=Team2&treasure-hunt-id=" + uuid + "'>" + array[i].description + "</a>";
                list.appendChild(listItem);
            }

        })
}

function getTwentyChallengesTest() {


    fetch(THIRD_TESTING_API_LIST)
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject);
            let array = jsonObject.treasureHunts;

            for (let i = 0; i < array.length; i++) {
                list = document.getElementById("thirdResult");
                document.getElementById("titleSix").style.display = "block";
                document.getElementById("thirdResult").style.display = "block";

                let uuid = array[i].uuid;
                let listItem = document.createElement("li");
                listItem.innerHTML = "<a href='https://codecyprus.org/th/test-api/start?player=Jacobs&app=Team2&treasure-hunt-id=" + uuid + "'>" + array[i].description + "</a>";

                list.appendChild(listItem);
            }

        })
}

function clearTheTestList() {
    document.getElementById("titleFour").style.display = "none";
    document.getElementById("firstResult").innerHTML = " ";
    document.getElementById("titleFive").style.display = "none";
    document.getElementById("secondResult").innerHTML = " ";
    document.getElementById("titleSix").style.display = "none";
    document.getElementById("thirdResult").innerHTML = " ";
    document.getElementById("firstTest").style.display = 'block';
    document.getElementById("secondTest").style.display =   'block';
    document.getElementById("thirdTest").style.display = 'block';

}


function getStartTest() {
    fetch(TESTING_API_START)
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject);

            let array = jsonObject.errorMessages;
            for (let i = 0; i < array.length; i++) {

                list = document.getElementById("errorResults");
                document.getElementById("titleEight").style.display = "block";
                document.getElementById("startResults").style.display = "block";
                let uuid = array[i].uuid;
                let listItem = document.createElement("li");
                listItem.innerHTML = "<a href='https://codecyprus.org/th/test-api/start?player=Jacobs&app=Team2&treasure-hunt-id=" + uuid + "'>" + array[i].value + "</a>";
                list.appendChild(listItem);
            }
        });
}

function clearTheTestStart() {
    document.getElementById("titleEight").style.display = "none";
    document.getElementById("errorResults").innerHTML = " ";
    document.getElementById("startTest").style.display = "block";
}

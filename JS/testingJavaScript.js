//JAVASCRIPT FOR TESTING

const TESTING_API_LIST = "https://codecyprus.org/th/test-api/list?number-of-ths=2";
const TESTING_API_START = "https://codecyprus.org/th/test-api/start?player=inactive";



let list = document.getElementById("challenges");
function getChallengesTest() {
    fetch("https://codecyprus.org/th/test-api/list?number-of-ths=2")
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

    function getStartTesting(uuid){
    fetch("https://codecyprus.org/th/test-api/start?player=Kostas&app=Team2&treasure-hunt-id=" + uuid)
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
//JAVASCRIPT FOR TESTING

const TESTING_API_LIST = "https://codecyprus.org/th/test-api/list?number-of-ths=2";

function getTestingList(){
fetch(TESTING_API_LIST)
    .then(response =>response.json()) //ParseJSON text to JavaScript object
    .then(jsonObject => {
        console.log(jsonObject); //TODO - Success, do something with the data.





        for(let i=0; i<array.length; i++){
            let uuid = array[i].uuid;
            let listItem = document.createElement("li");
            let array = jsonObject.treasureHunts;
            listItem.innerHTML =  "<a href='https://codecyprus.org/th/test-api/start?player=Jacobs&app=Team2&treasure-hunt-id="+uuid+"'>" + array[i].name + "</a>";

            list.appendChild(listItem);
        }
        console.log(array);
    });
}
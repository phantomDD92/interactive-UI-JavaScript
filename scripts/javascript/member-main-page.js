import {fetchData} from '../data/memberData.mjs';
import {states} from "../data/states.mjs";

const congressNumber = 117;
const params = new URLSearchParams(window.location.search);
const congressType = params.get('chamber') || 'senate';

if (congressType === 'house') {
    document.querySelector('.senate').style.display = 'none';
    document.querySelector('.house').style.display = 'block';
}

const tableBody = document.getElementById('member-data'); // member-data is the id of the table body element in html
const checkBoxes = document.querySelectorAll('.form-check-input');
const loader = document.querySelector('#loading');
const warning = document.querySelector('.alert');
let wholeData = '';     // wholeData const is created here instead of in init() function to be able to use it in the addEventListener function at the bottom

init();

async function init() {
    try {
        showWarning(false);
        showLoader();
        const {result} = await fetchData(congressNumber, congressType);
        wholeData = result.results[0]['members'];
        showContent();
    } catch ({error}) {
        console.log('errorrrrrr', error);
        checkBoxes.forEach(checkBox => checkBox.disabled = true);  // To disable the checkboxes in case there is no data to block calling showContent Function
        showWarning();
    }
    showLoader(false);
}

// Second way ///
//  function init() {
//     showWarning(false);
//     showLoader();
//     fetchData(congressNumber, congressType)
//         .then(({result}) => {
//             wholeData = result.results[0]['members'];
//             showContent();
//     })
//         .catch(({error}) => {
//             console.log('errorrrrrr', error);
//             checkBoxes.forEach(checkBox => checkBox.disabled = true);  // To disable the checkboxes in case there is no data to block calling showContent Function
//             showWarning();
//       }).finally(() => showLoader(false))
// }

function showContent() {
    initTable(wholeData);
    const stateAbbreviationsInMemberData = statesInWholeMemberData(wholeData);
    createStatesDropDown(stateAbbreviationsInMemberData);
}

function showLoader(show = true) {
    loader.style.visibility = show ? 'visible' : 'hidden';
}

function showWarning(show = true) {
    warning.style.display = show ? 'block' : 'none';
}

// function init() {            // This is the second way of async function by using then instead of await.
//     showLoader();
//     fetchData(117, congressType)
//         .then((response) => {
//             const wholeData = response.results[0]['members'];
//             initTable(wholeData);
//             const stateAbbreviationsInMemberData = statesInWholeMemberData(wholeData);
//             createStatesDropDown(stateAbbreviationsInMemberData);
//             showLoader(false);
//         });
// }


// const {members : wholeData} = (congressType === 'senate') ?  //This code was from the time when using local data  // Destructing has been used here.
//     senateData.results[0] :                                                         // This gets whole data about senate or house members according to the url parameter from json file  and renaming it as wholeData
//     houseData.results[0];                                                           // If no url parameters then we are getting senate data as default.

// const wholeData = congressType === 'senate' ? senateData.results[0].members : houseData.results[0].members; // This is another way without using distracting


const statesInWholeMemberData = (wholeMemberData) => {
    const stateAbbreviationsInMemberData = [...new Set(wholeMemberData.map(({state}) => state))].sort(); // This line gets all the state values from the whole member data.
                                                                                                        // To remove the duplicated values; first set is created and set is converted back to an array
                                                                                                        // This is an array like ['AL', 'AK', 'AZ',.....], But it keeps only the abbreviations, not the names.

    return states.filter(state => stateAbbreviationsInMemberData.includes(state.abbreviation));          // This line filters the state list according to the states used in the member data.
}

function initTable(wholeMemberData) {
    tableBody.innerHTML = '';
    const filteredMemberData = filterData(wholeMemberData);
    createTable(filteredMemberData);
}

function createStatesDropDown(stateData) {
    const statesDropdown = document.getElementById('stateList'); // stateList is the id of the dropdown element in html
    stateData.forEach(({name, abbreviation}) => {
        const dropdownOption = document.createElement('option');
        dropdownOption.value = abbreviation;
        const optionText = document.createTextNode(name);
        dropdownOption.appendChild(optionText);
        statesDropdown.appendChild(dropdownOption);
    })
}

function filterData(wholeMemberData) {
    // const selectedState = Array.from(document.querySelectorAll('#stateList option')).filter(({selected}) => selected)[0]  // This line and the following line is the sam.
    const [selectedState] = Array.from(document.querySelectorAll('#stateList option')).filter(({selected}) => selected); // This line is to get the selected state from the dropdown.
                                                                                                                                    // This array has only one element which is the object of selected dropdown element.
    const checkedParties = Array.from(document.querySelectorAll('.form-check-input'))  // This line returns all the check-box elements as an object of each in an array.
        //.filter(member => member.checked)  // This is the first way. The bottom line is destructing.
        .filter(({checked}) => checked)  // This line is to filter the unchecked items from the array.
        //.map(member => member.value)  // This is the first way. The bottom line is destructing.
        .map(({value}) => value); // This line is to get the checked items' values in an array like ['R', 'D', 'ID']

    // This part first filters the data according to party checkboxes and state dropdown and map the data about the members to have only the required data like name, state, party ...
    // [{name: xxx, party: D, state: MI,....}, {name: yyy, party: R, state: NY,....}, {}, .... {}] 102 objects (if not  filtered) inside the array and
    // each object has these properties: name, party, state, yearsInOffice, votePercentageWithParty and linkUrl.
    const filteredDataByParty = checkedParties.length !== 0 ?  // This line checks if any checkboxes is selected.
        wholeMemberData.filter(({party}) => checkedParties.includes(party)) : // This line filters the member list by party according to checked checkboxes
        wholeMemberData;                                     // In case no checkbox is selected then no need to filter the data by party because we show whole data in the table in this case

    const filteredMemberData = selectedState.value !== "" ?  // This line checks if the state dropdown doesn't have the default value ('Select A State')
        filteredDataByParty.filter(({state}) => state === selectedState.value) :   // This line filters the member list according to selected states from the dropdown
        filteredDataByParty;                                   // In case the dropdown has the default value no need to filter the data according to dropdown.

    return filteredMemberData         // These lines are mapping the member data after the filters with the summary data (name, party, state,...)
        .map(member => ({
            name: `${member.first_name} ${member.last_name}`,
            party: member.party || 'N/A',  // If a property is undefined then we replace it with sting 'N/A'
            state: member.state || 'N/A',
            yearsInOffice: member.seniority || 'N/A',
            votePercentageWithParty: member.votes_with_party_pct || 'N/A',
            linkUrl: member.url
        }));
}

function createTable(filteredMemberData) {
    filteredMemberData.forEach(createTableRow)
}

function createTableRow(member) {    // member = {name: xxx, party: D, state: MI,....} and getting the next object in each iteration
    const tableRow = document.createElement('tr');
    Object.values(member).forEach((value, index, array) => {   // Object.values(member) is ['xxx', 'D', 'MI,....]
        if (index < array.length - 1){                // This condition is to filter the urls not to show in the table. Only one array has been created (summarySenateData).
                                                    // Another array for the urls wasn't created to have the consistency.
            const rowCell = document.createElement('td');
            const rowCellText = (index === 0 && array[array.length - 1])  // This condition means: we are creating anchor tag in the name of a member in case;
                ? createAnchorTag(value, array[array.length - 1])                       // both the index is 0 which means we are creating the name cell in the table and the
                : document.createTextNode(`${value}`);                                     // member in the loop has an url. If this condition is false then we only show the name as plain text, not as a link.
            rowCell.appendChild(rowCellText);
            tableRow.appendChild(rowCell);
        }
    })
    tableBody.appendChild(tableRow);
}

function createAnchorTag(anchorText, urlValue) {
    const anchorTag = document.createElement('a');
    const anchorTagText = document.createTextNode(anchorText);
    anchorTag.href = urlValue;
    anchorTag.target = '_blank';
    anchorTag.appendChild(anchorTagText);
    return anchorTag;
}

Array.from(document.querySelectorAll('.form-check-input'))      //   ?????????????????????????????????????????????????????
    .forEach(element => element                                          // When init() function is called, api call is done again even though we do not need.
        .addEventListener('click', (event) => showContent()));                  // If "Top level await" is used to get the data which will be used (as in statistics.js file) then we don't have this problem
                                                                            // But is we use async/await, then we are making api calls again and again since other functions are depended on wholeData which is a promise.
document.querySelector('#stateList').addEventListener('change', event => showContent());


//    ////////////////// To get the property names //////////////////
//     if(index === 0) {
//         console.log(Object.keys(member).map(key => key.charAt(0).toUpperCase() + key.slice(1)));

//    //          -----Second way-----
//    //         console.log(Object.keys(member).map(key => {
//    //             const [firstLetter, ...rest] = key.split('');
//    //             return firstLetter.toUpperCase() + rest.join('');
//    //         }))
//     }
//    ///////////////////////////////////////////////////////////////


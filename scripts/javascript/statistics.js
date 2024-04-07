import {fetchData} from '../data/memberData.mjs';
import {statistics} from "../data/statisticData.mjs";

const congressNumber = 117;

// Retrieve the params
const params = new URLSearchParams(window.location.search);
const pageType = params.get('page') || 'attendance'; // In case the url param for page is undefined, 'attendance' is set as default
const congressType = params.get('chamber') || 'senate'; // In case the url param for chamber is undefined, 'senate' is set as default

// Retrieve the elements
const descriptionContainer = document.getElementById('description');
const glanceTableTitle = document.getElementById('glance-table-title');
const glanceTableColumnTitles = document.getElementById('glance-table-col-titles');
const glanceTableBody = document.getElementById('glance-data');
const leastTableTitle = document.getElementById('least-table-title');
const leastTableColumnTitles = document.getElementById('least-table-col-titles');
const leastTableBody = document.getElementById('least-data');
const mostTableTitle = document.getElementById('most-table-title');
const mostTableColumnTitles = document.getElementById('most-table-col-titles');
const mostTableBody = document.getElementById('most-data');
const loader = document.querySelector('#loading');
const warning = document.querySelector('.alert');

const partyNames = {
    D: 'Democrats',
    R: 'Republicans',
    ID: 'Independents'
};

init();

async function init() {
    try {
        showWarning(false);
        showLoader();
        const {result} = await fetchData(congressNumber, congressType);
        const wholeData = result.results[0]['members'];
        const partyStatisticsData = getPartyStatisticsData(wholeData);
        const partyDataOfTotal = getPartyStatisticsTotal(wholeData);
        partyStatisticsData.push(partyDataOfTotal);     // This is to add the last row about the total values of the glance table
        statistics[pageType][congressType]['glance'].data = partyStatisticsData;
        assignDataToObject('least', wholeData);
        assignDataToObject('most', wholeData);
        showAllContent();
    } catch ({error}) {
        console.log('errorrrrrr', error);
        addDescription();
        showWarning();
    }
    showLoader(false);
}

function showLoader(show = true) {
    loader.style.visibility = show ? 'visible' : 'hidden';
}

function showWarning(show = true) {
    warning.style.display = show ? 'block' : 'none';
}

function showAllContent() {
    const {data: glanceData} = statistics[pageType][congressType]['glance'];
    const {data: leastData} = statistics[pageType][congressType]['least'];  //destructing
    const {data: mostData} = statistics[pageType][congressType]['most'];
    addDescription();
    createGlanceTable(glanceData);
    createLeastTable(leastData);
    createMostTable(mostData);
}

// Set the data from according to the chamber
// const {members: wholeData} = congressType === 'senate' ? // This code is from the time when using local data
//     senateData.results[0] :
//     houseData.results[0];


// gather and form the data for the glance table
function getRepeatNumberOfParties(wholeData) {
    return wholeData.filter(({party}) => party !== undefined)
        .map(member => getPartyFullName(member.party))                                                  // Here we first we update the abbreviations with the real names of the parties with map method.
        .reduce((partyRepeatNumbersObject, party) => {                                                  // map method returns an array like ['Democrats', 'Republicans', 'Independents']
            partyRepeatNumbersObject[party] = (partyRepeatNumbersObject[party] || 0) + 1;                   // Then we calculate the repeat numbers of each party and put it in an object with reduce method.
            return partyRepeatNumbersObject;                                                                // // reduce method returns an object like {Democrats:49, Republicans: 51, Independents: 2}
        }, {});
}

function getPartyStatisticsTotal(wholeData) {
    const repeatNumberOfParties = getRepeatNumberOfParties(wholeData);
    const partyStatisticsTotal = {
        party: 'Total',
        repeatNumber: Object.values(repeatNumberOfParties).reduce((first, second) => first + second),
        percentage: Object.keys(getRepeatNumberOfParties(wholeData))
            .map(partyName => {
                const partyAbbreviation = getPartyAbbreviation(partyName);
                return averagePercentageValuesPerParty(partyAbbreviation, wholeData);
            }).reduce((first, second) => first + second).toFixed(2)
    }
    return partyStatisticsTotal;
}

function getPartyStatisticsData(wholeData) {
    const repeatNumberOfParties = getRepeatNumberOfParties(wholeData);
    return Object.entries(repeatNumberOfParties).reduce((partyStatistics, [party, repeatNumber]) => { // Object.entries returns an array with arrays inside like [['Democrats', 49],['Republicans', 51],['Independents','2']]
        const partyAbbreviation = getPartyAbbreviation(party);
        const percentage = averagePercentageValuesPerParty(partyAbbreviation, wholeData).toFixed(2);                       // Reduce method returns an array with objects in.
        partyStatistics.push({party, repeatNumber, percentage});                  // The objects are holding the statistics of each party name, repeat, percentage
        return partyStatistics;
    }, []);
}


// gather and form the data for the attendance least and most table
function getAttendanceData(wholeData) {
    return wholeData.map(member => ({       // Here the whole data is already either Senate or House and we are mapping senate or house data with three properties.
        name: `${member.first_name} ${member.last_name}`,
        missedVotes: member.missed_votes,
        percentageMissedVotes: member.missed_votes_pct,
        linkUrl: member.url
    }))
        .filter(({
                     percentageMissedVotes,
                     missedVotes
                 }) => (percentageMissedVotes !== undefined && missedVotes !== undefined)); // we use specifically undefined to be able to get the value of 0(zero)
}

// gather and form the data for the loyalty least and most table
function getLoyaltyData(wholeData) {
    return wholeData.map(member => ({       // Here the whole data is already either Senate or House and we are mapping senate or house data with three properties.
        name: `${member.first_name} ${member.last_name}`,
        totalVotes: member.total_votes,
        votesWithParty: member.votes_with_party_pct,
        linkUrl: member.url
    }))
        .filter(({votesWithParty, totalVotes}) => (votesWithParty !== undefined && totalVotes !== undefined));      // we use specifically undefined to be able to get the value of 0(zero)
}


function averagePercentageValuesPerParty(partyAbbreviation, wholeData) {
    const propertyToCalculate = pageType === 'attendance' ? 'missed_votes_pct' : 'votes_with_party_pct';
    const sumOfPropertyValuesPerParty = wholeData.filter(({party}) => party === partyAbbreviation)
        .filter(member => member[propertyToCalculate] !== undefined)
        .map(member => member[propertyToCalculate])
        .reduce((previousMember, currentMember) => previousMember + currentMember);
    const repeatNumberOfParties = getRepeatNumberOfParties(wholeData);
    return sumOfPropertyValuesPerParty / repeatNumberOfParties[getPartyFullName(partyAbbreviation)];
}

function getPartyFullName(partyAbbreviation) {
    return partyNames[partyAbbreviation];
}

function getPartyAbbreviation(partyFullName) {
    return Object.entries(partyNames).find(([_, partyName]) => partyName === partyFullName)?.[0];

}

function addDescription() {
    const title = document.createElement('h4');
    addTitleText(title, 'generalInfo')
    descriptionContainer.appendChild(title);
    addParagraphs();
}

function createGlanceTable(glanceData) {
    addTitleText(glanceTableTitle, 'glance', 'right');
    addTableColumnTitles(glanceTableColumnTitles, 'glance');
    glanceData.forEach(createGlanceTableRows);   // glanceData = [{party: 'Democrats', repeats: 49, percentage: 48}, {}, {}]    partyStats = {party: 'Democrats', repeats: 49, percentage: 48} and every iteration it takes the next party
}

function createLeastTable(leastData) {
    addTitleText(leastTableTitle, 'least');
    addTableColumnTitles(leastTableColumnTitles, 'least');
    leastData.forEach(createLeastMostTableRows(leastTableBody));
}

function createMostTable(mostData) {
    addTitleText(mostTableTitle, 'most');
    addTableColumnTitles(mostTableColumnTitles, 'most');
    mostData.forEach(createLeastMostTableRows(mostTableBody));
}

function addTitleText(tableTitle, tableType, alignment = 'left') {
    tableTitle.textContent = statistics[pageType][congressType][tableType].title;
    tableTitle.style.textAlign = alignment;
}

function addTableColumnTitles(tableColumnTitles, tableType) {
    const columnTitles = statistics[pageType][congressType][tableType]['columnTitles'];
    Object.values(columnTitles).forEach(title => {
        const rowCell = document.createElement('th');
        rowCell.scope = 'col';
        const rowCellText = document.createTextNode(`${title}`);
        rowCell.appendChild(rowCellText);
        tableColumnTitles.appendChild(rowCell);
    })
}

function addParagraphs() {
    statistics[pageType][congressType]['generalInfo'].description.forEach(text => {
        const paragraph = document.createElement('p');
        const paragraphText = document.createTextNode(text);
        paragraph.appendChild(paragraphText);
        descriptionContainer.appendChild(paragraph);
    })
}

function createLeastMostTableRows(tableName) {
    return function (statisticData) {
        const tableRow = document.createElement('tr');
        Object.values(statisticData).forEach((value, index, array) => {   // For Glance table: Object.values(partyStats) = ['Democrats', 49, 48] and every iteration it will get the next party's statistics.
            if (index < array.length - 1) {      // Not to add the url link into the table
                const tableCell = document.createElement('td');

                const tableCellText = (index === 0 && array[array.length - 1])   // This condition to add the url links to names
                    ? createAnchorTag(value, array[array.length - 1])
                    : (index === 2)                                 // this condition to put the % sign only in percentage value cell
                        ? document.createTextNode(`${value}%`)
                        : document.createTextNode(`${value}`);

                tableCell.appendChild(tableCellText);
                if (index !== 0) {
                    tableCell.style.textAlign = 'center';                  // To center only the numbers not the party names.
                }
                tableRow.appendChild(tableCell);
            }
        })
        tableName.appendChild(tableRow);
    };
}

function createGlanceTableRows(statisticData) {
    const tableRow = document.createElement('tr');
    Object.values(statisticData).forEach((value, index) => {   // For Glance table: Object.values(partyStats) = ['Democrats', 49, 48] and every iteration it will get the next party's statistics.
        const tableCell = document.createElement('td');
        const tableCellText = index === 2 ?                       // to put the % sign only in percentage value cell
            document.createTextNode(`${value}%`) :
            document.createTextNode(`${value}`);
        tableCell.appendChild(tableCellText);
        if (index !== 0) {
            tableCell.style.textAlign = 'center';                  // To center only the numbers not the party names.
        }
        tableRow.appendChild(tableCell);
    })
    glanceTableBody.appendChild(tableRow);
}

function createAnchorTag(anchorText, urlValue) {
    const anchorTag = document.createElement('a');
    const anchorTagText = document.createTextNode(anchorText);
    anchorTag.href = urlValue;
    anchorTag.target = '_blank';
    anchorTag.appendChild(anchorTagText);
    return anchorTag;
}

function assignDataToObject(tableType, wholeData) {
    statistics[pageType][congressType][tableType].data = pageType === 'attendance' ?
        sortData(getAttendanceData(wholeData), 'missedVotes', tableType, wholeData) :
        sortData(getLoyaltyData(wholeData), 'votesWithParty', tableType, wholeData);
}

function sortData(data, property, tableType, wholeData) {
    const N = wholeData.length / 10;
    const sortedData = data.sort((memberA, memberB) => {
        return tableType === 'least' ?
            memberA[property] - memberB[property] :
            memberB[property] - memberA[property];
    });
    return sortedData.slice(0, N);
}


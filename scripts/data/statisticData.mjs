export let statistics = {
    attendance: {
        house: {
            generalInfo: {
                title: 'Attendance - house',
                description: [
                    'attendance-house:The Constitution specifies that a majority of members constitutes a quorum to do business in each ' +
                    'house. Representatives and senators rarely force the presence of a quorum by demanding quorum calls; ' +
                    'thus, in most cases, debates continue even if a majority is not present.',

                    'The House uses roll-call votes; a clerk calls out the names of all the senators&, each ' +
                    'senator stating "aye" or "no" when his or her name is announced. The House ' +
                    'reserves roll-call votes for the most formal matters, as a roll-call of all 435 ' +
                    'representatives takes quite some time; normally, members vote by electronic device. In ' +
                    'the case of a tie, the motion in question fails. In the Senate, the Vice President ' +
                    'may (if present) cast the tiebreaking vote.'
                ]
            },
            glance: {
                title: 'House at a Glance',
                columnTitles: {
                    first: 'Party',
                    second: 'No. of Reps',
                    third: '% Missed Votes with Party'
                },
                data: undefined
            },
            least: {
                title: 'Least Engaged (Bottom 10% Attendance)',
                columnTitles: {
                    first: 'Name',
                    second: 'No. Missed Votes',
                    third: '% Missed'
                },
                data: undefined
            },
            most: {
                title: 'Most Engaged (Top 10% Attendance)',
                columnTitles: {
                    first: 'Name',
                    second: 'No. Missed Votes',
                    third: '% Missed'
                },
                data: undefined
            }
        },
        senate: {
            generalInfo: {
                title: 'Attendance - senate',
                description: [
                    'attendance-senate:The Constitution specifies that a majority of members constitutes a quorum to do business in each ' +
                    'house. Representatives and senators rarely force the presence of a quorum by demanding quorum ' +
                    'calls; thus, in most cases, debates continue even if a majority is not present.',

                    'The Senate uses roll-call votes; a clerk calls out the names of all the senators&, each ' +
                    'senator stating "aye" or "no" when his or her name is announced. The House ' +
                    'reserves roll-call votes for the most formal matters, as a roll-call of all 435 ' +
                    'representatives takes quite some time; normally, members vote by electronic device. In ' +
                    'the case of a tie, the motion in question fails. In the Senate, the Vice President ' +
                    'may (if present) cast the tiebreaking vote.'
                ]
            },
            glance: {
                title: 'Senate at a Glance',
                columnTitles: {
                    first: 'Party',
                    second: 'No. of Reps',
                    third: '% Missed Votes with Party'
                },
                data: undefined
            },
            least: {
                title: 'Least Engaged (Bottom 10% Attendance)',
                columnTitles: {
                    first: 'Name',
                    second: 'No. Missed Votes',
                    third: '% Missed'
                },
                data: undefined
            },
            most: {
                title: 'Most Engaged (Top 10% Attendance)',
                columnTitles: {
                    first: 'Name',
                    second: 'No. Missed Votes',
                    third: '% Missed'
                },
                data: undefined
            }
        }
    },

    loyalty: {
        house: {
            generalInfo: {
                title: 'Party Loyalty - house',
                description: [
                    'loyalty-house:Those who consider themselves to be strong partisans, strong Democrats and strong Republicans ' +
                    'respectively, tend to be the most faithful in voting for their party\'s nominee for office ' +
                    'and legislation that backs their party\'s agenda.'
                ]
            },
            glance: {
                title: 'House at a Glance',
                columnTitles: {
                    first: 'Party',
                    second: 'No. of Reps',
                    third: '% Voted with Party'
                },
                data: undefined
            },
            least: {
                title: 'Least Loyal (Bottom 10% of Party)',
                columnTitles: {
                    first: 'Name',
                    second: 'No. Party Votes',
                    third: '% Party Votes'
                },
                data: undefined
            },
            most: {
                title: 'Most Loyal (Top 10% of Party)',
                columnTitles: {
                    first: 'Name',
                    second: 'No. Party Votes',
                    third: '% Party Votes'
                },
                data: undefined
            }
        },
        senate: {
            generalInfo: {
                title: 'Party Loyalty -  senate',
                description: [
                    'loyalty-senate:Those who consider themselves to be strong partisans, strong Democrats and strong Republicans ' +
                    'respectively, tend to be the most faithful in voting for their party\'s nominee for office ' +
                    'and legislation that backs their party\'s agenda.'
                ]
            },
            glance: {
                title: 'Senate at a Glance',
                columnTitles: {
                    first: 'Party',
                    second: 'No. of Reps',
                    third: '% Voted with Party'
                },
                data: undefined
            },
            least: {
                title: 'Least Loyal (Bottom 10% of Party)',
                columnTitles: {
                    first: 'Name',
                    second: 'No. Party Votes',
                    third: '% Party Votes'
                },
                data: undefined
            },
            most: {
                title: 'Most Loyal (Top 10% of Party)',
                columnTitles: {
                    first: 'Name',
                    second: 'No. Party Votes',
                    third: '% Party Votes'
                },
                data: undefined
            }
        }
    }
};
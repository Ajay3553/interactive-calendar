const HOLIDAYS = {
    '1-1':{
        name: 'New Year\'s Day',
        emoji: '🎉'
    },
    '1-14':{
        name: 'Makar Sankranti',
        emoji: '🪁'
    },
    '1-26':{
        name: 'Republic Day',
        emoji: '🇮🇳'
    },
    '3-8':{
        name: "Women's Day",
        emoji: '💜'
    },
    '4-14':{
        name: 'Ambedkar Jayanti',
        emoji: '📖'
    },
    '6-5':{
        name: 'World Env. Day',
        emoji: '🌿'
    },
    '8-15':{
        name: 'Independence Day',
        emoji: '🇮🇳'
    },
    '10-2':{
        name: 'Gandhi Jayanti',
        emoji: '☮️'
    },
    '11-14':{
        name: "Children's Day",
        emoji: '🧒'
    },
    '12-25':{
        name: 'Christmas',
        emoji: '🎄'
    },
}

export function getHoliday(date) {
    const key = `${date.getMonth() + 1}-${date.getDate()}`
    return HOLIDAYS[key] || null
}
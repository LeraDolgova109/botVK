const {VK_ID_REG_EX, VK_RETRIEVE_ID_REG_EX, NUMBER_ID, NUMBER_ID_RETRIEVE} = require('./regex')

function rnd() {
    return Math.random() * 100000
}

function retrieveId(text = '') {
    if(typeof text === 'string') {
        if(VK_ID_REG_EX.test(text)) {
            const [, id] = text.match(VK_RETRIEVE_ID_REG_EX)
            return +id
        }
        if(NUMBER_ID.test(text)) {
            const [id] = text.match(NUMBER_ID_RETRIEVE)
            return +id
        }
        return null
    }
}

function someFit(message, regexes) {
    return regexes.reduce((carry, regex) => {
        return carry || regex.test(message)
    }, false)
}

function bytes(value) {
    return (new TextEncoder().encode(value)).length
}

async function getStore(bot, key, userId) {
    const raw = await bot.execute('storage.get', {key: key, user_id: userId})
    return raw;
}

async function getAllStoreKeys(bot, userId) {
    const raw = await bot.execute('storage.getKeys', {user_id: userId})
    return raw;
}

async function dropStore(bot, key, userId) {
    await bot.execute('storage.set', {key: key, user_id: userId, value: null})
}

async function rndWait() {
    const ms = Math.round(Math.random() * 600);
    return wait(ms);
}

async function wait(ms) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res();
        }, ms)
    })
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }

module.exports = {
    rnd,
    retrieveId,
    someFit,
    bytes,
    getStore,
    getAllStoreKeys,
    dropStore,
    wait,
    rndWait,
    getRandomInt
}
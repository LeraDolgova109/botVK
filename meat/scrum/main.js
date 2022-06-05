const {getRandomInt} = require("../utils")
const {CARDS, WORDS} = require("../const")
const {Scrum} = require('./base')

const {
    JOKE_R, JOKE_RR, START_R, WORD_R, WORD_RR, END_R
} = require('../regex')

const COMMANDS = {
    joke: {
        test: JOKE_R,
        retrieve: JOKE_RR
    },
    start: {
        test: START_R
    },
    word7: {
        test: WORD_R,
        retrieve: WORD_RR
    },
    EndOfGame: {
        test: END_R
    }
};

const EVENTS = {
    'eventExample': [
        'nameOfMethod'
    ]
}

class Main extends Scrum {
    commands;
    // word = null;
    // cards = new Set();
    // usedCards = new Set();
    // score = 0;
    // countRounds = 0;
    word = {};
    cards ={};
    usedCards = {};
    score = {};
    countRounds = {};

    constructor(props) {
        super(props);
        this.prepareCommands(COMMANDS)
        this.prepareEvents(EVENTS)
    }

    async nameOfMethod(ctx) {
    }

    async joke(ctx, {tst}) {
        await ctx.reply(`hi ${tst}`)
    }

    async start(ctx){
        const peer = ctx.message.from_id
        await this.write(ctx.message.from_id, {message: `Привет! Сыйграйте 10 раундов, чтобы узнать, кто вы!!! `+
                `Чтобы ввести ответ воспользуйтесь командой "Картинка" `+
                `Если вам надоест, пишите "Закончить"`})
        this.word[peer] = null;
        this.cards[peer] = new Set();
        this.usedCards[peer] = new Set();
        this.score[peer] = 0;
        this.countRounds[peer] = 0;
        await this.RoundInGame(ctx);
    }

    async RoundInGame(ctx){
        const peer = ctx.message.from_id
        let cards = new Set();
        while (cards.size<5){
            var newCard = getRandomInt(1,98)
            if (!this.usedCards[peer].has(newCard)){
                cards.add(newCard);
                this.usedCards[peer].add(newCard);
            }
        }
        let i = 0;
        let attachment = [...cards.values()].reduce((carry, n) => {
            if(i === 0) {
                carry += CARDS[n];
            } else {
                carry += ',' + CARDS[n]
            }
            i++;
            return carry;
        },"")

        const cardsArr = [...cards.values()];
        const allWords = cardsArr.reduce((carry, card) => {
            carry.push(...WORDS[card])
            return carry;
        }, []);

        var duplicate = {};
        for(const word of allWords) {
            if(!duplicate[word]) {
                duplicate[word] = 1;
            } else {
                ++duplicate[word]
            }
        }
        var uniqueWords = Object.entries(duplicate).filter(
            ([word, count]) => count === 1
        ).map(([word]) => word);
        const word = uniqueWords[getRandomInt(0, uniqueWords.length-1)]
        this.word[peer] = word;
        this.cards[peer] = cards;
        await this.write(ctx.message.from_id, {attachment, message: "Ваши карточки"})
        await this.write(ctx.message.from_id, {message: `Угадайте картинку по слову ${word}`})
    }

    async word7(ctx, { word } ){
        const peer = ctx.message.from_id
        const picNumber = +word;
        if(this.cards[peer].has(picNumber)) {
            if(this.word[peer] && this.cards[peer].size) {
                const scheme = Object.entries(WORDS);
                for(const item of scheme) {
                    const [number, keywords] = item;
                    if (keywords.includes(this.word) && +number === picNumber) {
                        this.word[peer] = null;
                        this.cards[peer] = new Set();
                        this.score[peer] += 3;
                        await ctx.reply('+3')
                        ++this.countRounds[peer];
                        if(this.countRounds[peer] < 10){
                            return this.RoundInGame(ctx);
                        } else {
                            return this.EndOfGame(ctx);
                        }
                    }
                }

            }
        }
        this.word[peer] = null;
        this.cards[peer] = new Set();
        await ctx.reply('0')
        ++this.countRounds[peer];
        if(this.countRounds[peer] < 10){
            return this.RoundInGame(ctx);
        } else {
            return this.EndOfGame(ctx);
        }
    }

    async EndOfGame (ctx){
        const peer = ctx.message.from_id
        if(this.score[peer] === 30){
            await ctx.reply('Вы большой кот!');
            await this.write(ctx.message.from_id, {message: `Ваш счет ${this.score[peer]}`});
            this.score[peer] = 0;
            this.countRounds[peer] = 0;
            this.usedCards[peer] = new Set();
        }
        else if(this.score[peer] >= 24){
            await ctx.reply('Вы кот поменьше');
            await this.write(ctx.message.from_id, {message: `Ваш счет ${this.score[peer]}`});
            this.score[peer] = 0;
            this.countRounds[peer] = 0;
        }
        else if(this.score[peer] >= 15){
            await ctx.reply('Вы маленький кот, жесть');
            await this.write(ctx.message.from_id, {message: `Ваш счет ${this.score[peer]}`});
            this.score[peer] = 0;
            this.countRounds[peer] = 0;
            this.usedCards[peer] = new Set();
        }
        else if(this.score[peer] >= 6){
            await ctx.reply('Вы няшка');
            await this.write(ctx.message.from_id, {message: `Ваш счет ${this.score[peer]}`});
            this.score[peer] = 0;
            this.countRounds[peer] = 0;
            this.usedCards[peer] = new Set();
        } else {
            await ctx.reply('Ооо... победителевое');
            await this.write(ctx.message.from_id, {message: `Ваш счет ${this.score[peer]}`});
            this.score[peer] = 0;
            this.countRounds[peer] = 0;
            this.usedCards[peer] = new Set();
        }
    }
}



module.exports = {
    Main
}
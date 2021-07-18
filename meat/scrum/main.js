const {getRandomInt} = require("../utils")
const {CARDS, WORDS} = require("../const")
const {Scrum} = require('./base')

const {
    JOKE_R, JOKE_RR, START_R, WORD_R, WORD_RR
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
    }
};

const EVENTS = {
    'eventExample': [
        'nameOfMethod'
    ]
}

class Main extends Scrum {
    commands;
    word = null;
    cards = new Set();

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

        //console.log(ctx);
        let cards = new Set(); 
        while (cards.size<1){
            cards.add(getRandomInt(1,2));
        }
        //const ids = [...cards.values()].reduce( (carry, v) => {
            // carry += `ном ${v} `;
            // return carry;
            // } , '');
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
        let cardsArr = [...cards.values()];
        
        console.log({cardsArr});
        
        let rndCard = cardsArr[getRandomInt(0, cardsArr.length-1)]
        console.log({rndCard});

        let words = WORDS[rndCard];
        console.log({words});
        let word = words[getRandomInt(0, words.length-1)]
        
        this.word = word;
        this.cards = cards;
        console.log(word);
        await this.write(ctx.message.from_id, {attachment, message: "card"})
        await this.write(ctx.message.from_id, {message: `Угадайте картинку по слову ${word}`})
        // await ctx.reply(``)
    }

    async word7(ctx, {word}){
        const picNumber = +word;
        if(this.cards.has(picNumber)) {
            if(this.word && this.cards.size) {
                const scheme = Object.entries(WORDS);
                for(const item of scheme) {
                    const [number, keywords] = item;
                    console.log({number, picNumber, keywords});
                    if(keywords.includes(this.word) && +number === picNumber) {
                        this.word = null;
                        this.cards = new Set();
                        await ctx.reply('+3')
                
                        return ctx.reply('введите старт')
                    }
                }
                
            }
            
            
        }
        console.log("зашло");
                this.word = null;
                this.cards = new Set();
               await ctx.reply('0')
                
                return ctx.reply('введите старт')
    }
}

module.exports = {
    Main
}
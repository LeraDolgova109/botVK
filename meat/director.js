const {Main} = require('./scrum/main')

class Director {
    bot;

    constructor(bot) {
        this.bot = bot;
        this.main = new Main(bot)
    }

    async processCommand(ctx) {
        await this.main.processCommand(ctx)
    }

    async processEvent(ctx) {
        await this.main.processEvent(ctx)
    }
}


module.exports = {
    Director
}
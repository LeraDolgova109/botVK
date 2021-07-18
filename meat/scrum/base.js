const {rnd} = require("../utils");

class Scrum {
    bot;
    commands;
    handlers;

    constructor(bot) {
        this.bot = bot;
    }

    prepareCommands(commands) {
        this.commands = Object.entries(commands).map(
            ([key, value]) => {
                const command = {};
                command.testRx = value.test;
                command.retrieveRx = value.retrieve
                command.method = key;
                return command;
            }
        )
    }

    prepareEvents(events) {
        this.handlers = events
    }


    async processCommand(ctx) {
        const command = this.parseCommand(ctx)
        console.log({command});
        if(command) {
            const {method, args} = command
            await this[method](ctx, args);
        }
    }

    async processEvent(ctx) {
        const handlers = this.parseEvent(ctx);
        for(const handler of handlers) {
            await this[handler](ctx);
        }
    }

    parseCommand(ctx) {
        const message = ctx.message.text;
        for(const item of this.commands) {
            const {
                testRx, retrieveRx, method
            } = item

            if(Array.isArray(testRx)) {
                for(const rx of testRx) {
                    if(rx.test(message)) {
                        return {method}
                    }
                }
            }

            if(typeof testRx === 'object' && 'test' in testRx) {
                if(testRx.test(message)) {
                    let args = {};
                    if(retrieveRx) {
                        const {
                            groups
                        } = message.match(retrieveRx)
                        args = groups;
                    }
                    return {
                        method,
                        args
                    }

                }
            }
        }
    }

    parseEvent(ctx) {
        const eventType = ctx.message.action.type
        const handlers = this.handlers[eventType];
        return handlers || []
    }



    async reply(ctx, chatId, message, settings = {}) {
        return this.bot.execute('messages.send', {
            peer_id: chatId,
            forward: JSON.stringify({
                peer_id: chatId,
                conversation_message_ids: ctx.message.conversation_message_id
            }),
            message,
            random_id: rnd(),
            ...settings
        })
    }

    async writeMessage(chatId, message) {
        return this.write(chatId, {message})
    }

    async write(chatId, settings) {
        return this.bot.execute('messages.send', {
            peer_id: chatId,
            random_id: rnd(),
            ...settings
        })
    }
}

module.exports = {
    Scrum
}
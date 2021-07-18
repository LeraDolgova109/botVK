const VkBot = require('node-vk-bot-api');

const {
    GROUP_TOKEN,
    BUGTRACE_ID
} = require('./meat/const')
const {Director} = require('./meat/director')
const {rnd} = require('./meat/utils')

const bot = new VkBot({
    token: GROUP_TOKEN,
});

const director = new Director(bot);

function isEvent(ctx) {
    return !!ctx.message.action
}

function isCommand(ctx) {
    return !!ctx.message.text
}

async function panic(e) {
    await bot.execute('messages.send', {
        peer_id: '',
        message: `Произошла ошибка! - ` + e.message,
        random_id: rnd(),
    })
    if(e.message === 'ApiError') {
        await bot.execute('messages.send', {
            peer_id: BUGTRACE_ID,
            message: `Ошибка вк! - ` + e.response.error_msg,
            random_id: rnd(),
        })
    }
}

bot.on(async (ctx) => {
    try {
        if (ctx.message && typeof ctx.message.text === 'string') {
            if (isEvent(ctx)) {
                await director.processEvent(ctx)
            }
            if(isCommand(ctx)) {
                await director.processCommand(ctx)
            }
        }
    } catch (e) {
        console.log(e);
        return panic(e)
    }

})

bot.startPolling((err) => {
    console.log(err)
})

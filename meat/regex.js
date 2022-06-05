// BASE
const JOKE_R = /^test+\s+.*$/i;
const JOKE_RR = /^test\s+(?<tst>\S+.*)$/i;
const START_R = /^Старт$/i;
const WORD_R = /^Картинка\s+\d+$/i;
const WORD_RR = /^Картинка\s+(?<word>\d+)$/i;
const END_R = /^Закончить$/i;

module.exports = {
    JOKE_R,
    JOKE_RR,
    START_R,
    WORD_R,
    WORD_RR,
    END_R
}
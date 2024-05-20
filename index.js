const telegramBot = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')

const TOKEN = '6411597608:AAE2W8pAnvIG036RAU_5Yi2tK7Jx66so9yE'

const bot = new telegramBot(TOKEN, { polling: true })

const chats = {}

const startGame = async chatId => {
	await bot.sendMessage(
		chatId,
		`Сейчас я загадаю цифру от 0 до 9, а ты её угадай!`
	)
	const randomNum = Math.floor(Math.random() * 10)
	chats[chatId] = randomNum
	await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'Начальное приветствие' },
		{ command: '/info', description: 'Получить информацию' },
		{ command: '/game', description: 'Игра угадай число!' },
	])

	bot.on('message', async msg => {
		const text = msg.text
		const chatId = msg.chat.id

		if (text === '/start') {
			return bot.sendMessage(
				chatId,
				`Добро пожаловать в телеграм бот автора Ditsmon`
			)
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Тебя зовут: ${msg.from.first_name}`)
		}
		if (text === '/game') {
			return startGame(chatId)
		}
		return bot.sendMessage(chatId, 'Я тебя не понимаю!')
	})

	bot.on('callback_query', async msg => {
		const data = msg.data
		const chatId = msg.message.chat.id

		if (data === 'again') {
			return startGame(chatId)
		}
		if (data === chats[chatId]) {
			return await bot.sendMessage(
				chatId,
				`Поздравляю, ты угадал!`,
				againOptions
			)
		} else {
			return await bot.sendMessage(
				chatId,
				`Ты не угадал, бот загадал цифру ${chats[chatId]}`,
				againOptions
			)
		}
	})
}

start()

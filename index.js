const TelegramApi = require('node-telegram-bot-api');
//Добавим файл с опциями и сразу вытянем нужные поля (деструктуризация)
const {gameOptions, againOptions} = require('./options.js')

const token = '5044713303:AAEZ8Bv5y-2--BY6ahgFNH9IZOAnW22BX9I';

const bot = new TelegramApi(token,{polling: true})

//аналог базы данных, будет содержать ключи как idЧата 
//значение будет загаданное ботом число 
const chats = {};

//что бы отправить кнопки третим параметром через FORM напишем туда gameOptions



const startGame = async (chatId) => {
	await bot.sendMessage(chatId,`угадай число от 0 до 9 `);
	//фунукция random вернет число с плавающей точкой умножим его на 10 
	// округлим в меньшую сторону через floor
	const randomNumber = Math.floor(Math.random() * 10);
	//в объект chats по ключу chatId добавляем сгенирированный номер 
		chats[chatId] = randomNumber;
		//отправляем сообщение с просьбой угадать число
		await bot.sendMessage(chatId,`Отгадывай:`, gameOptions);
	//функция sendMessage третим параметром принимает объект form В нем можем отправлять кнопки на которые можно нажимать 
}


//функция запускающая наше приложение 
const start = () => {

//формируем список пользователдьских команд 
//setCommands  ПРИНИМАЕТ МАССИВ ОБЪЕКТОВ КОМАНД КЛЮЧ, ЗНАЧЕНИЕ
bot.setMyCommands([
	{command: '/start',description: 'Запустить'},
	{command: '/stop',description: 'Остановить'},
	{command: '/info',description: 'Информация о пользователе'},
	{command: '/game',description: 'Поиграем?'},
	])
	//повесим обработчик событий (event,message)
	bot.on('message', async msg => {
		const text = msg.text;
		const chatId = msg.chat.id;
	
			// console.log("new command")
			// bot.sendMessage(chatId,`ты написал мне ${text}`);
			
	if(text==="/start")
	{
		await bot.sendMessage(chatId,`Добро пожаловать в тестовый бот `)
		return bot.sendSticker(chatId,`https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/4.webp`)
	}
	
	if(text===`/info`)
	{
		return bot.sendMessage(chatId,`Ваше имя: ${msg.from.first_name}_${msg.from.last_name} `)
	}
	if(text===`/stop`)
	{
		return bot.sendMessage(chatId,`Заходи если что ;)`)
	}
	if(text===`/game`)
	{
		return startGame(chatId);
}
	return bot.sendMessage(chatId,`недопустимая команда`)
	})

	//прослушиваем кнопки на момент угадывания пользователем при нажатии на нее 
	bot.on('callback_query', async msg => {
		//  console.log(msg);
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if(data === '/again'){
			return startGame(chatId);
		}
		 if( data == chats[chatId]) {
				return bot.sendMessage(chatId,`угадал, ПОЗДРАВЛЯЮ!  ${chats[chatId]}`,againOptions);
			} else {
				 return bot.sendMessage(chatId,`ты не угадал ${chats[chatId]}`,againOptions);
				}
	
	})
}
start();
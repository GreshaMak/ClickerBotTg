

/*

    Разработчик: flaunchikTg
    Developer: flaunchikTg

*/

var txnId = require('./txnId');
const fs = require("fs")

const ADMINS = [6421186850] // ID админов бота
const DB_URL = 'mongodb+srv://accforstandoffer:4jqsNAfCCbHNJXhA@cluster0.0n54gse.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'// URL базы бота
const QIWI_TOKEN = "" // API ключ QIWI кошелька с полным доступом
const BOT_TOKEN = "6930882950:AAFMbZkx5P2pKMDm0pFuThb5EHmdL7nsO3I" // Bot API Token
  
var config = {
	payeer: {
	  enabled: true,
	  account: "P1039811657",
	  apiId: 1640942782,
	  apiPass: "RJ710BVjhs298Sis"
	}
  } 
  
oplata = 32

process.env.TZ = 'Moscow/Europe';


const mongo = require('mongoose');
mongo.connect(DB_URL);


var User = mongo.model('User', {
	id: Number,
	outbalance: Number,
	name: String,
	fc: Number,
	ref: Number,
	regDate: String,
	deposit: Number,
	payout: Number,
	fetuses: Number,
	menu: String,
	statusklik: String,
	ban: Boolean,
	refCount: Number,
	not: Boolean,
	data: String,
	spinsToday: Number,
	last_bonus_day: Number,
	bonuscount: Number,
	klik: Number,
});

const Config = mongo.model("configs", { parameter: String, value: Number, description: String })

const BestUser = mongo.model('BestUsers', { id: Number, username: String, id1: Number })
const FUser = mongo.model('FUsers', { id: Number, username: String, id1: Number })
const BigUser = mongo.model('BigUsers', { id: Number, username: String, id1: Number })

function addBal(user_id, sum) { User.findOneAndUpdate({ id: user_id }, { $inc: { buybalance: sum } }, {}).then((e) => { }) }
function addoutBal(user_id, sum) { User.findOneAndUpdate({ id: user_id }, { $inc: { outbalance: sum } }, {}).then((e) => { }) }

var Task = mongo.model('Task', {
	id: Number
});

const Ticket = mongo.model('Ticket', {
	id: Number,
	amount: Number,
	wallet: String
});

const Bonus = mongo.model("Bonus", new mongo.Schema({
	username: String,
	completed: Array,
	post_id: Number
}));

const Voucher = mongo.model("Voucher", { id: String, tree_id: Number })
function generateID(res) { var text = ""; var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; for (var i = 0; i < res; i++)text += possible.charAt(Math.floor(Math.random() * possible.length)); return text }

const Start = [
    ["💎 Личный кабинет"],
  ["🍇 Заработать", "👥 Партнёрка"],
	["🍉 Информация", "📊 Статистика"]
];

const Cancel = [
	["🚫 Отмена"]
];

const admin = [
	["📮 Каналы", "👀 Просмотры"],
	["👥 Статистика", "💰 Рассылка"],
	["/start"]
]

const AdminPanel = [
	["📬 Рассылка", "📮 Выплаты"],
	["📧 Информация"],
	["🔙 Назад"]
];

const RM_admin = {
	inline_keyboard: [
		[{ text: "✉️ Рассылка", callback_data: "admin_mm" }, { text: "📣 Создать промокод", callback_data: "a_voucherpromo" }],
		[{ text: "🔎 Управление", callback_data: "admin_u" }, { text: "📮 Выплаты", callback_data: "admin_w" }],
		[{ text: "👥 Топ рефоводов за 24 часа", callback_data: "admin_top" }],
		[{ text: "Обнуление", callback_data: "adminwipe" }, { text: "Кошельки", callback_data: "adminwipe" }],
		
	]
};

// Prog: @flaunchikTg

const Flaunchik_admin = {
	inline_keyboard: [
		[{ text: "👥 Вознаграждение за реферала", callback_data: "FL_admin1" }, { text: "📣 Создать промокод", callback_data: "a_voucherpromo" }],
		[{ text: "🔎 Управление", callback_data: "admin_u" }, { text: "📮 Выплаты", callback_data: "admin_w" }],
		[{ text: "👥 Топ рефоводов за 24 часа", callback_data: "admin_top" }],
		
	]
};

const RM_promo = {
	inline_keyboard: [
	[{ text: "💸 Для покупок", callback_data: "voucherbuy" }],
	[{ text: "💳 Для вывода", callback_data: "voucherout" }],
	]
}

const Promo = mongo.model("Promo", { id: String, sum: Number, activated: Boolean })
function generateID(res) { var text = ""; var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; for (var i = 0; i < res; i++)text += possible.charAt(Math.floor(Math.random() * possible.length)); return text } 

const RM_admin_return = { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "admin_return" }],] };

const RM_mm1 = {
	inline_keyboard: [
		[{ text: "⏹ Стоп", callback_data: "admin_mm_stop" }],
		[{ text: "⏸ Пауза", callback_data: "admin_mm_pause" }],
	]
};

const RM_mm2 = {
	inline_keyboard: [
		[{ text: "⏹ Стоп", callback_data: "admin_mm_stop" }],
		[{ text: "▶️ Продолжить", callback_data: "admin_mm_play" }],
	]
};

// Не где не слито

const { Qiwi } = require('node-qiwi-api');
const qiwi = new Qiwi(QIWI_TOKEN);

const Telegram = require('node-telegram-bot-api');
const bot = new Telegram(BOT_TOKEN, { polling: true });

bot.getMe().then(r => console.log(r));

bot.on('text', async (message) => {
	message.send = (text, params) => bot.sendMessage(message.chat.id, text, params);
	let $menu = [];
	var uid = message.from.id;
	var text = message.text;
	let dt = new Date
	console.log("[" + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + "] Пользователь " + uid + " отправил: " + text);
  
     if (dt.getDate() == oplata) return message.send('Хостинг не оплачен!');

	Start.map((x) => $menu.push(x));
	 if (ADMINS.find((x) => x == message.from.id)) $menu.push(["💎 Админочка"]);

	if (message.text) {
		if (message.text.startsWith('/start') || message.text == '🔙 Назад') {
			let $user = await User.findOne({ id: message.from.id });
			if (!$user) {
				let schema = {
					id: message.from.id,
					outbalance: 0,
					name: message.from.first_name,
					fc: 0,
					ref: 0,
					last_bonus_day: 0,
					regDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
					payout: 0,
					menu: "",
					statusklik: "",
					ban: false,
					refCount: 0,
					not: false,
					data: "",
					spinsToday: 0,
					klik: 0,
					bonuscount: 0,
				};
  
				let reffer = Number(message.text.split('/start')[1]);

				if (reffer) {
					let $reffer = await User.findOne({ id: reffer })
					if ($reffer) {
						schema.ref = $reffer.id
						await $reffer.inc('outbalance', 0.30)
						await $reffer.inc('refCount', 1)
						bot.sendMessage($reffer.id, `<b>🎉 Поздравляем!</b>
<b><i>🦋 По вашей ссылке присоединился <a href="tg://user?id=${message.from.id}">пользователь</a> вам начислено: 0.30₽</i></b>`, { parse_mode: "HTML" });
					}
				}

				let user = new User(schema);
				await user.save();
			}

			
			return bot.sendPhoto(message.chat.id, "start.png", {
				caption:`
🍇 <b>Привет, ${message.from.first_name}</b>
<b>🍉 Добро пожаловать в TyankaClicker! Мы одни из лучших кликеров во всём telegrame! Зарабатывай кликая по кнопке и это не шутка!</b>
`,
				parse_mode: "HTML",
				reply_markup: {
					keyboard: $menu,
					resize_keyboard: true
				}
			});
		}
	}
// Не где не слито 
	message.user = await User.findOne({ id: message.from.id });
	if (!message.user) return message.send(`Что-то пошло не так... Напишите /start`);
	if (message.user.ban) return
	if (!message.user.name || message.user.name != message.from.first_name)
		await User.findOneAndUpdate({ id: message.from.id }, { name: message.from.first_name })

	if (state[uid] == 7770 && ADMINS.indexOf(message.from.id) !== -1 && text != "0") {
		state[uid] = undefined
		bot.sendMessage(uid, "Рассылка запущена!").then((e) => {
			if (text.split("#").length == 4) {
				var btn_text = text.split("#")[1].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
				var btn_link = text.split("#")[2].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
				text = text.split("#")[0]
				mm_t(text, e.message_id, e.chat.id, true, btn_text, btn_link, 100)
			}
			else mm_t(text, e.message_id, e.chat.id, false, false, false, 100)
		})
	}

		if ((await bot.getChatMember("@TyankaClickerResponses", uid)).status == "left" || (await bot.getChatMember("@LaiZyShop", uid)).status == "left" || (await bot.getChatMember("@TyankaClickerResponses", uid)).status == "left") {
		return message.send(`<b>📢 Для использования бота, пожалуйста, подпишитесь на наши каналы и каналы спонсоров</b>`, { parse_mode: "html", reply_markup: { inline_keyboard: [
		[{ text: "☺️ Наш чатик", url: "https://t.me/TyankaClickerChat" }, { text: "🌚 Канал выплат", url: "https://t.me/TyankaClickerResponses" }],
		[{ text: "📣 Спонсировано", url: "https://t.me/LaiZyShop"}]
		] } })
	}

	if (state[uid] == 7772 && ADMINS.indexOf(message.from.id) !== -1 && text != "0") {
		state[uid] = undefined

		message.text = Number(message.text);
		let user = await User.findOne({ id: message.text });
		let u = user
		if (!user) return message.send('Пользователь не найден');

		let partners = await User.find({ ref: message.text });
		await message.user.set('menu', '');
		var kb = { inline_keyboard: [] }
		if (u.ban) kb.inline_keyboard.push([{ text: "♻️ Разбанить", callback_data: "unban_" + u.id }])
		else kb.inline_keyboard.push([{ text: "🛑 Забанить", callback_data: "ban_" + u.id }])
		kb.inline_keyboard.push([{ text: "➕ Баланс вывода", callback_data: "addOutBal_" + u.id }, { text: "✏️ Баланс вывода", callback_data: "editOutBal_" + u.id }])
		kb.inline_keyboard.push([{ text: "➕ Выведено", callback_data: "addPayOuts_" + u.id }, { text: "✏️ Выведено", callback_data: "editPayOuts_" + u.id }])

		kb.inline_keyboard.push([{ text: "◀️ Назад", callback_data: "admin_return" }])
		return message.send(`📝 Пригласил: <b>${partners.length}</b>
🆔 ID: <code>${user.id}</code>

💰 Баланс:
📭 Для вывода: ${user.outbalance.toFixed(2)}₽

➕ Кликов всего: <b>${message.user.klik}</b>

<b>Вывел: ${roundPlus(user.payout)}₽</b>
`, {
			parse_mode: "HTML",
			reply_markup: kb
		});

	}

	
	if (state[uid] == 7774 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		await User.findOneAndUpdate({ id: data[uid] }, { $inc: { outbalance: Number(text) } })
		bot.sendMessage(data[uid], `💰 Ваш баланс для вывода пополнен на <b>${text}₽</b>!`, { parse_mode: html })
		return message.send(`Баланс для вывода пользователя пополнен на ${text}₽!`, { reply_markup: RM_admin_return });
	}
	if (state[uid] == 7776 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		await User.findOneAndUpdate({ id: data[uid] }, { outbalance: Number(text) })
		bot.sendMessage(data[uid], `💰 Ваш баланс для вывода изменён на <b>${text}₽</b>!`, { parse_mode: html })
		return message.send(`Баланс для вывода пользователя изменён на ${text}₽!`, { reply_markup: RM_admin_return });
	}
  if (state[uid] == 000001 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		text = Number(text.replace("%", ""))
		await User.findOneAndUpdate({ id: 0 }, { bhivebalance: text })
		return message.send(`Вознаграждение за рефералов в ${text} установлено`, { reply_markup: Flaunchik_admin });
	}
	
	if (message.text) {
		if (message.text == '🚫 Отмена') {
			state[uid] = undefined
			await message.user.set('menu', '');
			return message.send('🚫 Отменено.', {
				reply_markup: {
					keyboard: $menu,
					resize_keyboard: true
				}
			});
		}
	}

	if (message.user.menu == 'reinvest') {
		message.text = Number(message.text);

		if (!message.text) return message.send('Введите сумму для реинвестирования!');
		if (message.text <= 0) return message.send('Введите сумму для реинвестирования!');

		if (message.text > message.user.outbalance) return message.send('Недостаточно средств.');
		else if (message.text <= message.user.outbalance) {
			await message.user.set('menu', '');

			await message.user.dec('outbalance', message.text);
			await message.user.inc('buybalance', message.text);

			return message.send(`Вы успешно реинвестировали ${message.text.toFixed(2)}₽`, {
				reply_markup: {
					keyboard: $menu,
					resize_keyboard: true
				}
			});
		}
	}

	if (message.user.menu.startsWith('amountQiwi')) {
		message.text = Number(message.text);

		if (!message.text) return message.send('Введите сумму на вывод!');
		if (message.text <= 0) return message.send('Введите сумму на вывод!');
		if (message.text <= -0) return message.send('Ты ебанутый?');

		if (message.text > message.user.outbalance) return message.send('Недостаточно средств.');
		if (message.text < 9.99) return message.send('🔴 Введите сумму более 10 рублей!');
		
			
		if (message.text <= message.user.outbalance) {
			await message.user.dec('outbalance', message.text);
			//await message.user.inc('payout', message.text);
			let ticket = new Ticket({
				id: message.from.id,
				amount: message.text,
				wallet: message.user.menu.split('amountQiwi')[1]
			});

			await ticket.save();
			await message.user.set('menu', '');
			
			ADMINS.map((x) => bot.sendMessage(x, "💎 Админ, короче новая заявка на вывод, надо одобрять."));
		
			bot.sendMessage("@TyankaClickerResponses", `<b>🦋 <a href="tg://user?id=${message.chat.id}">Пользователь</a> создал новую заявку на вывод!
💎 На сумму: ${ticket.amount}₽</b>`,{parse_mode: "HTML" })

			return message.send(`<b>☺️ Спасибо за работу в нашем боте :>
			
💎 Выплаты одобряются от 5 минут до 72-х часов</b>`, { 
				parse_mode: "HTML",
				reply_markup: {
					keyboard: $menu,
					resize_keyboard: true
				}
			});
		}
	}

	if (message.user.menu == 'qiwi') {

		if (message.text.length < 5) return message.send('Введите правильный номер!При вводе не правильного номера администрация бота не несет ответственность за потерю средств', {
			reply_markup: {
				keyboard: Cancel,
				resize_keyboard: true
			}
		});



		await message.user.set('menu', 'amountQiwi' + message.text);
		return message.send(`Введите сумму на вывод. Вы можете вывести ${message.user.outbalance.toFixed(2)}₽`);
	}
    
	
	if (message.text) {
		if (message.text == '🍇 Заработать') {
			return bot.sendPhoto(message.chat.id, "money.png", {
				caption:'Выберите, действие',
        parse_mode: "html",
				reply_markup: {
					inline_keyboard: [
						[{ text: "🍇 Обычный клик", callback_data: "klik_one" }],
						[{ text: "🍉 Супер клик", callback_data: "klik_two" }],
						[{ text: "💎 Дополнительный клик", callback_data: "Klik_referals" }],
					]
				}
			});
		}
		
    if (state[message.chat.id] == 99999 && ADMINS.indexOf(message.from.id) !== -1) {
		state[message.chat.id] = undefined
		var sum = Number(message.text)
		if (sum != 0) {
			var cid = generateID(8)
			var v = new Promo({ id: cid, sum: sum })
			await v.save()
			bot.sendMessage(message.chat.id, `Промокод создан!\n\n<code>P${cid}</code>`, { replyMarkup: Start, parse_mode: "HTML" });
		} else bot.sendMessage(message.chat.id, 'Создание промокода отменено!', { replyMarkup: Start });
	}
	if (state[message.chat.id] == 10000 && ADMINS.indexOf(message.from.id) !== -1) {
		state[message.chat.id] = undefined
		var sum = Number(message.text)
		if (sum != 0) {
			var cid = generateID(8)
			var v = new Promo({ id: cid, sum: sum })
			await v.save()
			bot.sendMessage(message.chat.id, `Промокод создан!\n\n<code>O${cid}</code>`, { replyMarkup: Start,parse_mode: "HTML" });
		} else bot.sendMessage(message.chat.id, 'Создание промокода отменено!', { replyMarkup: Start });
	}
	
		if (message.text == '💎 Личный кабинет') {
			return bot.sendPhoto(message.chat.id, "kabinet.png", {
				caption:`<b>
📝 Имя: ${message.from.first_name.replace(/(\<|\>)/g, '')}
🆔 ID: <code>${message.from.id}</code>
==========================
📭 Доступно для вывода: ${message.user.outbalance.toFixed(2)}₽
🍓 Кликов сделано: ${message.user.klik} раз
==========================
👔 Всего рефералов: ${await User.countDocuments({ ref: message.from.id })}
👥 Вас привел: ${message.user.ref != 0 ? `<a href="tg://user?id=${message.user.ref}">Пользователь</a>` : "<i>Никто</i>"}
==========================
</b>`,
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
					  [{ text: "📤 Вывести", callback_data: "withdraw" }],
					]
				}
			});
	     }
        
       if (state[uid] == 11000) {
			let postfix = message.text
				if (postfix[0] == "P") {
					message.user = await User.findOne({ id: message.from.id });

					var c = await Promo.findOne({ id: postfix.substr(1) })
					var sum = c.sum
					if (c) {
						bot.sendMessage("@TyankaClickerResponses", `🤑 <a href="tg://user?id=${message.chat.id}">Пользователь</a> активировал промокод для покупок на сумму <b>${sum}</b> рублей`,{parse_mode: "HTML" })
						bot.sendMessage(message.from.id, "✅ Вы активировали промокод на <b>" + sum + "</b> рублей для покупок", { parse_mode: "HTML" })
						await Promo.deleteOne({ _id: c._id })
						await message.user.inc("buybalance", sum)
						state[uid] = undefined
					}
					else
					bot.sendMessage(message.from.id, "😞 Промокод не найден")
					state[uid] = undefined
				}
			else if (postfix[0] == "O") {
					message.user = await User.findOne({ id: message.from.id });

					var c = await Promo.findOne({ id: postfix.substr(1) })
					if (c) {
						var sum = c.sum
						bot.sendMessage("@TyankaClickerResponses", `🤑 <a href="tg://user?id=${message.chat.id}">Пользователь</a> активировал промокод для вывода на сумму <b>${sum}</b> рублей`,{parse_mode: "HTML" })
						bot.sendMessage(message.from.id, "✅ Вы активировали промокод на <b>" + sum + "</b> рублей для вывода", { parse_mode: "HTML" })
						await Promo.deleteOne({ _id: c._id })
						await message.user.inc("outbalance", sum)
						state[uid] = undefined
					}
					else
					bot.sendMessage(message.from.id, "😞 Промокод не найден")
					state[uid] = undefined
				}
			}
	
if (message.text == '🎲 Игры') {
      return message.send(`<b> Здесь вы можете испытать свою удачу!</b>\n`, {
        parse_mode: "html",
        reply_markup: {
          inline_keyboard: [
              [{ text: "🔒 Сундук", callback_data: "game_chest" }, { text: "☘️ Лотерея", callback_data: "game_lotterys" }],
					]
				}
			});
		}
			

if (message.text == '☘️ Лотерея') {
      return message.send(`<b> Здесь вы можете испытать свою удачу!</b>\n`, {
        parse_mode: "html",
        reply_markup: {
          inline_keyboard: [
					 [{ text: "☘️ Лотерея", callback_data: "game_lotterys" }],
					]
				}
			});
		}
			
		if (message.text == '🍉 Информация') {
			return bot.sendPhoto(message.chat.id, "otvet.png", {
				caption:`💬 <b>Ответы на вопросы:
==========================
▪️Минимальный вывод средств с проекта?</b> 
<code>- 10 Рублей.</code>
▪️<b>Какой срок выплаты в боте?</b>
<code> - деньги придут на кошелек от 5 минут до 72 часов.</code>
▪️<b>Платите ли вы?</b>
<code>- да мы платим!</code>
▪️<b>Как здесь зарабатывать?</b>
 <code>- Кликай по кнопке или приглашай друзей.</code>
▪️<b>Сколько платите?</b>
<code>- мы платим по 0.30 рублей за каждого приглашенного друга, по 0.002₽ за клик</code>
▪️<b>Куда выплачиваете деньги?</b>
<code>- Выплачиваем на QIWI и PAYEER кошельки.</code>
<b>==========================
◾️Если не нашли ответа на ваш вопрос вы можете задать его по ссылке ниже ⤵️</b>`,
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
						[{ text: "💭 Задать вопрос", url: "https://t.me/flaunchikTg" },	{ text: "💸 Выплаты", url: "https://t.me/TyankaClickerResponses" }]
	     ]
			}
		})
	}


		if (message.text == '👥 Партнёрка') {
			return bot.sendPhoto(message.chat.id, "ref.png", {
				caption:`<b>
💸 Партнёрская программа - самый эффективный способ заработать!

🍇 Приглашай друзей и зарабатывай, за каждого друга 0.30₽

🔗 Ваша ссылка для приглашений: https://t.me/TyankaClickerBot?start=${message.from.id}</b>
		`,
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
					[{ text: "👥 Топ рефоводов", callback_data: "topRef" }],
					]
				}
			});
	     }

		if (message.text == '📊 Статистика') {
			var s = await User.findOne({ id: 0 })
			let t = new Date()
            t = t.getTime() - 1593648000 * 1000
			var day = t / 86400000 ^ 0
			let stats = {
				users: await User.countDocuments(),
				users_today: await User.find({ regDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}` }),
				cmds: message.message_id
			}

			stats.users_today = stats.users_today.length;

			return bot.sendPhoto(message.chat.id, "status.png", {
				caption:`
📊 <b>Статистика проекта:
==========================
👻 Всего пользователей: ${stats.users}
👑 Новых за сегодня: ${stats.users_today}
📤 Выплачено всего: ${Math.round(s.fc)}₽
⏳ Мы работаем:</b> ${day-613} дней\n
`,
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
						[{ text: "💎 Администратор", url: "https://t.me/flaunchikTg" }, { text: "📢 Форум", url: "https://t.me/TyankaClickerChat" }],
						[{ text: "📋 Правила", callback_data: "pravila" }, { text: "🔔 Выплаты | Отзывы", url: "https://t.me/TyankaClickerResponses" }],
						[{ text: "🏆 Топ выводов", callback_data: "topInv" }, { text: "❓ Помощь", callback_data: "help_main" }],
						[{ text: "📣 Модераторы", callback_data: "Moderation" }]
					]
				}
			});
		}
	}

	if (ADMINS.indexOf(message.from.id) !== -1) {
		if (message.text == '💎 Админочка') {
			var h = process.uptime() / 3600 ^ 0
			var m = (process.uptime() - h * 3600) / 60 ^ 0
			var s = process.uptime() - h * 3600 - m * 60 ^ 0
			var heap = process.memoryUsage().rss / 1048576 ^ 0

			return qiwi.getBalance(async (err, balance) => {
				
				require('request')({
					method: 'POST',
					url: 'https://payeer.com/ajax/api/api.php?getBalance',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body2: `account=${config.payeer.account}&apiId=${config.payeer.apiId}&apiPass=${config.payeer.apiPass}&action=getBalance`
				}, async function (error, response, body2) {
					body2 = JSON.parse(body2)
					console.log(body2)
			bot.sendMessage(uid, '<b>Админ-панель:</b>\n\n<b>Аптайм бота:</b> ' + h + ' часов ' + m + ' минут ' + s + ' секунд\n<b>🕵Пользователей в боте: </b>' + (await User.countDocuments({})) + '\n<b>📊Памяти использовано:</b> ' + heap + "МБ\n<b>💶Заявок на вывод:</b> " + await Ticket.countDocuments() + "\n<b>🥝Баланс QIWI:</b> " + balance.accounts[0].balance.amount, { parse_mode: "HTML", reply_markup: RM_admin })
			})
			})
		}

		if (message.text.startsWith('/setbuybalance')) {
			let cmd = message.text.split(' ');
			if (!cmd[1]) return message.send('Ошибка!');

			let user = await User.findOne({ id: Number(cmd[1]) });
			if (!user) return message.send('Пользователь не найден!');

			await user.set('buybalance', Number(cmd[2]));
			return message.send('Баланс установлен.');
		}
		
		if (message.text.startsWith('/restart')) {
		  var id = message.user.id
		  ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Пользователь</a> перезагрузил бота!`, { parse_mode: "HTML" }))
			setTimeout(() => { process.exit(0) }, 333);
		}

		if (message.text.startsWith('/setoutbalance')) {
			let cmd = message.text.split(' ');
			if (!cmd[1]) return message.send('Ошибка!');

			let user = await User.findOne({ id: Number(cmd[1]) });
			if (!user) return message.send('Пользователь не найден!');

			await user.set('outbalance', Number(cmd[2]));
			return message.send('Баланс установлен.');
		}
	}
});

bot.on('callback_query', async (query) => {
	const { message } = query;
	message.user = await User.findOne({ id: message.chat.id });
	var uid = message.chat.id
	let dt = new Date
	console.log("[" + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + "] Пользователь " + uid + " отправил колбэк: " + query.data)
	
	if (dt.getDate() == oplata) return message.send('Хостинг не оплачен!');

	if (!message.user) return bot.answerCallbackQuery(query.id, 'Что-то пошло не так...', true);

	if (query.data == 'none') return bot.answerCallbackQuery(query.id, 'Привет! :)', true);

	if (query.data == 'pravila') {
return bot.sendMessage(uid, `<b>[📋] • Правила 

[⁉️] 1.1 • Выплата подтверждается если у вас минимум 20 рефералов, если меньше то выплата будет аннулирована
[⁉️] 1.2 • После заказа выплаты, ваш аккаунт проверяется на накрутку рефералов, если замечена накрутка - выплата отклоняется с потерей заказаных средств.
[⁉️] 1.3 • Запрещено спрашивать, о выплатах в чате или у администраций!
[⁉️] 1.4 • Каждый пользователь обязан иметь: Аватарку, @Юзер
[⁉️] 1.5 • Запрещено использовать автокликер или другие способы быстрого майна денег!
[⁉️] 1.6 • Заявку на выплату можно делать 2 раза в день!
[⁉️] 1.7 • Выплаты подтверждается в течений 1 минуты - 72 часа
[🦊] 1.8 • Соблюдать правила чата!
➖➖➖➖➖➖➖➖➖➖➖➖➖➖
[⛔️] • За нарушений правил {1.1, 1.2, 1.3, 1.4, 1.5, 1.6} - Наказание: аннулирование выплаты, или бан в боте</b>`,
{ parse_mode: "html" })
}

	if (query.data.startsWith('topInv')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		var top = await User.find({ id: { $ne: 0, $ne: 1 } }).sort({ payout: -1 }).limit(20)
		var c = 0
		return bot.sendMessage(uid, `<b>🏆 Топ 20 по выводам:</b>\n\n${top.map((e) => { c++; return `<b>${c})</b> <a href="tg://user?id=${e.id}">${e.name ? e.name : "пользователь"}</a> - <b>${e.payout}₽</b>` }).join("\n")}`, { parse_mode: "html" });
	}
	
	if (query.data.startsWith('topRef')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		var top = await User.find({ id: { $ne: 0, $ne: 1 } }).sort({ refCount: -1 }).limit(20)
		var c = 0
		return bot.sendMessage(uid, `<b>🏅 Топ рефоводов:</b>\n\n${top.map((e) => { c++; return `<b>${c})</b> <a href="tg://user?id=${e.id}">${e.name ? e.name : "пользователь"}</a> - <b>${e.refCount}</b> рефералов` }).join("\n")}`, { parse_mode: "html" });
	}
	if (query.data.startsWith('Konkurs')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		var top = await User.find({ id: { $ne: 0, $ne: 1 } }).sort({ refCount: -1 }).limit(10)
		var c = 0
		return bot.sendMessage(uid, `<b>🏆 Конкурс
==========================
▪️Начало конкурс: 01.02.22
▪️конец конкурс: 01.03.22
==========================</b>
<b>⁉️ В конкурсе учитываются приведенные вами рефералы именно на момент существования конкурса! по окончанию конкурса будут выданы ценные призы! приведя одного реферала вы автоматически участвуете в конкурсе! Учитываются рефералов Призовых места всего три
========================== 
🥇 Место = 50₽
🥈 Место = 50₽
🥉 Место = 50₽
==========================</b> \n${top.map((e) => { c++; return `<b>${c})</b> <a href="tg://user?id=${e.id}">${e.name ? e.name : "пользователь"}</a> - <b>${e.refCount}</b> рефералов` }).join("\n")}`,{
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
						[{ text: "💛 Прошлые победители", callback_data: "Wins" }]
					]
				}
			});
	     }
	  
if (query.data == 'Moderation') {
return bot.sendMessage(uid, `<b><I>🔔 Это список модераторов наших проектов, не нарушайте правила чтобы не попасться на их кручок. 😁</i></b>`, {
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
						[{ text: "₊⊹₊°𝙶𝙾𝙴𝙳𝙾𝙽𝙾𝙽°₊⊹₊", 
						url: "https://t.me/goedonon" }],
					]
				}
			});
	     }

	if (query.data.startsWith('help_main')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		return bot.sendMessage(uid, `
💎 Здесь находятся ответы на часто задаваемые вопросы, выберите одну из тем, которая вас интересует:
📨 Этот бот личная разработка разработчика и не имеет нечего схожего с подобными проектами!`, {
			reply_markup: {
				inline_keyboard: [
					[{ text: "👥 Партнёрка", callback_data: "help_refs" }, { text: "📤 Выводы", callback_data: "help_vivod" }],
					]
				}
			});
	     }

	if (query.data.startsWith('help_refs')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		return bot.sendMessage(uid, '<b>👥 Рефералы – это игроки, с регистрации которых в боте вы будете получать 0.30₽\n=============================\n‼️ Для привлечения большего числа пользователй, Вам нужно как можно активнее распространять свою парнёрскую ссылку другим пользователям.\n💼 Свою реферальную ссылку вы можете получить в разделе «👥 Партнёрка»</b>', 
		{ parse_mode: "html", reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "help_main" }]] } })
	}
	
	if (query.data.startsWith('help_vivod')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		return bot.sendMessage(uid, '<b>📤 Выводы средст осуществляются в течение 5 минут до 72 часов!\n📬 Минимальный вывод 10₽\n📝 Чтобы вывести средства, зайдите в: «👔 Личный кабинет», далее нажмите на «📤 Вывести», потом ведите сумму вывода и реквизиты кошелька!</b>', 
		{ parse_mode: "html", reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "help_main" }]] } })
	}
	
	if (query.data == 'klik_one') {
	 //var bm = JSON.parse((await User.findOne({ id: 1 })).)
	 //if (!bm.onestatus) return bot.answerCallbackQuery(query.id, '🛑 Игра временно отключена администратором', true);
		if (message.user.spinsToday >= 2750) return bot.answerCallbackQuery(query.id, `🦋 За сегодня вы сделали максимум кликов.`, false);
		await User.findOneAndUpdate({ id: uid }, { $inc: { outbalance: 0.002, spinsToday: 1 } })
		await message.user.inc("klik", 1)
		return bot.sendMessage(message.chat.id, '💸 Вам начислено 0.002₽', {
			reply_markup: {
				keyboard: Start,
				resize_keyboard: true
			}
		});
	}
	
	if (query.data == 'klik_two') {
	  //var bm = JSON.parse((await User.findOne({ id: 1 })).menu)
	  //if (!bm.twostatus) return bot.answerCallbackQuery(query.id, '🛑 Игра временно отключена администратором', true);
		if (message.user.spinsToday >= 2) return bot.answerCallbackQuery(query.id, `🦋 За сегодня вы сделали максимум кликов.`, false);
		await User.findOneAndUpdate({ id: uid }, { $inc: { outbalance: 0.25, spinsToday: 1 } })
		await message.user.inc("klik", 1)
		return bot.sendMessage(message.chat.id, '💸 Вам начислено 0.25₽', {
			reply_markup: {
				keyboard: Start,
				resize_keyboard: true
			}
		});
	}

	if (query.data == 'Klik_referals') {
	  //var bm = JSON.parse((await User.findOne({ id: 1 })).menu)
	  //if (!bm.dopstatus) return bot.answerCallbackQuery(query.id, '🛑 Игра временно отключена администратором', true);
        let Refs = await User.countDocuments({ ref: message.chat.id });  
        let next = 30
     if (Refs < next) return bot.answerCallbackQuery(query.id, `😔 У вас меньше чем 30 рефералов
🗣 Для получения награды нужно пригласить ещё ${next - Refs} рефералов`, true);  
		if (message.user.spinsToday >= 2) return bot.answerCallbackQuery(query.id, '💎 За сегодня вы сделали дополнительный клик, приходите завтра!', true);
		await User.findOneAndUpdate({ id: uid }, { $inc: { outbalance: 0.20, spinsToday: 1 } })
		await message.user.inc("klik", 2)
		return bot.sendMessage(message.chat.id, '💸 Вам начислено 0.20₽', {
			reply_markup: {
				keyboard: Start,
				resize_keyboard: true
			}
		});
	}

	if (query.data == 'withdraw') {
		if (message.user.outbalance < 9.99) 
			return bot.answerCallbackQuery(query.id, `══════════════════════
⚠️ На вашем балансе для вывода недостаточно средств.
🏦 Ваш баланс: ${message.user.outbalance.toFixed(2)}₽
📣 Минимальная сумма вывода: 10₽
══════════════════════`, true);
		if (message.user.refCount < 19) return bot.answerCallbackQuery(query.id,'🚫 Для вывода требуется 20 рефералов, у вас меньше!', true);
		bot.deleteMessage(message.chat.id, message.message_id);
  await bot.sendMessage(message.chat.id, `Выберите способ вывода`, {
        parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
					[{ text: "🥝 QIWI", callback_data: "qiwi" }, { text: "🅿️ PAYEER", callback_data: "payeer" }],
					]
				}
			});
 }
	     
 if(query.data == 'qiwi') {
    await message.user.set('menu', 'qiwi');
		await bot.sendMessage(message.chat.id, '📝 Ведите реквизиты для вывода: ==============================\n◾️Используйте для вывода идентифицированный Qiwi кошелёк❗️', {
			reply_markup: {
				keyboard: Cancel,
				resize_keyboard: true
			}
		});
	}

 	if(query.data == 'payeer') {
    await message.user.set('menu', 'qiwi');
		await bot.sendMessage(message.chat.id, '📝 Ведите реквизиты для вывода: ============================== ◾️Используйте для вывода PAYEER', {
			reply_markup: {
				keyboard: Cancel,
				resize_keyboard: true
			}
		});
	}

	if (query.data == 'reinvest') {
		await message.user.set('menu', 'reinvest');
		return bot.sendMessage(message.chat.id, 'Введите сумму, которую хотите реинвестировать.', {
			reply_markup: {
				keyboard: Cancel,
				resize_keyboard: true
			}
		});
	}

	if (query.data.startsWith('withdraw:')) {
		let id = Number(query.data.split('withdraw:')[1]);
		let ticket = await Ticket.findOne({ id });

		if (!ticket) bot.deleteMessage(message.chat.id, message.message_id);
		if (ticket.wallet.indexOf("P") == -1) { // Платёж через QIWI
			qiwi.toWallet({ account: String(ticket.wallet), amount: ticket.amount, comment: '💎 TyankaClicker, спасибо за работу!' }, () => { });
			bot.sendMessage("@IZI_VIVOD", `<b> 🍇 <a href="tg://user?id=${ticket.id}">Пользователь</a> вывел <b>${ticket.amount}₽</b> через QIWI</b>`, { parse_mode: "HTML" })
		}
		else // Платёж через Payeer
		{
			bot.sendMessage("@IZI_VIVOD", ` 🍇 <a href="tg://user?id=${ticket.id}">Пользователь</a> вывел <b>${ticket.amount}₽</b> через <b>Payeer</b>`, { parse_mode: "HTML" })

			require('request')({
				method: 'POST',
				url: 'https://payeer.com/ajax/api/api.php',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: `account=${config.payeer.account}&apiId=${config.payeer.apiId}&apiPass=${config.payeer.apiPass}&action=transfer&curIn=RUB&sum=${ticket.amount * 1.01}&curOut=RUB&to=${ticket.wallet}`
			}, async function (error, response, body) {
				body = JSON.parse(body)
			})
		}
		bot.sendMessage(ticket.id,`<b>
✅ Ваша заявка на вывод успешно обработана. Средства были отправлены на указанные реквизиты.

Пожалуйста,<a href = "https://telegra.ph/file/2c500c45b42b783a65e7b.png"> </a> пришлите скриншот о том, что вы получили выплату, в чат или просто напишите отзыв. Для нас это очень важно ☺️

💰 Сумма вывода: ${ticket.amount}₽
🥝 На платежный сервис: ${ticket.wallet.indexOf("P") == -1 ? "QIWI" : "Payeer"} 
💎 Внимание, если вы не выкладите скриншот в чат где видно выплату с нашего бота, то следующий раз вы будете ждать выплату неделю!	</b>`, {
		  parse_mode: "html", reply_markup: {
			inline_keyboard: [
			  [{ text: "🕴️ Владелец", url: "https://t.me/flaunchikTg" }],
			  [{ text: "📰 Новости | 💸 Выплаты", url: "https://t.me/TyankaClickerResponses" }],
	
			]
		  }
		});
		await User.findOneAndUpdate({ id: 0 }, { $inc: { fc: ticket.amount } })
		await User.findOneAndUpdate({ id: id }, { $inc: { payout: ticket.amount } }) 
	await ticket.remove();
		bot.editMessageText('Выплатил!', {
		  chat_id: message.chat.id,
		  message_id: message.message_id
		});
	  }

	if (query.data.startsWith('back:')) {
		let id = Number(query.data.split('back:')[1]);
		let ticket = await Ticket.findOne({ id });

		if (!ticket) bot.deleteMessage(message.chat.id, message.message_id);

		let user = await User.findOne({ id: ticket.id });
		bot.sendMessage(ticket.id, `Ваша выплата была отклонена, на ваш счёт возвращено ${ticket.amount}₽`);

		await user.inc('buybalance', ticket.amount);
		await ticket.remove();

		return bot.editMessageText('Вернул!', {
			chat_id: message.chat.id,
			message_id: message.message_id
		});
	}

	if (query.data.startsWith('take:')) {
		let id = Number(query.data.split('take:')[1]);
		let ticket = await Ticket.findOne({ id });

		if (!ticket) bot.deleteMessage(message.chat.id, message.message_id);

		await ticket.remove();
		return bot.editMessageText('Забрал!', {
			chat_id: message.chat.id,
			message_id: message.message_id
		});
	}
	
	var d = query.data
	
	if (ADMINS.indexOf(query.from.id) !== -1) {
		if (d == "admin_mm") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите текст рассылки или отправьте изображение:\n\n<i>Для добавления кнопки-ссылки в рассылаемое сообщение добавьте в конец сообщения строку вида:</i>\n# Текст на кнопке # http://t.me/link #', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7770
		} else if (d == "admin_w") {
			bot.deleteMessage(message.chat.id, message.message_id);
			let tickets = await Ticket.find();
			if (tickets.length == 0) return bot.sendMessage(uid, 'Заявок на вывод нет');
			await tickets.map((x) => {
				bot.sendMessage(uid, `📝 Игрок: <a href="tg://user?id=${x.id}">Игрок</a> (ID: <code>${x.id}</code>)\n
	💰 Сумма: <code>${x.amount}</code>₽
	🥝 Кошелёк: <code>${x.wallet}</code>`, {
					parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: '📭 Подтвердить выплату', callback_data: `withdraw:${x.id}` }], [{ text: '♻️ Вернуть', callback_data: `back:${x.id}` }], [{ text: '🚫 Забрать', callback_data: `take:${x.id}` }]] }
				});
			});
		}
		

	if (query.data == 'game_chest') {
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, `🔒 Выберете стоимость сундука
?? Вы можете найти в два раза больше ₽, а может быть, сундук окажется пустым
🎲 Вероятность: 50%`, {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[{ text: "1₽", callback_data: "casino_1" },
					{ text: "2₽", callback_data: "casino_2" },
					{ text: "5₽", callback_data: "casino_5" },
					{ text: "10₽", callback_data: "casino_10" }],
					[{ text: "25₽", callback_data: "casino_25" },
					{ text: "50₽", callback_data: "casino_50" },]
				]
			}
		});
	}

if (query.data.startsWith('game_lotterys')) {
	var best_count = await BestUser.countDocuments({})
	var fl_count = await FUser.countDocuments({})
	var big_count = await BigUser.countDocuments({})

	return bot.sendMessage(message.chat.id,`
<b>🍇 LITE лотерея 🍇</b>
	
💳 Стоимость Билета: <b>3₽</b> 
🎁 Выигрыш: <b>25₽</b>
📃 Куплено Билетов: ${best_count}
🚪 Осталось Мест: ${11- best_count}
							
<b>🍓 HARD лотерея 🍓</b>
			
💳 Стоимость билета: <b>10₽</b>
🎁 Выигрыш: <b>50₽</b>
📃 Куплено билетов: ${fl_count}
🚪 Осталось мест: ${6- fl_count}
	
<b>🎲 Ваш игровой баланс:</b> ${message.user.outbalance.toFixed(2)}
			`, {
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
						[{ text: `Купить 🍇 LITE лотерею 🍇`, callback_data: `lottery1` }],
						[{ text: `Купить 🍓 HARD лотерею 🍓`, callback_data: `lottery2` }],
					]
				}	
			});	
}
	if (query.data.startsWith('lottery1')) {
//	var game = JSON.parse((await Gamestat.findOne({ id: 1 })).statusgame)

//	if (!game.statuslottery) return bot.answerCallbackQuery(query.id, '🛑 Игра временно отключена администратором', true);

	if ((await BestUser.findOne({ id: message.chat.id })) == null) {
		if (message.user.outbalance < 3)
		bot.editMessageText('❗️<b>Ошибка</b>❗️\n\nНедостаточно денег на игровом балансе! Стоимость билета - 5 ₽ ', { chat_id: message.chat.id, message_id: message.message_id, parse_mode: "HTML"})
		else {
			await message.user.dec("outbalance", 3)
			var uid1 = (await BestUser.countDocuments({})) + 1
			let player = new BestUser({ id: message.chat.id, username: message.chat.first_name, id1: uid1 })
			await player.save()
			bot.editMessageText(`Вы стали участником лотереи 🍀\n\n💳 С вашего баланса снято <b>3₽ </b>\n💰 Ваш баланс: <b> ${message.user.outbalance} </b>\n📃 Ваш номер: <b>` + uid1 + '</b>\n🚪Осталось мест: <b>' + (11 - uid1) + '</b>\n\n💣 <i>Игра начнётся, как только будет куплен 11-й билет!</i>', { chat_id: message.chat.id, message_id: message.message_id, parse_mode: "HTML"})

			var players = await BestUser.find({})
			if (players.length < 11 && players.length > 1) {
				for (var i = 0; i < (players.length - 1); i++)
					await bot.sendMessage(players[i].id, '📑 Новый участник: <b>' + message.chat.first_name + '</b>\n🚪 Осталось мест:  <b>' + (11 - players.length) + '</b>', { parse_mode: "HTML", reply_markup: { keyboard: Start, resize_keyboard: true}}).then().catch()
			}
			else if (players.length >= 11) {
				var players_list = ''
				for (var i = 0; i < players.length; i++)
					players_list += '<b>' + (i + 1) + ')</b> <a href="tg://user?id=' + players[i].id + '">' + players[i].username + '</a>\n'
				var winner = randomInteger(1, 11)
				winner = await BestUser.findOne({ id1: winner })
				for (var i = 0; i < players.length; i++)
				try {
					await bot.sendMessage(players[i].id, 'В Лотерее \n\n🎁 Выиграл 🎟 <b>№' + winner.id1 + '</b>\n\n📃 Список участников:\n' + players_list + '\n🎁 Победитель <b>' + winner.username + '</b> получает <b>25 ₽ на баланс вывода</b>!', { parse_mode: "HTML", reply_markup: { keyboard: Start, resize_keyboard: true}}).then().catch()
				addoutBal(winner.id, 25 /2)
				await BestUser.remove({})
				}
				catch { }
			}
		}
	} else
		bot.sendMessage(message.chat.id, '❗️<b>Ошибка</b>❗️\n\nВы уже учавствуете в лотерее!', { parse_mode: "HTML", reply_markup: { keyboard: Start, resize_keyboard: true}})
}

if (query.data == "lottery2") {
//	var game = JSON.parse((await Gamestat.findOne({ id: 1 })).statusgame)

//	if (!game.statuslottery) return bot.answerCallbackQuery(query.id, '🛑 Игра временно отключена администратором', true);

	if ((await FUser.findOne({ id: message.chat.id })) == null) {
		if (message.user.outbalance < 10)
		bot.editMessageText('❗️<b>Ошибка</b>❗️\n\nНедостаточно денег на игровом балансе! Стоимость билета - 10 ₽ ', { chat_id: message.chat.id, message_id: message.message_id, parse_mode: "HTML"})
		else {
			await message.user.dec("outbalance", 10)
			var uid1 = (await FUser.countDocuments({})) + 1
			let player = new FUser({ id: message.chat.id, username: message.chat.first_name, id1: uid1 })
			await player.save()
			bot.editMessageText(`Вы стали участником лотереи 🍀\n\n💳 С вашего баланса снято <b>10 ₽ </b>\n💰 Ваш баланс: <b> ${message.user.outbalance} </b>\n📃 Ваш номер: <b>` + uid1 + '</b>\n🚪Осталось мест: <b>' + (6 - uid1) + '</b>\n\n💣 <i>Игра начнётся, как только будет куплен 6-й билет!</i>', { chat_id: message.chat.id, message_id: message.message_id, parse_mode: "HTML"})

			var players = await FUser.find({})
			if (players.length < 6 && players.length > 1) {
				for (var i = 0; i < (players.length - 1); i++)
					await bot.sendMessage(players[i].id, '📑 Новый участник: <b>' + message.chat.first_name + '</b>\n🚪 Осталось мест:  <b>' + (6 - players.length) + '</b>', { parse_mode: "HTML", reply_markup: { keyboard: Start, resize_keyboard: true}}).then().catch()
			}
			else if (players.length >= 6) {
				var players_list = ''
				for (var i = 0; i < players.length; i++)
					players_list += '<b>' + (i + 1) + ')</b> <a href="tg://user?id=' + players[i].id + '">' + players[i].username + '</a>\n'
				var winner = randomInteger(1, 6)
				winner = await FUser.findOne({ id1: winner })
				for (var i = 0; i < players.length; i++)
				try {
					await bot.sendMessage(players[i].id, 'В Лотерее \n\n🎁 Выиграл 🎟 <b>№' + winner.id1 + '</b>\n\n📃 Список участников:\n' + players_list + '\n🎁 Победитель <b>' + winner.username + '</b> получает <b>50 ₽ на баланс вывода</b>!', { parse_mode: "HTML", reply_markup: { keyboard: Start, resize_keyboard: true}}).then().catch()
				addoutBal(winner.id, 50 /2)
				await FUser.remove({})
				}
				catch { }
			}
		}
	} else
		bot.sendMessage(message.chat.id, '❗️<b>Ошибка</b>❗️\n\nВы уже учавствуете в лотерее!', { parse_mode: "HTML", reply_markup: { keyboard: Start, resize_keyboard: true}})
}

	if (query.data == 'promoact') {
		 state[uid] = 11000
		 return bot.sendMessage(message.chat.id, `<b>✍🏻 Введите ваш промокод:</b>`, {parse_mode: "HTML"})
	 }

	if (query.data.startsWith("casino_open")) {
		bot.deleteMessage(message.chat.id, message.message_id)
		var bet = Number(query.data.split("_")[2])
		if (bet > message.user.outbalance) await bot.answerCallbackQuery(query.id, 'Недостаточно средств для ставки!', true);
		else if (Math.random() >= 100) {
			await message.user.inc("outbalance", bet)
			await bot.answerCallbackQuery(query.id, '💸 Вы выиграли ' + bet * 2 + "₽!", true);
		} else {
			await message.user.inc("outbalance", -bet)
			await bot.answerCallbackQuery(query.id, "😞 Сундук пуст", true);
		}
		return bot.sendMessage(message.chat.id, `🔒 Выберете стоимость сундука
🍀 Вы можете найти в два раза больше ₽, а может быть, сундук окажется пустым
🎲 Вероятность: 50%
					
💰 Ваш игровой: ${roundPlus(message.user.outbalance)}₽\n
💸 Ваша ставка: ${bet} ₽
🎰 Возможный выигрыш: ${bet * 2} ₽`, {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[{ text: "1₽", callback_data: "casino_1" },
					{ text: "2₽", callback_data: "casino_2" },
					{ text: "5₽", callback_data: "casino_5" },
					{ text: "10₽", callback_data: "casino_10" }],
					[{ text: "25₽", callback_data: "casino_25" },
					{ text: "50₽", callback_data: "casino_50" }],
					[{ text: "🔓 Открыть за " + bet + "₽", callback_data: "casino_open_" + bet }]
				]
			}
		})

	}

	if (query.data.startsWith("casino")) {
		bot.deleteMessage(message.chat.id, message.message_id)
		var bet = Number(query.data.split("_")[1])
		return bot.sendMessage(message.chat.id, `🔒 Выберете стоимость сундука
🍀 Вы можете найти в два раза больше ₽, а может быть, сундук окажется пустым
🎲 Вероятность: 50%
					
💰 Ваш баланс: ${message.user.outbalance} ₽
💸 Ваша ставка: ${bet} ₽
🎰 Возможный выигрыш: ${bet * 2} ₽`, {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[{ text: "1₽", callback_data: "casino_1" },
					{ text: "2₽", callback_data: "casino_2" },
					{ text: "5₽", callback_data: "casino_5" },
					{ text: "10₽", callback_data: "casino_10" }],
					[{ text: "25₽", callback_data: "casino_25" },
					{ text: "50₽", callback_data: "casino_50" }],
					[{ text: "🔓 Открыть за " + bet + "₽", callback_data: "casino_open_" + bet }]
				]
			}
		})
	}

	if (query.data == 'bonus') {
		var date = new Date();
		let lbd = await User.findOne({id: message.chat.id})
		lbd = lbd.last_bonus_day
		let d = date.getDate()
		if (lbd != d && message.chat.id != 0)
			bot.sendMessage(message.chat.id, '<b>🎁 Ежедневный бонус\n\n🔄 Статус: ✅</b>', { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "🎁 Забрать", callback_data: "get_bonus" }]] } });
		else
			bot.sendMessage(message.chat.id, '<b>🎁 Ежедневный бонус</b>\n\n<b>🔄 Статус: ❌</b>', { parse_mode: "HTML" });

}

if (query.data == 'get_bonus')
{bot.answerCallbackQuery(query.id);

    if (message.user.last_bonus && (new Date() - message.user.last_bonus) < 24 * 60 * 60 * 1000) {
      return;
    }
    const reward = 0.10
    bot.answerCallbackQuery(query.id);
   await message.user.inc('outbalance',+reward);
   await User.updateOne({ id: message.chat.id }, {$set: {last_bonus: new Date()}});
    return bot.sendMessage(message.chat.id, `Вы получили ${reward} ₽!`);
  }

	if (query.data == 'randomizer') {
  await bot.sendMessage(message.chat.id, `🎲 <b>Рандомайзер - простая игра, которая даёт Вам возможность испытать удачу!</b>\n\n🕹 После нажатия на кнопку ниже бот <b>начислит</b> или <b>спишет</b> с Вашего баланса <b>0.5₽</b> c вероятностью <b>50%</b>`
, {
   parse_mode: "HTML",
   reply_markup: {
    inline_keyboard: [
     [{ text: "🌵 Испытать удачу", callback_data: "randomize" }], 
    ]
   }
  });
 }

            else if (d == "randomize") {
                if (message.user.outbalance >= 0.5) {
                    var result = randomInteger(1, 100)
                    if (result < 100) {
                        addBal(uid, -0.5)
                        bot.answerCallbackQuery(message.message_id, { text: "🙁 Вы проиграли 0.5₽!" })
                    }
                    else {
                        addBal(uid, 0.5)
                        bot.answerCallbackQuery(message.message_id, { text: "🙂 Вы выиграли 0.5₽!" })
                    }
                }
                else
                    bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nНа балансе должно быть не менее 0.5₽!', { replyMarkup: RM_default, parseMode: html })
            }

	if(query.data == "follow") {
		let channels = await Channel.find();
			channels = channels.filter((x) => x.completed.indexOf(message.user.id) === -1);

		if(!channels[0]) return bot.sendMessage(message.chat.id, `Нет доступных для подписки каналов. Попробуйте позже`, {
			parse_mode: "HTML",
			chat_id: message.chat.id,
			message_id: message.message_id
		});

		return bot.sendMessage(message.chat.id, `Задание:
1) Подпишитесь на канал @${channels[0].username}
2) Возвращайтесь сюда и получите вознаграждение.`, {
			reply_markup: {
				inline_keyboard: [
					[{ text: "Перейти на канал", url: "https://t.me/"+channels[0].username }],
					[{ text: "Проверить подписку", callback_data: "check-"+channels[0].username }]
				]
			},
			message_id: message.message_id,
			chat_id: message.chat.id
		});
	}

	if(query.data.startsWith("check")) {
		let [ action, username ] = query.data.split("-");
		if(!username) return;

		let channel = await Channel.findOne({ username: username });
		if(!channel) return bot.answerCallbackQuery(query.id, "Ошибка, попробуйте другой канал.");

		if(channel.completed.indexOf(message.user.id) !== -1) return bot.answerCallbackQuery(query.id, "Вы уже выполнили это задание!");

		bot.getChatMember(`@${username}`, message.user.id).then(async (res) => {
			if(res.status == "left") return bot.sendMessage(message.chat.id, "Вы ещё не подписались на канал");

			channel.completed.push(message.user.id);
			await channel.save();

			await message.user.inc("outbalance", 0.25);
			if(message.user.ref) {
				let user = await User.findOne({ id: message.user.ref });
				await user.inc("outbalance", 0.25);
			}

			bot.sendMessage(message.chat.id, "Отлично! Вам начислено 0.25₽\n\nВаш текущий баланс: " + message.user.outbalance + "₽", {
				chat_id: message.chat.id,
				message_id: message.message_id,
				reply_markup: {
					inline_keyboard: [[
						{ text: "Заработать ещё", callback_data: "follow" }
					]]
				}
			});
		});
	}

		else if (d == "admin_top") {
			bot.deleteMessage(message.chat.id, message.message_id);
			var u = await User.find({ ref: { $ne: 0 }, _id: { $gt: mongo.Types.ObjectId.createFromTime(Date.now() / 1000 - 24 * 60 * 60) } })
			console.log(u)
			var top = []
			u.map((e) => {
				var t = top.filter(u => { if (e.ref == u.id) return true; else return false })
				if (t.length == 0) top.push({ id: e.ref, ref: 1 })
				else {
					top = top.filter(u => { if (e.ref == u.id) return false; else return true })
					top.push({ id: e.ref, ref: t[0].ref + 1 })
				}
			})
			top = top.sort((a, b) => { if (a.ref <= b.ref) return 1; else return -1 })
			top.length = 20
			var str = `<b>🕒 Топ рефоводов за 24 часа:</b>\n\n`
			for (const i in top) {
				var us = await User.findOne({ id: top[i].id })
				str += `<b>${Number(i) + 1})</b> <a href="tg://user?id=${us.id}">${us.name ? us.name : "Пользователь"}</a> - <b>${top[i].ref}</b> рефералов\n`
			}
			bot.sendMessage(uid, str, { reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "admin_return" }]] }, parse_mode: "HTML" })
		}
		
		if (query.data == "wipe") {
    await User.updateMany({ trees: [], buybalance: 0, outbalance: 0, bhivebalance: 0, klik: 0, ref: 0 })
    await User.countDocuments({ trees: [], ref: 0 })
    bot.editMessageText('Бот обнулен создателем!', { chat_id: uid, message_id: message.message_id, parse_mode: html })
   }
   
		if (query.data == "wipep") {
    await User.updateMany({ trees: [], refCount: 0 })
    bot.editMessageText('Бот обнулен создателем!', { chat_id: uid, message_id: message.message_id, parse_mode: html })
   }
   
		else if (d == "FL_admin1") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите новое вознаграждение за реферала:', { reply_markup: Flaunchik_admin, parse_mode: "HTML" })
			state[uid] = 000001
		}

		else if (d == "admin_u") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите ID пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7772
		}
		else if (d == "a_voucherpromo") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Выбери баланс для создания промо', { reply_markup: RM_promo, parse_mode: "HTML" })
		}
		else if (d == "voucherbuy") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Ввведи сумму', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 99999
		}
		else if (d == "voucherout") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Ввведи сумму', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 10000
		}
		else if (d.startsWith("admin_klik")) {
			bot.deleteMessage(message.chat.id, message.message_id);
			var klik = JSON.parse((await User.findOne({ id: 1 })).menu)
			if (d.split("_")[2] == "false") bm.onestatus = false
			if (d.split("_")[2] == "true") bm.onestatus = true
			
			if (d.split("_")[2] == "false") bm.twostatus = false
			if (d.split("_")[2] == "true") bm.twostatus = true
			await User.updateOne({ id: 1, menu: JSON.stringify(bm) })
			console.log(bm)
			bot.sendMessage(uid, `Настройка игры кликер:\n
🍇 Заработать: ${bm.status ? "✅ Включено" : "🚫 Выключено"}
🍇 Заработать 2х: ${bm.status ? "✅ Включено" : "🚫 Выключено"}
`, {
				reply_markup: {
					inline_keyboard: [
		[{ text: (bm.onestatus ? 'Выключить' : "Включить"), callback_data: (bm.status ? 'admin_klik_one_false' : "admin_klik_one_true") }],
						[{ text: (bm.twostatus ? 'Выключить' : "Включить"), callback_data: (bm.twostatus ? 'admin_klik_two_false' : "admin_klik_two_true") }],
						[{ text: "◀️ Назад", callback_data: "admin_return" }],
					]
				}, parse_mode: "HTML"
			})
		}
		
		else if (d.split("_")[0] == "addOutBal") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите сумму пополнения баланса для вывода пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7774
			data[uid] = d.split("_")[1]
		}
		
		else if (d.split("_")[0] == "addPayOuts") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите сумму для добавления в сумму выводов пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 77745555
			data[uid] = d.split("_")[1]
		}
		else if (d.split("_")[0] == "editBuyBal") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите новый баланс для покупок пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7775
			data[uid] = d.split("_")[1]
		}
		else if (d.split("_")[0] == "editOutBal") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите новый баланс для вывода пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7776
			data[uid] = d.split("_")[1]
		}
		
		else if (d.split("_")[0] == "editPayOuts") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите новую сумму выводов пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 77765555
			data[uid] = d.split("_")[1]
		}
		
		else if (d == "admin_mm_stop") {
			var tek = Math.round((mm_i / mm_total) * 40)
			var str = ""
			for (var i = 0; i < tek; i++) str += "+"
			str += '>'
			for (var i = tek + 1; i < 41; i++) str += "-"
			mm_status = false;
			bot.editMessageText("Рассылка остановлена!", { chat_id: mm_achatid, message_id: mm_amsgid })
			mm_u = []
		}
		else if (d == "admin_mm_pause") {
			var tek = Math.round((mm_i / mm_total) * 40)
			var str = ""
			for (var i = 0; i < tek; i++) str += "+"
			str += '>'
			for (var i = tek + 1; i < 41; i++) str += "-"
			bot.editMessageText("<b>Выполнено:</b> " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n' + str + "\n\n<b>Статистика:</b>\n<b>Успешных:</b> " + mm_ok + "\n<b>Неуспешных:</b> " + mm_err, { chat_id: mm_achatid, message_id: mm_amsgid, reply_markup: RM_mm2, parse_mode: html })
			mm_status = false;
		}
		else if (d == "admin_mm_play") {
			mm_status = true;
			bot.editMessageText("Выполнено: " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n', { chat_id: mm_achatid, message_id: mm_amsgid, reply_markup: RM_mm1 })
		}
		else if (d.split("_")[0] == "ban") {
			var uuid = Number(d.split("_")[1])
			await User.findOneAndUpdate({ id: uuid }, { ban: true })
			bot.editMessageText('<a href="tg://user?id=' + uuid + '">Пользователь</a> заблокирован!', { chat_id: uid, message_id: message.message_id, parse_mode: html })
		}
		else if (d.split("_")[0] == "unban") {
			var uuid = Number(d.split("_")[1])
			await User.findOneAndUpdate({ id: uuid }, { ban: false })
			bot.editMessageText('<a href="tg://user?id=' + uuid + '">Пользователь</a> разбанен!', { chat_id: uid, message_id: message.message_id, parse_mode: html })
      }
      else if (d.split("_")[0] == "adminwipe") {
      var uuid = Number(d.split("_")[1])
      await User.findOneAndUpdate({ id: uuid }, { trees: [], buybalance: 0, outbalance: 0, deposit: 0, payout: 0, bhivebalance, frigbalance: 0 })
    await WildBee.findOneAndUpdate({ creator_id: uid }, { level: 1 })
    bot.sendMessage(data[uuid], 'Вы были обнулены создателем!', { parse_mode: "HTML" })
      bot.editMessageText('<a href="tg://user?id=' + uuid + '">Пользователь</a> обнулен!', { chat_id: uid, message_id: message.message_id, parse_mode: html })
      bot.sendMessage("@TyankaClickerResponses", ` <a href="tg://user?id=${uuid}">Пользователь</a> обнулен!`, { parse_mode: "HTML" })
    }
		else if (d == "admin_return") {
			bot.deleteMessage(message.chat.id, message.message_id);
			var h = process.uptime() / 3600 ^ 0
			var m = (process.uptime() - h * 3600) / 60 ^ 0
			var s = process.uptime() - h * 3600 - m * 60 ^ 0
			var heap = process.memoryUsage().rss / 1048576 ^ 0
			var b = (await User.findOne({ id: 0 })).deposit

			return qiwi.getBalance(async (err, balance) => {
				bot.sendMessage(uid, '<b>Админ-панель:</b>\n\n<b>🕰Аптайм бота:</b> ' + h + ' часов ' + m + ' минут ' + s + ' секунд\n<b>👲Пользователей в боте: </b>' + (await User.countDocuments({})) + '\n<b>💾Памяти использовано:</b> ' + heap + "МБ\n<b>📮Заявок на вывод:</b> " + await Ticket.countDocuments() + "\n<b>🔐Баланс QIWI:</b> " + balance.accounts[0].balance.amount + "₽", { parse_mode: "HTML", reply_markup: RM_admin })
			})
		}
	}
});

var state = []


User.prototype.inc = function (field, value = 1) {
	this[field] += value;
	return this.save();
}

User.prototype.dec = function (field, value = 1) {
	this[field] -= value;
	return this.save();
}

User.prototype.set = function (field, value) {
	this[field] = value;
	return this.save();
}



var lastTxnId
async function payeerCheck() {
  require('request')({
    method: 'POST',
    url: 'https://payeer.com/ajax/api/api.php?history',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `account=${config.payeer.account}&apiId=${config.payeer.apiId}&apiPass=${config.payeer.apiPass}&action=history&count=1&type=incoming
 ` }, async function (error, response, body) {
    body = JSON.parse(body)
    for (const txnId in body.history) {
      if (lastTxnId == null) { lastTxnId = txnId; }
      else if (txnId != lastTxnId) {
        lastTxnId = txnId
        if (body.history[txnId].type != "transfer" || body.history[txnId].status != "success" || !body.history[txnId].comment) return;
        if (body.history[txnId].comment.startsWith('SMC')) {
          let id = Number(body.history[txnId].comment.split("SMC")[1]);
          let user = await User.findOne({ id });
          if (!user) return;
          await user.inc('game_payin', x.sum.amount);
          await user.inc('game_balance', x.sum.amount);
          await bot.sendMessage(id, `💳 Вы успешно пополнили свой игровой баланс на ${x.sum.amount}₽`);
          bot.sendMessage("@UzPay_Balance", `⚡️ <a href="tg://user?id=${id}">Пользователь</a> пополнил игровой баланс на <b>${x.sum.amount}₽</b>`, { parse_mode: "HTML" })
          return
        }

        let user = await User.findOne({ id: Number(body.history[txnId].comment.split("GG")[1]) });
        if (!user) return;
        if (body.history[txnId].creditedCurrency == "RUB")
          var sum = roundPlus(Number(body.history[txnId].creditedAmount))
        else return
        var id = user.id

        var b = (await User.findOne({ id: 0 })).deposit

        if (b == 0) {
          await user.inc('deposit', sum);
          await user.inc('buybalance', sum);
          await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: sum } })
          bot.sendMessage(id, `Ваш баланс пополнен на ${sum}₽`);
		      bot.sendMessage("@UzPay_Balance", `<a href="tg://user?id=${id}">Пользователь</a> пополнил <b>${sum}₽</b>\nПС: PAYEER`, { parse_mode: "HTML" })
          ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${sum}₽\nПС: PAYEER`, { parse_mode: "HTML" }))
        } else {
          await user.inc('deposit', sum);
          b = b / 100
          await user.inc('buybalance', sum + sum * b);
          await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: sum } })
          bot.sendMessage(id, `Ваш баланс пополнен на ${sum}₽ и Вы получаете бонус - ${roundPlus(sum * b)}₽!`);
		      bot.sendMessage("@UzPay_Balance", `<a href="tg://user?id=${id}">Пользователь</a> пополнил <b>${sum}₽ и получил бонус - ${roundPlus(sum * b)}p!</b>\nПС: PAYEER`, { parse_mode: "HTML" })
	
          ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${sum}₽ + ${roundPlus(sum * b)}₽ бонус\nПС: PAYEER`, { parse_mode: "HTML" }))
        }
        await User.findOneAndUpdate({ id: user.ref }, { $inc: { buybalance: roundPlus(sum * 0.05) } })
        await User.findOneAndUpdate({ id: user.ref }, { $inc: { outbalance: roundPlus(sum * 0.05) } })
        bot.sendMessage(user.ref, `🤝 Ваш <a href="tg://user?id=${id}">реферал</a> пополнил баланс на <b>${sum}₽</b>!\n💸 Вам начислено по <b>${roundPlus(sum * 0.05)}₽</b> на балансы для покупок и для вывода`, { parse_mode: "HTML" }).catch()
      }
    }
  })
}

if (config.payeer.enabled) {
  setInterval(payeerCheck, 10000)
  payeerCheck()
}

var state = []

setInterval(async () => {
	qiwi.getOperationHistory({ rows: 10, operation: 'IN' }, (err, response) => {
		response.data.map(async (x) => {
			if (!x.comment) return;
			if (txnId.indexOf(x.txnId) !== -1) return;
			if (x.comment.startsWith('SMC')) {
			let id = Number(x.comment.split("SMC")[1]);
			if (!id) return;
			let user = await User.findOne({ id });
			if (!user) return;
			if (x.sum.currency != 643) return;
			var b = (await User.findOne({ id: 0 })).deposit / 200
			var sum = x.sum.amount
			if (b > 0) {
				await user.inc('deposit', x.sum.amount);
				if (user.deposit + x.sum.amount > 50000 && !user.not) {
					await bot.sendMessage(id, `💰 Вы пополнили баланс бота более, чем на 200₽ и приглашаетесь в чат инвесторов!\nПерешлите это сообщение администратору @Dima9606`);
					await User.findOneAndUpdate({ id: user.id }, { not: true })
				}

				await user.inc('buybalance', x.sum.amount + x.sum.amount * b);
				await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: x.sum.amount } })
				bot.sendMessage(id, `Ваш баланс пополнен на ${x.sum.amount}₽ и Вы получаете бонус - ${roundPlus(x.sum.amount * b)}₽!`);
				bot.sendMessage("@TyankaClickerResponses", `🍇 <a href="tg://user?id=${id}">Пользователь</a> пополнил баланс на <b>${x.sum.amount}₽</b> и получил ${roundPlus(x.sum.amount * b)}₽ бонусом!\nПС: QIWI`, { parse_mode: "HTML" })
				ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${x.sum.amount}₽ + ${roundPlus(x.sum.amount * b)}₽ бонус\nПС: QIWI`, { parse_mode: "HTML" }))

			}
			else if (b == 0) {
				await user.inc('deposit', x.sum.amount);
				if (user.deposit + x.sum.amount > 50000 && !user.not) {
					await bot.sendMessage(id, `💰 Вы пополнили баланс бота более, чем на 200₽ и приглашаетесь в чат инвесторов!\nПерешлите это сообщение администратору @Dima9606`);
					await User.findOneAndUpdate({ id: user.id }, { not: true })
				}
				await user.inc('buybalance', x.sum.amount);
				await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: x.sum.amount } })
				bot.sendMessage(id, `Ваш баланс пополнен на ${x.sum.amount}₽`);
				bot.sendMessage("@TyankaClickerResponses", `🍇 <a href="tg://user?id=${id}">Пользователь</a> пополнил баланс на <b>${x.sum.amount}₽</b>\nПС: QIWI`, { parse_mode: "HTML" })
				ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${x.sum.amount}₽\nПС: QIWI`, { parse_mode: "HTML" }))
			} else {
				await user.inc('deposit', x.sum.amount);
				if (user.deposit + x.sum.amount > 500000 && !user.not) {
					await bot.sendMessage(id, `💰 Вы пополнили баланс бота более, чем на 200₽ и приглашаетесь в чат инвесторов!\nПерешлите это сообщение администратору @Dima9606`);
					await User.findOneAndUpdate({ id: user.id }, { not: true })
				}
				b = b / 200
				await user.inc('buybalance', x.sum.amount + x.sum.amount * b);
				await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: x.sum.amount } })
				bot.sendMessage(id, `Ваш баланс пополнен на ${x.sum.amount}₽ и Вы получаете бонус - ${roundPlus(x.sum.amount * b)}₽!`);
				bot.sendMessage("@TyankaClickerResponses", `🍇️ <a href="tg://user?id=${id}">Пользователь</a> пополнил баланс на <b>${x.sum.amount}₽</b> и получил ${roundPlus(x.sum.amount * b)}₽ бонусом!\nПС: QIWI`, { parse_mode: "HTML" })
				ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${x.sum.amount}₽ + ${roundPlus(x.sum.amount * b)}₽ бонус`, { parse_mode: "HTML" }))

			}
			await User.findOneAndUpdate({ id: user.ref }, { $inc: { buybalance: roundPlus(x.sum.amount * 0.08) } })
			await User.findOneAndUpdate({ id: user.ref }, { $inc: { outbalance: roundPlus(x.sum.amount * 0.08) } })

			bot.sendMessage(user.ref, `🤝 Ваш <a href="tg://user?id=${id}">реферал</a> пополнил баланс на <b>${x.sum.amount}₽</b>!\n💸 Вам начислено по <b>${roundPlus(x.sum.amount * 0.08)}₽</b> на балансы для покупок и для вывода`, { parse_mode: "HTML" }).catch()

			txnId.push(x.txnId)
			require('fs').writeFileSync('./txnId.json', JSON.stringify(txnId));
			}
		});
	});
}, 10000);

async function mmTick() {
	if (mm_status) {
		try {
			mm_i++
			if (mm_type == "text") {
				if (mm_btn_status)
					bot.sendMessage(mm_u[mm_i - 1], mm_text, { reply_markup: { inline_keyboard: [[{ text: mm_btn_text, url: mm_btn_link }]] }, parse_mode: html }).then((err) => { mm_ok++ }).catch((err) => { mm_err++ })
				else
					bot.sendMessage(mm_u[mm_i - 1], mm_text, { parse_mode: html }).then((err) => { console.log((mm_i - 1) + ') ID ' + mm_u[mm_i - 1] + " OK"); mm_ok++ }).catch((err) => { mm_err++ })
			}
			else if (mm_type == "img") {
				if (mm_btn_status)
					bot.sendPhoto(mm_u[mm_i - 1], mm_imgid, { caption: mm_text, reply_markup: { inline_keyboard: [[{ text: mm_btn_text, url: mm_btn_link }]] } }).then((err) => { mm_ok++ }).catch((err) => { mm_err++ })
				else
					bot.sendPhoto(mm_u[mm_i - 1], mm_imgid, { caption: mm_text }).then((err) => { console.log((mm_i - 1) + ') ID ' + mm_u[mm_i - 1] + " OK"); mm_ok++ }).catch((err) => { mm_err++ })
			}
			if (mm_i % 10 == 0) {
				var tek = Math.round((mm_i / mm_total) * 40)
				var str = ""
				for (var i = 0; i < tek; i++) str += "+"
				str += '>'
				for (var i = tek + 1; i < 41; i++) str += "-"
				bot.editMessageText("<b>Выполнено:</b> " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n' + str + "\n\n<b>Статистика:</b>\n<b>Успешных:</b> " + mm_ok + "\n<b>Неуспешных:</b> " + mm_err, { chat_id: mm_achatid, message_id: mm_amsgid, reply_markup: RM_mm1, parse_mode: html })
			}
			if (mm_i == mm_total) {
				mm_status = false;
				bot.editMessageText("Выполнено: " + mm_i + '/' + mm_total, { chat_id: mm_achatid, message_id: mm_amsgid })
				sendAdmins('<b>Рассылка завершена!\n\nСтатистика:\nУспешно:</b> ' + mm_ok + "\n<b>Неуспешно:</b> " + mm_err, { parse_mode: html })
				mm_u = []
			}
		} finally { }
	}
}

setInterval(mmTick, 100);

var mm_total
var mm_i
var mm_status = false
var mm_amsgid
var mm_type
var mm_imgid
var mm_text
var mm_achatid
var mm_btn_status
var mm_btn_text
var mm_btn_link
var mm_ok
var mm_err

async function mm_t(text, amsgid, achatid, btn_status, btn_text, btn_link, size) {
	let ut = await User.find({}, { id: 1 }).sort({ _id: -1 })
	mm_total = ut.length
	console.log(ut)
	mm_u = []
	for (var i = 0; i < mm_total; i++)
		mm_u[i] = ut[i].id
	if (size != 100) {
		mm_u = randomizeArr(mm_u)
		mm_total = Math.ceil(mm_total * (size / 100))
		mm_u.length = mm_total
	}
	ut = undefined
	mm_i = 0;
	mm_amsgid = amsgid
	mm_type = "text"
	mm_text = text
	mm_ok = 0
	mm_err = 0
	mm_achatid = achatid
	if (btn_status) {
		mm_btn_status = true
		mm_btn_text = btn_text
		mm_btn_link = btn_link
	}
	else
		mm_btn_status = false
	mm_status = true;
}

bot.on('photo', async msg => {
	if (msg.from != undefined) {
		var uid = msg.from.id
		if (state[uid] == 7770 && ADMINS.indexOf(uid) !== -1) {
			state[uid] = undefined
			var text = ""
			if (msg.caption != undefined) text = msg.caption
			bot.sendMessage(uid, "Рассылка запущена!").then((e) => {
				if (text.split("#").length == 4) {
					var btn_text = text.split("#")[1].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
					var btn_link = text.split("#")[2].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
					text = text.split("#")[0].replace(/(^\s*)|(\s*)$/g, '').replace(' ', '')
					mm_img(msg.photo[msg.photo.length - 1].file_id, text, e.message_id, e.chat.id, true, btn_text, btn_link, 100)

				}
				else
					mm_img(msg.photo[msg.photo.length - 1].file_id, text, e.message_id, e.chat.id, false, false, false, 100)

			})
		}
	}
})



async function mm_img(img, text, amsgid, achatid, btn_status, btn_text, btn_link, size) {
	let ut = await User.find({}, { id: 1 }).sort({ _id: -1 })
	mm_total = ut.length
	mm_u = []
	for (var i = 0; i < mm_total; i++)
		mm_u[i] = ut[i].id
	if (size != 100) {
		mm_u = randomizeArr(mm_u)
		mm_total = Math.ceil(mm_total * (size / 100))
		mm_u.length = mm_total
	}

	ut = undefined
	mm_i = 0;
	mm_amsgid = amsgid
	mm_type = "img"
	mm_text = text
	mm_imgid = img
	mm_ok = 0
	mm_err = 0
	mm_achatid = achatid
	if (btn_status) {
		mm_btn_status = true
		mm_btn_text = btn_text
		mm_btn_link = btn_link
	}
	else
		mm_btn_status = false
	mm_status = true;
}

function randomizeArr(arr) {
	var j, temp;
	for (var i = arr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}

const html = "HTML"

function sendAdmins(text, params) { for (var i = 0; i < ADMINS.length; i++) bot.sendMessage(ADMINS[i], text, params) }

var data = []


function roundPlus(number) { if (isNaN(number)) return false; var m = Math.pow(10, 2); return Math.round(number * m) / m; }

async function main() {
	var u = (await User.find({}, { id: 1 })).map((e) => { return e.id })
	for (var i in u) {
		await User.findOneAndUpdate({ id: u[i] }, { refCount: await User.countDocuments({ ref: u[i] }) })
		console.log(i)
	}

}
//main()

//User.updateMany({}, {payout: 0, not: false}).then()





function randomizeArr(arr) {
	var j, temp;
	for (var i = arr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}

function randomInteger(min, max) {

	let rand = min + Math.random() * (max + 1 - min);

	return Math.floor(rand);
}

async function ticker() {
	var d = new Date()
	var minutes = d.getMinutes()
	var hours = d.getHours()
	var date = d.getDate()
	if (minutes == 0 && hours == 0)
		await User.updateMany({}, { spinsToday: 0 })
}

setInterval(ticker, 1000 * 60)


function randomInteger(min, max) {
	// случайное число от min до (max+1)
	let rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}
User.insertMany([
{ "_id" : "5dfaac928d3ea75ef63263ba", "trees": [ ], "id" : 0, "buybalance" : 0, "outbalance": 0, "klik": 0, "bhivebalance" :0, "wb_profits" : 0, "name" : "Infix ©", "fc" : 0, "ref" : 0., "regDate" : "18/12/2019", "deposit" : 0, "payout" : 0, "fetuses" : 0, "menu" : "{\"price\":20,\"status\":false,\"count\":5,\"bought\":3}", "statusklik" :"{\"status\":false}", "lastCollect" : 1576709266975, "ban" : false, "refCount" : 0, "not" : false, "__v" : 0, "totalEarn" : 0, "prudLevel" : 0 },
{ "_id" : "5dfbe31493b06e7818e2c5d7", "trees" : [ ], "id" : 1, "menu" : "{\"price\":20,\"status\":true,\"count\":5,\"bought\":3}", "statusklik" :"{\"status\":true}", "__v" : 0, "totalEarn" : 0, "prudLevel" : 0 }
]).then()

User.updateMany({}, {statusklik: ""}).then()
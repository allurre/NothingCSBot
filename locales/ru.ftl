start_command = 
    .description = Меню
language_command = 
    .description = Язык
setcommands_command =
    .description = Обновить команды
panel_command =
    .description = Админка

start = 
    .register = Привет, {$name}! 

    🚀 Это уникальный бот по CS2! Здесь ты можешь получить любимые скины бесплатно или же халявно пополнить баланс стима!

    🎯 Для начала - давай пройдем калибровку и узнаем твой ранг! 
    .welcome = 🧨 Привет, {$name}!

    Мы создали этого бота для тебя! Здесь ты получишь бесплатно скины или можешь халявно пополнить баланс стима!

    ⁉️ Как получить скины или баланс стима:
    ▪️ Стреляй по мишеням и получай монетки 💰 
    ▪️ Покупай за монетки 💰 кейсы и ключи.
    ▪️ Получай скины или баланс стима!

    ❓ Если остались вопросы - жми /faq.
start_buttons =
    .calibration = 🎯 Калибровка
    .profile = 📋 Профиль
    .workout = 🔝 Тренировка
    .cases = Кейсы

default_buttons = 
    .home = Домой
    .back = Назад
    .cancel = Отмена
    .confirm = Подтвердить
default =
    .no = нет
    .yes = да

format =
    .only_en = только английские буквы
    .channel = ссылка@название@доп.мишени(1 по умолчанию)
    .data_change = число@комментарий
    .photo = фото

calibration =
    .end = ✔️ Калибровка завершена!

    🎖 Твой текущий ранг: {$rang}

    🚀 ЖМИ /start!
    .already_complete = Вы уже прошли калибровку!

workout =
    .main = <b>Добро пожаловать на тренировку, {$name}!</b>

    Чтобы заработать монетки и открывать кейсы - тебе нужно тренироваться!

    Стреляй по мишеням
    Прокачивай ранг
    Зарабатывай монетки

    Подписка на наш канал @cs_unlimited дает тебе +5 доп.мишеней каждый день. А ещё мы выдаем промокоды на канале для бота 😉

    <tg-spoiler>P.S. Во время тренировки есть шанс, что тебе выпадет кейс 🤫</tg-spoiler>

    🎖 Твой текущий ранг: {$rang}
    💰 Твои монетки: {$coins}
    🎯 Мишени: {$targets}

workout_buttons = 
    .shoot = Стрелять
    .additionally = Мишени

shoot = 
    .no-targets = У вас нет мишеней!
    .start = Артём гей
    .end-head = Хедшот! {$reward}
    .end-body = Моя печень! {$reward}
    .end-arm = Больно в руке {$reward}
    .end-leg = Больно в ноге {$reward}
    .end-miss = Промах {$reward}

profile = 
    .main = Профиль {$id}
    Ник: {$name}
    Ранг: {$rang}
    Монетки: {$coins}
    Точность: {$accuracy}
    .inventory = Инветнарь пользователя {$id}

profile_buttons = 
    .inventory = Инвентарь
    .items-next = >
    .items-previous = <

additionally =
    .main = Доп. каналы!
    Нажми на каждый чтобы подписаться
    Чтобы собрать все мишени нажми собрать
    .already-sub = Вы уже подписаны на этот канал!
    .subscribe = Канал: {$name}
    Подписка на этот канал даст вам <b>{$adding}</b>
    Для подписки нажми кнопку подписаться ниже
    .already-collect = Вы уже собрали все мишени на сегодня
    .collect = Вам начисленно {$count} мишеней
    .no-subs = Вы не подписаны ни на один из каналов :(

additionally_buttons = 
    .claim = Собрать
    .subscribe = Подписаться
    .no_channels = Нет каналов

cases =
    .main = Кейсы!
    .case-menu = Кейс: {$name}
    Стоимость: {$price}
    {$description}
    .case-open = Октрываю кейс
    .case-info = Лут в кейсе {$name}
    {$loot}
    .case-no-info = Нет лута
    .unreleased = снять с релиза
    .release = поставить на релиз

loot =
    .skin = Скин
    .price = Цена
    .quality = Качество
    .chance = Шанс выпадения
    .army = армейсоке
    .illegal = запрещенное 
    .classified = засекреченное
    .secret = тайное
    .army_st = армейсоке СТ
    .illegal_st = запрещенное СТ
    .classified_st = засекреченное СТ
    .secret_st = тайное СТ
    .no-looting = Увы, но тут пусто
    .drop = {$name}
    Качество: {$rarity}
    Цена: {$price}

cases_buttons =
    .no_cases = Нет кейсов
    .info = Подробнее
    .open = Открыть
    .info-next = >
    .info-previous = <


language = 
    .select = Пожалуйста, выберите ваш язык
    .changed = Обновления языка успешо! Нажмите /start для установления языка

promocode =
    .main = Ввод промокода
    .use-sucsess = Успешно! Вам начисленно {$count} {$type}
    .use-unsucsess = Не удалось активировать промокод
    .use-no_promocode = Не удалось активировать промокод. Такого промокода не существует
    .use-express = Не удалось активировать промокод. Этот промокод истёк
    .use-no_uses = Не удалось активировать промокод. Этот промокод закончился

admin =
    .commands-updated = Команды обновлены
    .panel-main = Это админ панель
    .panel-pick_user = Выберите пользователя
    .panel-change_user = Изменение пользователя
    Имя пользователя: {$user}
    .money-choose = Укажите количество монеток и комментарий в формате
    новое кол-во монеток@комментарий
    .targets-choose = Укажите количество мишеней и комментарий в формате
    новое кол-во мишеней@комментарий
    .case-edit_photo = Отправте новую картинку для кейса.
    Чтобы удалить картинку отправте любой сообщение без файлов
    .panel-channels_manage = Управление каналами с подпиской
    Текущие каналы:
    {$channels}
    .panel-no_channels = Нет каналов
    .panel-pick_new_channel = Выберите новый канал
    .panel-add_new_channel = Укажите рекламню ссылку, имя канала (будет отображено в кнопке) и кол-во бросков за этот канал (1 по умолчанию) через @
    .panel-remove_channel = Выберите канал для удаления
    .panel-delete_channel_success = Успешно! Канал удалён
    .panel-delete_channel_failed = Не удалось удалить канал
    .panel-failed_new_channel = Не удалось добавить канал. Проверьте что:
    1) чат является каналом
    2) бот является админом этого канала
    3) этого канала нет в доп. каналах
    .panel-manage_cases = Все кейсы
    {$cases}
    .panel-no_cases = Нет кейсов
    .panel-add_case = Добавить кейс
    .panel-info_case = Данные кейса: {$name}
    ID: {$id}
    Цена: {$price}
    Статус: {$release}
    Может выпасть?: {$can_drop}
    .panel-edit_case = Редактирование кейса: {$name}
    .info-release = релизнут
    .info-no_release = не релизнут
    .panel-manage_items = Управление предметами
    {$items}
    .panel-no_items = Нет предметов
    .panel-add_item = Добавить предмет
    .panel-no_active_promo = Нет активных промокодов
    Может посмотрим устаревшие?
    .panel-no_expired_promo = Нет устаревших промокодов
    Может посмотрим активные?
    .panel-success = Успешно. Изменения будут применены в течении 5 минут

admin_buttons =
    .choose-user = Получить пользователя
    .choose-channel = Получить канал
    .status = Изменить статус
    .shoot = Выстрелы
    .money = Монетки
    .data = {$count}
    .add-channel = Добавить канал
    .remove-channel = Удалить канал
    .no_channels = Нет каналов
    .case-add = Добавить кейс
    .case-edit = Редактировать даннные
    .loot-edit = Редактировать лут
    .image-edit = Редактировать изображение
    .case-edit_candrop = Может выпасть
    .case-edit_price = Цена
    .item-add = Добавить предмет
    .item-delete = Удалить предмет
    .manage-user = Управление пользователями
    .manage-subscribe-channels = Управление доп. каналами
    .manage-item = Управление предметами
    .manage-cases = Управление кейсами
    .manage-notifications = Управление уведомлениями
    .manage-promocodes = Управление промокодами
    .manage-mailing = Рассылка
    .locale-edit = Локализация
    .view-expired_promocodes = Старые промокоды
    .view-active_promocodes = Активные промокоды

notifications =
    .money_change = Ваши монетки изменены
    Ваш баланс: {$coins}
    Комментарий: {$reason}
    .shoot_change = Ваши выстрелы изменены
    Ваш баланс: {$shoot}
    Комментарий: {$reason}
    .status_change = Ваш ранг изменён
    Ваш ранг: {$rang}
    Комментарий: {$reason}
    .day_update = Новый день - ноая жизнь
    .reminder_shoots = У вас ещё есть выстрелы
    .reminder_additionally = Вы ещё не собрали все доп. выстрелы
    .reminder_hour = Остался час до сброса! Соберите выстрелы и потренеруйтесь
    .new_rank = Твое мастерство поражает!
    Ты заслуживаешь повышения в звании!
    Твой новый ранг: {$rang}
    .little_more = Давай поднажмем!
    До следующего ранга осталось всего одна тренировка!

errors =
    .regestration = Что то произошло в момент вашей регестрации.
    Нажмите /start и попробуйте ещё раз.
    Если это не поможет обратитесь в техническую поддержку
    .no-registered-user = Вы не зарегестрированы.
    Нажмите /start чтобы начать игру!
    .no-calibration-user = Вы не прошли калибровку!
    Нажмите /start чтобы пройти её!
    .no-select-user-found = Указанный вами пользователь не найден!
    Скорее всего он не зарегестрирован!
    .forbiden = Недостаточно прав для выполнения взаимодействия
    .invalid-input = Невернные ввод! Введите в формате '{$format}'
    .an-error-has-occurred = Произошла неизвестная ошибка
    .channel-is-undefined = Канала не существует
    .channel-sub-check-failed = Не удалось проверить подписку на канал
    Напишите в поддежржку, указав этот id: {$id}
    .too-old = Взаимодействие устраело
    Используйте /start
    .no-box-found = Кейс не найден. Попробуйте обновить панель.
    Если это не помогло обратитесь в поддержку
    .low-user-coins = У вас недостаточно монет.
    Для открытия необходимо ещё {$coins}
    .lost_data = Данные утеряны

unhandled = Неизвестное взаимодействие. Нажмите /start

##

pino = pino

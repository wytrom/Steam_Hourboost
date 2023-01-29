const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const moment = require('moment-timezone');
const keep_alive = require('./keep_alive.js');

var accounts = [
    {username: 'Seu login', password: 'Sua senha', shared_secret: 'Seu Secret key'},
    {username: 'Seu login', password: 'Sua senha', shared_secret: 'Seu Secret key'},
    {username: 'Seu login', password: 'Sua senha', shared_secret: 'Seu Secret key'}
];

var games = [730, 440, 570];  // Enter here AppIDs of the needed games
var status = 1;  // 0 - Offline, 1 - Online, 7 - Invisible
var running = true;

for (let account of accounts) {
    let user = new steamUser();
    let startTime = moment().tz("America/Sao_Paulo").format(); 
    user.logOn({
        "accountName": account.username, 
        "password": account.password, 
        "twoFactorCode": steamTotp.generateAuthCode(account.shared_secret)
    });
    user.on('loggedOn', () => {
        console.log(`Iniciado em: ${startTime}`);
        if (user.steamID != null) console.log(user.steamID + ' - Successfully logged on');
        user.setPersona(status);               
        user.gamesPlayed(games);
        user.on('friendMessage', (steamID, message) => {
            if(message === '!start' && running === false) {
                running = true;
                startTime = moment().tz("America/Sao_Paulo").format(); 
                console.log(`Iniciado em: ${startTime}`);
                user.setPersona(status);               
                user.gamesPlayed(games);
                user.chatMessage(steamID, "Bot iniciado com sucesso!");
            } else if(message === '!stop' && running === true) {
                running = false;
                let endTime = moment().tz("America/Sao_Paulo").format();
                console.log(`Finalizado em: ${endTime}`);
                user.setPersona(0);
                user.gamesPlayed([]);
                user.chatMessage(steamID, "Bot parado com sucesso!");
            } else {
                user.chatMessage(steamID, "Não estou Online! Apenas usando Akuma Boost, Para Aumentar as horas do perfil");
            }
        });
    });
}

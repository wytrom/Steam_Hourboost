const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const keep_alive = require('./keep_alive.js')

var accounts = [
    {username: 'Seu login', password: 'Sua senha', shared_secret: 'Seu Secret key'},
    {username: 'Seu login', password: 'Sua senha', shared_secret: 'Seu Secret key'},
    {username: 'Seu login', password: 'Sua senha', shared_secret: 'Seu Secret key'}
];

var games = [730, 440, 570];  // Enter here AppIDs of the needed games
var status = 1;  // 0 - Offline, 1 - Online, 7 - Invisible

for (let account of accounts) {
    let user = new steamUser();
    user.logOn({
        "accountName": account.username, 
        "password": account.password, 
        "twoFactorCode": steamTotp.generateAuthCode(account.shared_secret)
    });
    user.on('loggedOn', () => {
        if (user.steamID != null) console.log(user.steamID + ' - Successfully logged on');
        user.setPersona(status);               
        user.gamesPlayed(games);
    });

    user.on('friendMessage', (steamID, message) => {
        // respond with a funny message
        user.chatMessage(steamID, "Não estou Online! Apenas usando Akuma Boost, Para Aumentar as horas do perfil");
    });
}

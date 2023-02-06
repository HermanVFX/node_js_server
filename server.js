import { createRequire } from "module";
import multer from "multer";


const require = createRequire(import.meta.url);

const express = require('express');
const wmic = require("wmic");

const app = express();

const PORT = 3000;

let WINUSERS = [];

wmic.get_values(
    "UserAccount",
    "Name",
    "LocalAccount=True",
    function (err, value) {
      if (err) {
          console.log(" - ERROR : ", err);
      }
      WINUSERS = value.map(u => u.Name);
    }
  );

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>winAPI</title>
            </head>
            <body>
                <form method="POST" enctype="multipart/form-data">
        
                    <label for="username">Введите имя</label>
        
                        <input id="username" name="username" type="text" required/>
        
                    <button type="submit">Проверить</button>
                </form>
        
                <style>
                    form {
                        margin: 25px auto;
                        padding: 18px;
                        background-color: lightblue;
        
                        display: flex;
                        flex-direction: column;
                        gap: 18px;
                        max-width: 320px;
                    }
        
                    button {
                        color: white;
                        background-color: #0F548C;
                        cursor: pointer;
                    }
                </style>
            </body>
        </html>
    `)
});

app.post('/', multer().none(), function (request, response) {
    if(!request.body) {
        console.log(' - ERROR : 400');
        return response.sendStatus(400);
    } 

    let usr = request.body.username;

    console.log(' - ALL USERS : ', WINUSERS);
    console.log(' - SEND USER : ', usr);
    
    if (WINUSERS.includes(usr)) {
        console.log(` - USER WHITH NAME : ${usr} WAS FOUND`);
        response.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>winAPI</title>
                </head>
                <body>
                    <div>
                        <p>Пользователь ${usr} есть</P>
                        <a href="/">Назад</a>
                    </div>
                    <style>
                    div {
                        margin: 25px auto;
                        padding: 18px;
                        background-color: lightblue;
        
                        display: flex;
                        flex-direction: column;
                        gap: 18px;
                        max-width: 320px;
                    }
        
                    a {
                        display: block;
                        text-decoration: none;
                        color: white;
                        background-color: #0F548C;
                        cursor: pointer;
                        text-align: center;
                    }
                </style>
                </body>
            </html>
        `)
    } else {
        console.log(` - USER WHITH NAME : ${usr} DOES NOT FOUND`);
        response.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>winAPI</title>
                </head>
                <body>
                    <div>
                        <p>Пользователя ${usr} нет</P>
                        <a href="/">Назад</a>
                    </div>
                    <style>
                        div {
                            margin: 25px auto;
                            padding: 18px;
                            background-color: lightblue;
            
                            display: flex;
                            flex-direction: column;
                            gap: 18px;
                            max-width: 320px;
                        }
            
                        a {
                            display: block;
                            text-decoration: none;
                            color: white;
                            background-color: #0F548C;
                            cursor: pointer;
                            text-align: center;
                        }
                    </style>
                </body>
            </html>
        `)
    }
});

app.listen(PORT, (e) => {
    e ? console.log(' - ERROR : ', e) : console.log(` - Server listens PORT : ${PORT}`);
});

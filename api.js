const http = require('http')
const fs = require('fs')
const path = require(`path`)
const url = require('url')
const func = require("./api")
const server = http.createServer().listen(8123);

server.on("request", (req, res) => {

    res.setHeader("Content-Type", "application/json; charset=utf-8")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    let body = ''

    req.on('data', (chunk) => {

        body += chunk

    }).on('end', () => {
        let data = body // or however you need your data

        try {
            data = JSON.parse(data)
        } catch (error) {

        }

        func.handler(data, {}, (result) => {
            let urls = {}

            if (!result) {
                res.statusCode = 400
                res.write(`No results`)
                res.end()
                return
            }

            res.statusCode = 200
            res.write(JSON.stringify(result))
            res.end()
            return
        })
    })
})
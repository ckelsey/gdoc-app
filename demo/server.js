const fs = require(`fs`)
const https = require(`https`)
const path = require(`path`)
const mime = require('mime-types')
const port = 5000
const index = process.env.INDEXFILE || `src/index`
const options = {
    key: fs.readFileSync(`ssl.key`, `utf8`),
    cert: fs.readFileSync(`ssl.crt`, `utf8`),
}

const requestHandler = (request, response) => {
    let payload = ``
    let contentType = ``

    const setIndex = () => {
        contentType = mime.contentType(path.extname(`${index}.html`))
        payload = fs.readFileSync(`${index}.html`, `utf8`)
    }

    if (request.url === `/`) {
        setIndex()
    } else {

        try {
            contentType = mime.contentType(path.extname(path.resolve(`.${request.url}`)))
            payload = fs.readFileSync(path.resolve(`.${request.url}`))
        } catch (error) {
            setIndex()
        }
    }

    response.setHeader(`Access-Control-Allow-Origin`, `*`)
    response.setHeader(`Access-Control-Request-Method`, `*`)
    response.setHeader(`Access-Control-Allow-Methods`, `OPTIONS, GET`)
    response.setHeader(`Access-Control-Allow-Headers`, `*`)
    response.setHeader(`Content-Type`, contentType)
    response.writeHead(200)
    response.end(payload, `binary`)
}

const server = https.createServer(options, requestHandler)

server.listen(port, (err) => {
    if (err) { return console.log(`something bad happened`, err) }
    console.log(`server is listening on ${port}`)
})
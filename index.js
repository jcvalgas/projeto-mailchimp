import express from "express"
import path from "path"
import bodyParser from "body-parser"
import https from "https"
import { response } from "express"

const __dirname = path.resolve(path.dirname(''))
const port = process.env.PORT || 3002
const app = express();

app.set('view engine', 'index.ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post("/", (req, res) => {
    const data = {
        members: [
            {
                email_address: req.body.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: req.body.Fname,
                    LNAME: req.body.Lname,
                }
            }
        ]
    }
    
    const jsonData = JSON.stringify(data)
    const url = "https://us14.api.mailchimp.com/3.0/lists/2b3e4b3d15";
    const options = {
        method: "POST",
        auth: "Valgas:1a7bcae7724d04d37811e279b0c257cf-us14"
    }
    const request = https.request(url, options, (response) => {
        if(response.statusCode === 200) {
            res.render('sucess.ejs')
        } else {
            res.render('failure.ejs')
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data))
        })
    })
    
    request.write(jsonData)
    request.end()
})



app.listen(port, () => {
    console.log(`Estou rodando na porta ${port}`)
})


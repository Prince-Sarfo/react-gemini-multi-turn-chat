const express = require("express");
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.json())
require("dotenv").config()

const PORT = process.env.PORT;

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

app.post('/gemini', async (req, res)=>{
    const model =  genAI.getGenerativeModel({model: "gemini-pro"})
    const chat = model.startChat({
        history: req.body.history 
    })

   const msg = req.body.message

   const results = await chat.sendMessage(msg)
   const response = await results.response
   const text = response.text()
   res.send(text)
})

app.listen(PORT, ()=>{
    console.log("App is listen at port " + PORT);
});
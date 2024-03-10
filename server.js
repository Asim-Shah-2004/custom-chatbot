import OpenAI from "openai";
import dotenv from "dotenv"
dotenv.config()
import express from "express"
import bodyParser from "body-parser"
const app = express()
const PORT = 3000;


const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

app.use(bodyParser.json())

app.post('/chat', async(req,res)=>{
  
 const {prompt} = req.body;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: `${prompt}` }],
    model: "gpt-3.5-turbo",
  });

  const response = completion.choices[0].message.content

  res.send({message:response})

})

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})
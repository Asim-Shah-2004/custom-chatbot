import OpenAI from "openai"
import dotenv from "dotenv"
import express from "express"
import bodyParser from "body-parser"

dotenv.config()
const app = express()
const PORT = 3000

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.use(bodyParser.json())

async function findScope(question) {
    const result = await openai.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Is the question related to geography? Answer with yes or no only: ${question}`,
            },
        ],
        model: "gpt-3.5-turbo",
    })

    return result.choices[0].message.content.toLowerCase()
}

app.post("/chat", async (req, res) => {
    const { prompt } = req.body
    const ans = await findScope(prompt)
    console.log(ans)

    if (ans === "no") {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: `${prompt}` }],
            model: "gpt-3.5-turbo",
        })

        const response = completion.choices[0].message.content
        res.send({ message: response })
    } else {
        res.send({ message: "Cannot answer geography related questions." })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

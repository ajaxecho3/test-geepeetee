import { Configuration, OpenAIApi } from 'openai'

describe('Open Ai Test', () => {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set')
  }

  const configuration = new Configuration({
    apiKey,
  })

  const openai = new OpenAIApi(configuration)

  it('should generate javascript cypress API test', async () => {
    const prompt = 'your prompt here'

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      temperature: 0.7,
      maxTokens: 256,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      prompt: `
        "### Generate javascript cypress API test ####
        ${prompt}
        result:
      `,
    })

    if (response.status !== 200) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const result = response.data.choices[0].text


    eval(result)
  })
})
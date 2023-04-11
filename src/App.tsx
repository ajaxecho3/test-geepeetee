import { Configuration, OpenAIApi } from 'openai'
import { useState } from 'react'
import { saveAs } from 'file-saver';
import CodeMirror from '@uiw/react-codemirror';
import { tags as t } from '@lezer/highlight';
import { dracula, draculaInit } from '@uiw/codemirror-theme-dracula';
function App() {
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_KEY
  })

  const openai = new OpenAIApi(configuration)
  const [prompt, setPrompt] = useState('https://identity.concentrixcx.com/health')
  const [result, setResult] = useState<string | undefined>(undefined)

  async function generateCypressTest() {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      prompt: `
        "### Generate javascript cypress API test ####
        ${prompt}
        result:
      `
    })

    if (response.status === 200) {


      setResult(response.data.choices[0].text)
    }
  }

  const download = () => {
    let blob = new Blob([`${result}`])
    saveAs(blob, 'text.spec.js')
  }

  return (
    <div className=" mx-auto w-3/4 flex flex-col justify-center space-y-3">
      <div className=' flex flex-col justify-center mt-10 w-3/4 mx-auto items-center space-y-2'>
        <textarea placeholder="Enter prompt" className="border rounded-lg border-solid p-2 w-full max-w-lg" value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
        <div className=' flex  items-end justify-end'>
          <button className=" bg-teal-600 p-2 text-white rounded-md hover:bg-teal-700" onClick={() => generateCypressTest()}>Generate Test</button>
        </div>
        {
          result && (
            <CodeMirror
              theme={draculaInit({
                settings: {
                  caret: '#c6c6c6',
                  fontFamily: 'monospace',
                },
                styles: [
                  { tag: t.comment, color: '#6272a4' },
                ]
              })}
              value={result}
            />
          )
        }
        <div className=' flex  items-end justify-end'>
          <button className=" bg-teal-600 p-2 text-white rounded-md hover:bg-teal-700" onClick={() => download()}>Download</button>
        </div>
      </div>

    </div>
  )
}

export default App

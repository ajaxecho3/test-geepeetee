import { Configuration, OpenAIApi } from 'openai'
import { Fragment, useState } from 'react'
import { saveAs } from 'file-saver';
import CodeMirror from '@uiw/react-codemirror';
import { tags as t } from '@lezer/highlight';
import { draculaInit } from '@uiw/codemirror-theme-dracula';
function App() {
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_KEY
  })

  const openai = new OpenAIApi(configuration)
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<string | undefined>(undefined)
  const [testResult, setTestResult] = useState<string | undefined>(undefined)
  const [isGenerating, setIsGenerating] = useState(false)

  const download = () => {
    let blob = new Blob([`${result}`])
    saveAs(blob, 'text.spec.js')
  }

  async function generateCypressTest() {
    setIsGenerating(true)
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      temperature: 0.7,
      max_tokens: 2086,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      prompt: `
        "### Generate advance javascript Cypress API Test
        ${prompt}
        result:
      `
    })

    if (response.status === 200) {
      setResult(response.data.choices[0].text)
      setIsGenerating(false)
    }
  }

  async function runCypressTest() {



    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      temperature: 0.5,
      max_tokens: 2086,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      prompt: `
        ### Act as cypress CI tool and  Run the following Cypress API Test ###
        ${result}
        output should look like test result
        detailed result :
      `
    })

    if (response.status === 200) {

      https://cdciwv014/datamart/health/ready
      setTestResult(response.data.choices[0].text)
    }

  }

  return (
    <div className=" mx-auto w-3/4 flex flex-col  space-y-3 h-screen ">
      <div className='flex justify-center text-xl font-bold tracking-wide py-6'>
        Cypress API Testing with Open-Ai Text-Davinci-300
      </div>
      <div className='my-48'>

        <div
          className="w-full "
        >
          <form
            className="flex flex-col flex-grow mx-auto my-4 py-3 px-3 relative border border-black/10 bg-white 
        dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md md:max-w-2xl  md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-3xl "
            style={{ boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.3)" }}
          >
            <div className="w-full p-0 m-0 ">
              <textarea
                className="resize-none h-full w-full m-0 overflow-hidden border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 focus:outline-none focus:border-0 dark:bg-transparent md:pl-1 text-base align-top"
                tabIndex={0}
                data-id="root"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                minLength={1}
                spellCheck="false"
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                rows={1}
                style={{
                  minHeight: "1rem",
                  fontSize: "1rem",
                  maxHeight: "10rem",
                  lineHeight: "1.5rem"
                }}
                onInput={(e) => {
                  //shrink/grow on input logic
                  const inputElement = e.target as HTMLInputElement;
                  inputElement.style.height = "auto";
                  inputElement.style.height = `${inputElement.scrollHeight}px`;
                }}
              ></textarea>
            </div>

            <button
              type="button"
              onClick={() => generateCypressTest()}
              className={`
              absolute 
              p-1 
              rounded-md 
              text-white
              bottom-1.5 
              right-1 
              hover:bg-teal-500
               disabled:hover:bg-transparent 
               bg-teal-600
               ${isGenerating ? "loading-icon" : null}`}
              disabled={isGenerating}
            >
              {!isGenerating && (
                <span className='h-4 w-4 mr-1'>
                  Generate Code
                </span>
              )}
            </button>
          </form>
        </div>

        {
          isGenerating ?
            <p>Generating Code....</p>
            :
            <div className=' space-y-2'>
              <div className=' flex justify-center mt-10 w-3/4 mx-auto items-center space-y-2'>

                {
                  result && (
                    <Fragment>
                      <CodeMirror
                        editable={false}
                        width='760px'
                        lang='javascript'
                        className=' rounded-xl'
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


                    </Fragment>

                  )
                }
              </div>
              {
                result && (
                  <Fragment>
                    <div className=' flex  justify-center space-x-2'>
                      <button className=" bg-teal-600 p-2 text-white rounded-md hover:bg-teal-700" onClick={() => download()}>Download</button>
                      <button className=" bg-teal-600 p-2 text-white rounded-md hover:bg-teal-700" onClick={() => runCypressTest()}>Run Code</button>
                    </div>
                    <div className='flex justify-center mt-10 w-3/4 mx-auto items-center space-y-2'>
                      {
                        testResult && (
                          <CodeMirror
                            editable={false}
                            width='760px'
                            basicSetup={{
                              lineNumbers: false

                            }}
                            lang='shell'
                            theme={draculaInit({
                              settings: {
                                caret: '#c6c6c6',
                                fontFamily: 'monospace',
                              },
                              styles: [
                                { tag: t.comment, color: '#6272a4' },
                              ]
                            })}
                            value={testResult}
                          />
                        )
                      }
                    </div>
                  </Fragment>
                )
              }
            </div>
        }

      </div>
    </div>
  )
}

export default App

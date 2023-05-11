import { useState } from 'react'
import githubICO from './assets/github_icon.svg'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://github.com/maddox05" target="_blank" rel="noreferrer">
          <img src={githubICO} className="nocss" width="90px" height="90px" alt="Github Logo" />
        </a>
      </div>
      <h1>My Github Link</h1>
      <div className="nocss">
        <button onClick=
                    {() => setCount((count) => count + 1)}>
          count is {count}
        </button>

      </div>
      <p className="nocss">
        Click on the Github logo to learn more
      </p>
    </>
  )
}

export default App

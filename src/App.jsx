import { useState } from 'react'
import githubICO from './assets/github_icon.svg'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://github.com/maddox05" target="_blank">
          <img src={githubICO} className="logo" width="90px" height="90px" alt="Github Logo" />
        </a>
      </div>
      <h1>Maddox05's Github Link</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

      </div>
      <p className="read-the-docs">
        Click on the Github logo to learn more
      </p>
    </>
  )
}

export default App

import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import CodeEditor from './components/CodeEditor';
import './App.css';

import cppLogo from './assets/cpp.png';
import javaLogo from './assets/java.png';

function App() {
  const [language, setLanguage] = useState("cpp"); // "cpp" for C++, "java" for Java
  const [code, setCode] = useState("// Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(""); // Set output state
  const [selectedLanguage, setSelectedLanguage] = useState("cpp"); // Initialize with "cpp" for default

  const handleButtonClick = (lang) => {
    setLanguage(lang);
    setSelectedLanguage(lang);  // Set the selected language to highlight the button
  };

  const handleRun = async () => {
    try {
      const response = await fetch('http://localhost:3001/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, input })
      });

      const data = await response.json();
      setOutput(data.output); // Set the output from backend
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("Error running code.");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code.${language === "cpp" ? "cpp" : "java"}`;
    document.body.appendChild(element);
    element.click();
  };

  // Adding a resize handler with a timeout to mitigate ResizeObserver loops
  useEffect(() => {
    let resizeTimeout;

    const handleResize = debounce(() => {
      // Adding a timeout before layout recalculations to prevent too many calls
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        console.log('Window resized!');
        // Perform actions based on window size here
      }, 200); // Adjust delay as necessary
    }, 200);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);  // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <div className="App">
      <header className="App-header">
        <h1>REMOTE -IDE </h1>
      </header>

      <div id="display-section">
        <div id="left-section">
          <div id="body-bar">
            <div id="left-button">
              <button
                className={`button ${selectedLanguage === "cpp" ? "selected" : ""}`}
                id="c-btn"
                onClick={() => handleButtonClick("cpp")}
              >
                <img id="logo" src={cppLogo} alt="cpp-logo" />
              </button>
              <button
                className={`button ${selectedLanguage === "java" ? "selected" : ""}`}
                id="java-btn"
                onClick={() => handleButtonClick("java")}
              >
                <img id="logo" src={javaLogo} alt="java-logo" />
              </button>
            </div>

            <div id="right-button">
              <button className="button" id="run-btn" onClick={handleRun}>
                Run
              </button>
              <button className="button" id="download-btn" onClick={handleDownload}>
                Download
              </button>
            </div>
          </div>
          <div id="code-editor">
            <CodeEditor key={language} language={language} code={code} setCode={setCode} />
          </div>
        </div>

        <div id="right-section">
          <div id="display-input">
            <div id="input-text">
              <h1>Input</h1>
            </div>

            <div id="user-input">
              <textarea
                id="input-textArea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "white",
                  height: "100%",
                  width: "100%",
                  resize: "none",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              />
            </div>
          </div>

          <div id="display-output">
            <div id="output-text">
              <h1>Output</h1>
            </div>

            <div id="user-output">
              <textarea
                id="output-textArea"
                value={output}
                readOnly
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "white",
                  height: "100%",
                  width: "100%",
                  resize: "none",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

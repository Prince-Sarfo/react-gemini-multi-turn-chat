import { clear } from "@testing-library/user-event/dist/clear";
import { useState } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([])


  const surpriseOptions = [
    "When is Christmas?",
    "How to invest money?",
    "How to prepare sandwich in England?",
    "How did dinosaurs came into existence?"
  ]

  const surprise = ()=>{
    setValue(()=>{
      return surpriseOptions[Math.floor(Math.random() *surpriseOptions.length)]
    });
  }

  const getResponse = async () =>{
    if(!value){
      setError("Error! please ask a question");
      return
    }

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers:{
          "Content-Type": "application/json"
        }
      }

      const response = await fetch('http://localhost:8000/gemini',options)
      const data = await response.text();
      console.log(data)

      setChatHistory(oldChatHistory => [...oldChatHistory,{
        role:  "user",
        parts: value
      }, 
    {
      role:"model",
      parts: data
    }])
    setValue("")

    } catch (error) {
      console.log(error);
      setError("Something went wrong")
    }


  }

    const clear = ()=>{
      setChatHistory([])
      setValue("")
      setError("")
    }

    

  return (
    <div className="app">
      <div className="search-section">
        <div className="header"><h1>
          React Gemini App</h1></div>
        <p>
          What do you want to search ?
          <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me</button>
        </p>

        <div className="input-container">
          <input
            type="text"
            value={value}
            placeholder="When is Christmas...?"
            onChange={(e)=>setValue(e.target.value)
            }
           />

          {!error && <button onClick={getResponse}>Ask me</button>}
          {error && <button onClick={clear}>Clear</button>}

        </div> 
        {error && <p>{error}</p>}
          <div className="search-results">
           {chatHistory.map((chatItem,_index) => < div key={_index}>
              <p className="answer">{chatItem.role} : {chatItem.parts}</p>
            </div>)}  
          </div>
      </div>
    </div>
  );
};

export default App;

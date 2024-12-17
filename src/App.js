import { useState } from "react";
import { TextField } from "@mui/material";

function App() {
  // fetch data from API
  const api = `https://arx-rconnect.argen-x.com/content/66c7e5fa-58a2-4e98-9573-6ec7282f5d2f/proxy/xarprod/lsaf/api`,
    [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [token, setToken] = useState(""),
    fetchData = async () => {
      const response = await fetch(
        `https://arx-rconnect.argen-x.com/content/66c7e5fa-58a2-4e98-9573-6ec7282f5d2f/proxy/xarprod/lsaf/api/repository/files/general/biostat/macros/_library/titles.sas?component=contents`
      );
      const data = await response.json();
      console.log(data);
    },
    logon = async () => {
      const url = api + "/logon",
        myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Basic " + btoa(username + ":" + password)
      );
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(url, requestOptions)
        .then((response) => {
          const authToken = response.headers.get("x-auth-token");
          console.log("logon - authToken", authToken, "response", response);
          setToken(authToken);
        })
        .catch((error) => console.error(error));
    };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Test</h1>
        <TextField
          size="small"
          label="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <TextField
          size="small"
          label="Password"
          value={password}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button onClick={logon}>Logon</button>
        <p />
        <button onClick={fetchData}>Fetch Data</button>
      </header>
    </div>
  );
}

export default App;

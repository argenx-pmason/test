import { useState, useEffect } from "react";
import { TextField, Box, Button } from "@mui/material";
import {
  encryptPassword,
  logon,
  submitJob,
  upload,
  waitTillJobCompletes,
  getPathManifest,
  getManifest,
  getFileContents,
  getFileVersions,
  getChildren,
  checkout,
  checkin,
  undocheckout,
} from "../../utility";

function App() {
  // fetch data from API
  const { host } = window.location;
  let realhost;
  if (host.includes("sharepoint")) {
    realhost = "xarprod.ondemand.sas.com";
  } else if (host.includes("localhost")) {
    realhost = "xartest.ondemand.sas.com";
  } else {
    realhost = host;
  }
  const api = "https://" + realhost + "/lsaf/api",
    [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [token, setToken] = useState(""),
    [encryptedPassword, setEncryptedPassword] = useState(""),
    [jobResponse, setJobResponse] = useState(null),
    [uploadStatus, setUploadStatus] = useState(null),
    [submissionId, setSubmissionId] = useState(null),
    [manifestPath, setManifestPath] = useState(null),
    [logPath, setLogPath] = useState(null),
    [repositoryPath, setRepositoryPath] = useState(null),
    [progPath, setProgPath] = useState(null),
    [charParm, setCharParm] = useState(null),
    [folderParm, setFolderParm] = useState(null),
    [outputFiles, setOutputFiles] = useState(null),
    [fileContents, setFileContents] = useState(null),
    [versions, setVersions] = useState(null),
    [children, setChildren] = useState(null),
    [jobs, setJobs] = useState(null),
    [checkoutValue, setCheckoutValue] = useState(null),
    [checkinValue, setCheckinValue] = useState(null),
    [undocheckoutValue, setUndocheckoutValue] = useState(null);

  const fileContent = {
    test: 1,
    name: "phil",
    description: "some test data to upload",
    date: new Date().toISOString(),
    x: [1, 2, 3, 4, 5],
  };

  // get default values from local storage
  useEffect(() => {
    const tempUsername = localStorage.getItem("username"),
      tempEncryptedPassword = localStorage.getItem("encryptedPassword");
    setUsername(tempUsername);
    setEncryptedPassword(tempEncryptedPassword);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{api}</h1>
      </header>
      <Box sx={{ backgroundColor: "#ef9a9a", padding: "10px" }}>
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
        <Button
          variant="contained"
          color="success"
          onClick={() =>
            encryptPassword(api, username, password, setEncryptedPassword)
          }
        >
          Encrypt Password if you havent already or if you changed the password
        </Button>
        {encryptedPassword && <p>{encryptedPassword}</p>}
      </Box>
      <Box sx={{ backgroundColor: "#f48fb1", padding: "10px" }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => logon(api, username, encryptedPassword, setToken)}
        >
          Logon with encrypted password & get token
        </Button>
        {token && <p>{token}</p>}
      </Box>
      <Box sx={{ backgroundColor: "#ce93d8", padding: "10px" }}>
        <Button
          variant="contained"
          onClick={async () => {
            const response = await submitJob(
              api,
              "/general/biostat/jobs/utils/dev/jobs/folder_access_request.job",
              token
            );
            console.log("response from submitJob: ", response);
            setJobResponse(response);
            setSubmissionId(response.submissionId);
          }}
        >
          Submit job
        </Button>
        {jobResponse && jobResponse.status && (
          <p>
            <b>Status: </b>
            {jobResponse.status}
          </p>
        )}
        {submissionId && (
          <p>
            <b>submissionId: </b>
            {submissionId}
          </p>
        )}
      </Box>
      <Box sx={{ backgroundColor: "#b39ddb", padding: "10px" }}>
        <Button
          variant="contained"
          onClick={async () => {
            const response = await waitTillJobCompletes(
              api,
              submissionId,
              token
            );
            console.log("response from waitTillJobCompletes: ", response);
            setJobResponse(response);
          }}
        >
          Wait till job completes
        </Button>
        {jobResponse && jobResponse.timeTaken && (
          <p>
            <b>timeTaken: </b>
            {jobResponse.timeTaken}
          </p>
        )}
      </Box>
      <Box sx={{ backgroundColor: "#9fa8da", padding: "10px" }}>
        <Button
          variant="contained"
          onClick={async () => {
            const response = await getPathManifest(api, submissionId, token);
            console.log("response from getPathManifest: ", response);
            setManifestPath(response);
          }}
        >
          Get path manifest
        </Button>
        {manifestPath && (
          <p>
            <b>manifestPath: </b>
            {manifestPath}
          </p>
        )}
      </Box>
      <Box sx={{ backgroundColor: "#90caf9", padding: "10px" }}>
        <Button
          variant="contained"
          onClick={async () => {
            const response = await getManifest(api, token, manifestPath);
            console.log("response from getManifest: ", response);
            setLogPath(response.log_path);
            setRepositoryPath(response.repository_path);
            setProgPath(response.prog_path);
            setCharParm(response.char_parm);
            setFolderParm(response.folder_parm);
            setOutputFiles(response.output_files.map((o) => "🔴" + o));
          }}
        >
          Get manifest
        </Button>
        {logPath && (
          <Box>
            <p>
              <b>logPath: </b>
              {logPath}
            </p>
            <p>
              <b>repositoryPath: </b>
              {repositoryPath}
            </p>
            <p>
              <b>progPath: </b>
              {progPath}
            </p>
            <p>
              <b>charParm: </b>
              {charParm}
            </p>
            <p>
              <b>folderParm: </b>
              {folderParm}
            </p>
            <p>
              <b>outputFiles: </b>
              {outputFiles}
            </p>
          </Box>
        )}
      </Box>
      <Box sx={{ backgroundColor: "#81d4fa", padding: "10px" }}>
        <Button
          variant="contained"
          color="warning"
          onClick={async () => {
            const response = await upload(
              api,
              "/general/biostat/apps/test/test.json",
              fileContent,
              token
            );
            console.log("response from upload: ", response);
            setUploadStatus(response);
          }}
        >
          Upload a file
        </Button>
        {uploadStatus && (
          <p>
            <b>status: </b>
            {uploadStatus}
          </p>
        )}
      </Box>
      <Box sx={{ backgroundColor: "#80deea", padding: "10px" }}>
        <Button
          variant="contained"
          color="warning"
          onClick={async () => {
            const response = await getFileContents(
              api,
              token,
              "/general/biostat/apps/test/test.json"
            );
            console.log("response from getFileContents: ", response);
            setFileContents(response);
          }}
        >
          Get the contents of a file
        </Button>
        {fileContents && (
          <p>
            <b>fileContents: </b>
            {fileContents.toString()}
          </p>
        )}
      </Box>
      <Box sx={{ backgroundColor: "#80cbc4", padding: "10px" }}>
        <Button
          variant="contained"
          color="warning"
          onClick={async () => {
            const response = await getFileVersions(
                api,
                token,
                "/general/biostat/macros/_library/filecheckwithrules.sas"
              ),
              text = response.items.map(
                (i) =>
                  "🟧" + i.version + " - " + i.createdBy + " - " + i?.comment
              );
            console.log("response from getVersions: ", response);
            setVersions(text);
          }}
        >
          Get the versions of a file
        </Button>
        {versions && (
          <p>
            <b>versions: </b>
            {versions}
          </p>
        )}
      </Box>
      <Box sx={{ backgroundColor: "#a5d6a7", padding: "10px" }}>
        <Button
          variant="contained"
          color="warning"
          onClick={async () => {
            const response = await getChildren(
                api,
                token,
                "/general/biostat/apps"
              ),
              text = response.items.map((i) => "🟡" + i?.path);
            console.log("response from getChildren: ", response);
            setChildren(text);
          }}
        >
          Get children for a path
        </Button>
        {children && (
          <p>
            <b>children: </b>
            {children}
          </p>
        )}
      </Box>
      <Box sx={{ backgroundColor: "#c5e1a5", padding: "10px" }}>
        <Button
          variant="contained"
          color="warning"
          onClick={async () => {
            const response = await getChildren(
                api,
                token,
                "/general/biostat/jobs/utils/dev/jobs"
              ),
              text = response.items
                .filter((i) => i?.path.endsWith(".job"))
                .map((i) => "🟩" + i?.path);
            console.log("jobs found from getChildren: ", response);
            setJobs(text);
          }}
        >
          Get jobs for a path
        </Button>
        {jobs && (
          <p>
            <b>jobs: </b>
            {jobs}
          </p>
        )}
      </Box>
      <Box sx={{ backgroundColor: "#e6ee9c", padding: "10px" }}>
        <Button
          variant="contained"
          color="warning"
          onClick={async () => {
            const response = await checkout(
              api,
              token,
              "/general/biostat/jobs/utils/dev/jobs/backups.job"
            );
            console.log("checkout: ", response);
            setCheckoutValue(response?.status?.type);
          }}
        >
          Checkout backups.job
        </Button>
        {checkoutValue && (
          <p>
            <b>checkout: </b>
            {checkoutValue}
          </p>
        )}
      </Box>
      <Box sx={{ backgroundColor: "#fff59d", padding: "10px" }}>
        <Button
          variant="contained"
          color="warning"
          onClick={async () => {
            const response = await checkin(
              api,
              token,
              "/general/biostat/jobs/utils/dev/jobs/backups.job"
            );
            console.log("checkin: ", response);
            setCheckinValue(response?.status?.type);
          }}
        >
          Checkin backups.job
        </Button>
        {checkinValue && (
          <p>
            <b>checkin: </b>
            {checkinValue}
          </p>
        )}
      </Box>
      <Box sx={{ backgroundColor: "#ffe082", padding: "10px" }}>
        <Button
          variant="contained"
          color="warning"
          onClick={async () => {
            const response = await undocheckout(
              api,
              token,
              "/general/biostat/jobs/utils/dev/jobs/backups.job"
            );
            console.log("undocheckout: ", response);
            setUndocheckoutValue(response?.status?.type);
          }}
        >
          Undo checkout backups.job
        </Button>
        {undocheckoutValue && (
          <p>
            <b>undocheckout: </b>
            {undocheckoutValue}
          </p>
        )}
      </Box>
      {/*🟪🟤⬛⚪ ,#,#,#ffcc80,#ffab91,#bcaaa4,#eeeeee */}
    </div>
  );
}

export default App;

import PapaParse from "papaparse";

import { Grid } from "@githubocto/flat-ui";
import { useEffect, useState } from "react";

export const urlWith = (queryParams) => {
  const hash = window.location.hash.split("?")[0];
  const newUrl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    hash +
    "?" +
    queryParams.toString();
  return newUrl;
};

function App() {
  let queryParams = new URLSearchParams(window.location.href.split("?")[1]);
  const [urlData, setUrlData] = useState(
    queryParams.get("csv") ||
      "https://gist.githubusercontent.com/mestachs/61cd852828898380b7984bc0fde1d533/raw/de583a974686b2092b55214eec234990d43c4407/data.csv"
  );
  const [data, setData] = useState();
  useEffect(() => {
    fetch(urlData)
      .then((r) => r.text())
      .then((csvTxt) => {
        const parsedData = PapaParse.parse(csvTxt, {
          header: true,
          skipEmptyLines: true,
        });
        const meta = {};
        parsedData.meta.fields.forEach((f) => (meta[f] = f));
        parsedData.metadata = meta;
        parsedData.data = parsedData.data.map((r, index) => {
          return {
            index: index,
            ...r,
          };
        });

        setData(parsedData);
      });
  }, [urlData]);
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",

        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 16,
          marginBottom: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <input
          value={urlData}
          onChange={(e) => {
            setUrlData(e.target.value);
            queryParams.set("csv", e.target.value);
            window.history.replaceState({}, "", urlWith(queryParams));
          }}
        />
      </div>
      <div style={{ flex: "1 1 0%", overflow: "hidden" }}>
        {data && <Grid defaultSort={["index"]} data={data.data} />}
      </div>
    </div>
  );
}

export default App;

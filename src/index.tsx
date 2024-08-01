import React from ***REMOVED***react***REMOVED***
import ReactDOM from ***REMOVED***react-dom/client***REMOVED***
import ***REMOVED***./index.css***REMOVED***
import App from ***REMOVED***./App***REMOVED***
import reportWebVitals from ***REMOVED***./reportWebVitals***REMOVED***

const root = ReactDOM.createRoot(
  document.getElementById(***REMOVED***root***REMOVED***) as HTMLElement
)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals().then(() => { }).catch(e => { console.log(e) })

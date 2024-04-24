import { type ReportHandler } from ***REMOVED***web-vitals***REMOVED***

const reportWebVitals = async (onPerfEntry?: ReportHandler): Promise<void> => {
  if ((onPerfEntry != null) && onPerfEntry instanceof Function) {
    await import(***REMOVED***web-vitals***REMOVED***).then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry)
      getFID(onPerfEntry)
      getFCP(onPerfEntry)
      getLCP(onPerfEntry)
      getTTFB(onPerfEntry)
    })
  }
}

export default reportWebVitals

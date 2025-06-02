import { Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { ThickArrowLeftIcon, ThickArrowRightIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const ResizableSidebar = (): ReactElement => {
  const [open, setOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(500)
  return (
    <>
    {
        !open
          ? <Tooltip content=***REMOVED***Open Sidebar***REMOVED*** className=***REMOVED***fixed top-4 right-4***REMOVED***><ThickArrowLeftIcon className=***REMOVED***cursor-pointer w-12 h-12***REMOVED*** onClick={() => { setOpen(true) }} /></Tooltip>
          : ***REMOVED******REMOVED***
    }
    {
        open
          ? <div className=***REMOVED***bg-blue-500 h-full fixed top-0 right-0 z-50 p-4 shadow-lg***REMOVED*** style={{ width: `${sidebarWidth}px` }}>
            <div
                className=***REMOVED***absolute top-0 left-0 h-full bg-blue-600 cursor-ew-resize***REMOVED***
                style={{ width: ***REMOVED***5px***REMOVED*** }}
                onMouseDown={(e) => {
                  const startX = e.clientX
                  const startWidth = sidebarWidth

                  const onMouseMove = (event: MouseEvent): void => {
                    const newWidth = Math.max(200, startWidth - (event.clientX - startX))
                    setSidebarWidth(newWidth)
                    document.body.classList.add(***REMOVED***cursor-ew-resize***REMOVED***)
                  }

                  const onMouseUp = (): void => {
                    document.removeEventListener(***REMOVED***mousemove***REMOVED***, onMouseMove)
                    document.removeEventListener(***REMOVED***mouseup***REMOVED***, onMouseUp)
                    document.body.classList.remove(***REMOVED***cursor-ew-resize***REMOVED***)
                  }

                  document.addEventListener(***REMOVED***mousemove***REMOVED***, onMouseMove)
                  document.addEventListener(***REMOVED***mouseup***REMOVED***, onMouseUp)
                }}
            />
            <ThickArrowRightIcon
                className=***REMOVED***cursor-pointer w-12 h-12 absolute top-4 left-4***REMOVED***
                onClick={() => {
                  setOpen(false)
                }}
            />
        </div>
          : ***REMOVED******REMOVED***
    }
        <div className=***REMOVED***h-full bg-rose-500 w-full***REMOVED***>

        </div>
    </>
  )
}

export default ResizableSidebar

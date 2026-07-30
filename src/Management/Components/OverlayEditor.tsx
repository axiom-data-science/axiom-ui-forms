import React, { type ReactElement, type ReactNode, useState } from 'react'
import { Tooltip } from '@axdspub/axiom-ui-utilities'
import { Cross2Icon, DragHandleDots2Icon, Pencil2Icon } from '@radix-ui/react-icons'

const fixOverlayWidth = (width: number): number => {
  const maxWidth = window.innerWidth - window.innerWidth * 0.05
  return Math.max(420, Math.min(width, maxWidth))
}

const OverlayEditor = ({ children }: { children: ReactNode }): ReactElement => {
  const [editing, setEditing] = useState<boolean>(false)
  const [sidebarWidth, setSidebarWidth] = useState<number>(Math.max(420, window.innerWidth * 0.45))

  return (
    <>
      {!editing ? (
        <Tooltip
          content="Edit schema, preview, and JSON"
          side="left"
          className="bg-white bg-opacity-50 hover:bg-opacity-100 text-black p-2 rounded-md top-10 right-10 fixed z-10 shadow-lg"
          useSpan={true}
        >
          <Pencil2Icon
            className="cursor-pointer w-6 h-6"
            onClick={() => {
              setEditing(true)
            }}
          />
        </Tooltip>
      ) : (
        ''
      )}

      {!editing ? (
        ''
      ) : (
        <div
          className="fixed bottom-0 right-0 h-full bg-white shadow-2xl z-50 flex flex-row"
          style={{ width: `${fixOverlayWidth(sidebarWidth)}px` }}
        >
          <Cross2Icon
            className="cursor-pointer w-6 h-6 absolute top-4 left-8"
            onClick={() => {
              setEditing(false)
            }}
          />
          <div
            className="w-4 cursor-ew-resize h-full bg-slate-100 px-1 shadow-md flex flex-col items-center justify-center"
            onMouseDown={(e) => {
              const startX = e.clientX
              const startWidth = sidebarWidth

              const onMouseMove = (event: MouseEvent): void => {
                const newWidth = startWidth - (event.clientX - startX)
                setSidebarWidth(fixOverlayWidth(newWidth))
                document.body.classList.add('cursor-ew-resize')
                document.body.classList.add('select-none')
                event.preventDefault()
                event.stopPropagation()
              }

              const onMouseUp = (): void => {
                document.removeEventListener('mousemove', onMouseMove)
                document.removeEventListener('mouseup', onMouseUp)
                document.body.classList.remove('cursor-ew-resize')
                document.body.classList.remove('select-none')
              }

              document.addEventListener('mousemove', onMouseMove)
              document.addEventListener('mouseup', onMouseUp)
            }}
          >
            <DragHandleDots2Icon />
            <DragHandleDots2Icon className="-mt-1" />
            <DragHandleDots2Icon className="-mt-1" />
          </div>
          {children}
        </div>
      )}
    </>
  )
}

export default OverlayEditor

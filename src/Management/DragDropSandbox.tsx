import React, { type DragEvent, type ReactElement, useState } from ***REMOVED***react***REMOVED***

type ISandboxSection = {
  id: string
  label: string
  fields: string[]
}

type IDragSource = {
  sectionId: string
  index: number
}

type IDropTarget = {
  sectionId: string
  index: number
}

const initialSections: ISandboxSection[] = [
  {
    id: ***REMOVED***section-a***REMOVED***,
    label: ***REMOVED***Section A***REMOVED***,
    fields: [***REMOVED***first_name***REMOVED***, ***REMOVED***last_name***REMOVED***, ***REMOVED***description***REMOVED***],
  },
  {
    id: ***REMOVED***section-b***REMOVED***,
    label: ***REMOVED***Section B***REMOVED***,
    fields: [***REMOVED***color***REMOVED***, ***REMOVED***choice***REMOVED***, ***REMOVED***count***REMOVED***],
  },
]

const moveField = (
  sections: ISandboxSection[],
  source: IDragSource,
  target: IDropTarget
): ISandboxSection[] => {
  if (source.sectionId === target.sectionId && source.index === target.index) {
    return sections
  }

  const next = sections.map((section) => ({ ...section, fields: section.fields.slice() }))

  const sourceSection = next.find((section) => section.id === source.sectionId)
  const targetSection = next.find((section) => section.id === target.sectionId)

  if (sourceSection === undefined || targetSection === undefined) {
    return sections
  }

  const [moved] = sourceSection.fields.splice(source.index, 1)
  if (moved === undefined) {
    return sections
  }

  const clamped = Math.max(0, Math.min(target.index, targetSection.fields.length))
  targetSection.fields.splice(clamped, 0, moved)

  return next
}

const DragDropSandbox = (): ReactElement => {
  const [sections, setSections] = useState<ISandboxSection[]>(initialSections)
  const [dragSource, setDragSource] = useState<IDragSource | undefined>(undefined)
  const [dropTarget, setDropTarget] = useState<IDropTarget | undefined>(undefined)

  const clearDrag = (): void => {
    setDragSource(undefined)
    setDropTarget(undefined)
  }

  const readDragSource = (event: DragEvent<HTMLElement>): IDragSource | undefined => {
    if (dragSource !== undefined) return dragSource

    const raw = event.dataTransfer.getData(***REMOVED***text/plain***REMOVED***)
    try {
      const parsed = JSON.parse(raw) as IDragSource
      if (typeof parsed.sectionId === ***REMOVED***string***REMOVED*** && typeof parsed.index === ***REMOVED***number***REMOVED***) {
        return parsed
      }
    } catch {
      return undefined
    }

    return undefined
  }

  const handleDropToIndex = (target: IDropTarget, event: DragEvent<HTMLElement>): void => {
    event.preventDefault()
    event.stopPropagation()

    const source = readDragSource(event)
    if (source === undefined) {
      clearDrag()
      return
    }

    setSections((prev) => moveField(prev, source, target))
    clearDrag()
  }

  const handleDragOverIndex = (target: IDropTarget, event: DragEvent<HTMLElement>): void => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = ***REMOVED***move***REMOVED***
    setDropTarget(target)
  }

  return (
    <div className="border rounded p-3 bg-slate-50 flex flex-col gap-3">
      <div>
        <h3 className="font-semibold">Drag/Drop Sandbox</h3>
        <p className="text-xs text-slate-600">
          Minimal test: drag any field between sections, reorder within a section, and drop at the end.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sections.map((section) => (
          <div key={section.id} className="border rounded bg-white p-2 flex flex-col gap-2">
            <div className="text-sm font-semibold">{section.label}</div>

            {section.fields.map((field, index) => {
              const beforeActive =
                dropTarget?.sectionId === section.id && dropTarget.index === index

              return (
                <div key={`${section.id}-${field}-${index}`} className="flex flex-col gap-1">
                  <div
                    className={`h-2 rounded ${beforeActive ? ***REMOVED***bg-emerald-400***REMOVED*** : ***REMOVED***bg-slate-200***REMOVED***}`}
                    onDragOver={(event) => {
                      handleDragOverIndex({ sectionId: section.id, index }, event)
                    }}
                    onDrop={(event) => {
                      handleDropToIndex({ sectionId: section.id, index }, event)
                    }}
                  />

                  <div
                    className="border rounded px-2 py-1.5 bg-sky-50 border-sky-200 text-sm cursor-grab"
                    draggable={true}
                    onDragStart={(event) => {
                      const source: IDragSource = { sectionId: section.id, index }
                      setDragSource(source)
                      event.dataTransfer.effectAllowed = ***REMOVED***move***REMOVED***
                      event.dataTransfer.setData(***REMOVED***text/plain***REMOVED***, JSON.stringify(source))
                    }}
                    onDragEnd={() => {
                      clearDrag()
                    }}
                  >
                    {field}
                  </div>
                </div>
              )
            })}

            <div
              className={`h-2 rounded ${dropTarget?.sectionId === section.id && dropTarget.index === section.fields.length ? ***REMOVED***bg-emerald-400***REMOVED*** : ***REMOVED***bg-slate-200***REMOVED***}`}
              onDragOver={(event) => {
                handleDragOverIndex({ sectionId: section.id, index: section.fields.length }, event)
              }}
              onDrop={(event) => {
                handleDropToIndex({ sectionId: section.id, index: section.fields.length }, event)
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DragDropSandbox

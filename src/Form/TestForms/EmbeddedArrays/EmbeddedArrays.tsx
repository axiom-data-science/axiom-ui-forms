import { IForm, IFormFieldOverride, IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import SchemaFormWithEditorOverlay, { FormWithEditorOverlay } from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import formAtom from ***REMOVED***@/state/formAtom***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { Button } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***

const form: IForm = {
  id: ***REMOVED***embedded-arrays***REMOVED***,
  label: ***REMOVED***Embedded Arrays***REMOVED***,
  fields: [
    {
      id: ***REMOVED***topLevel***REMOVED***,
      type: ***REMOVED***object***REMOVED***,
      multiple: true,
      label: ***REMOVED***Top Level***REMOVED***,
      fields: [
        {
          id: ***REMOVED***name***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          label: ***REMOVED***Name***REMOVED***,
        },
        {
          id: ***REMOVED***nestedArray***REMOVED***,
          type: ***REMOVED***object***REMOVED***,
          multiple: true,
          label: ***REMOVED***Nested Array***REMOVED***,
          fields: [
            {
              id: ***REMOVED***thing***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***Thing***REMOVED***,
            },
          ],
        },
      ],
    },
  ],
}

export const EmbeddedArraysForm = (): ReactElement => {
  const [, setForm] = useAtom(formAtom)
  return <FormWithEditorOverlay formState={[form, setForm]} />
}

const schema: JSONSchema6 = {
  type: ***REMOVED***object***REMOVED***,
  properties: {
    topLevel: {
      type: ***REMOVED***array***REMOVED***,
      items: {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          name: { type: ***REMOVED***string***REMOVED*** },
          nestedArray: {
            type: ***REMOVED***array***REMOVED***,
            items: {
              type: ***REMOVED***object***REMOVED***,
              properties: {
                thing: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***A thing!***REMOVED*** },
                other: { type: ***REMOVED***string***REMOVED*** },
              },
            },
          },
        },
      },
    },
  },
}

const formOverrideWorks: IFormOverride = {
  id: ***REMOVED***embedded-arrays***REMOVED***,
  label: ***REMOVED***Embedded Arrays***REMOVED***,
  fields: [
    {
      prop: ***REMOVED***topLevel***REMOVED***,
      label: ***REMOVED***Wrap***REMOVED***,
      multiple: true,
      fields: [
        { prop: ***REMOVED***topLevel[].name***REMOVED*** },
        {
          prop: ***REMOVED***topLevel[].nestedArray***REMOVED***,
          layout: ***REMOVED***grid2***REMOVED***,
          label: ***REMOVED***Nested Array Wrapper***REMOVED***,
        },
      ],
    },
  ],
}

const formOverride: IFormOverride = {
  id: ***REMOVED***embedded-arrays***REMOVED***,
  label: ***REMOVED***Embedded Arrays***REMOVED***,
  pages: [
    {
      id: ***REMOVED***page1***REMOVED***,
      label: ***REMOVED***Page 1***REMOVED***,
      tabs: [
        {
          id: ***REMOVED***tab1***REMOVED***,
          label: ***REMOVED***Tab 1***REMOVED***,
          fields: [
            {
              prop: ***REMOVED***topLevel***REMOVED***,
              label: ***REMOVED***Wrap***REMOVED***,
              type: ***REMOVED***object***REMOVED***,
              multiple: true,
              tabs: [
                {
                  id: ***REMOVED***overviewTab***REMOVED***,
                  label: ***REMOVED***Overview***REMOVED***,
                  fields: [
                    {
                      id: ***REMOVED***nameWrapper***REMOVED***,
                      type: ***REMOVED***objectWrapper***REMOVED***,
                      label: ***REMOVED***Name Wrapper***REMOVED***,
                      fields: [{ prop: ***REMOVED***name***REMOVED*** }],
                    },
                  ],
                },
                {
                  id: ***REMOVED***nestedArrayTab***REMOVED***,
                  label: ***REMOVED***Nested Array***REMOVED***,
                  fields: [
                    {
                      multiple: true,
                      prop: ***REMOVED***nestedArray***REMOVED***,
                      type: ***REMOVED***object***REMOVED***,
                      fields: [
                        {
                          id: ***REMOVED***nestedArrayWrapper***REMOVED***,
                          type: ***REMOVED***objectWrapper***REMOVED***,
                          label: ***REMOVED***Arbitrary Wrapper***REMOVED***,
                          layout: ***REMOVED***grid2***REMOVED***,
                          fields: [{ prop: ***REMOVED***thing***REMOVED*** }, { prop: ***REMOVED***other***REMOVED*** }],
                        },
                      ],
                    },
                    {
                      // Keep one sibling fully-qualified to mimic mixed path usage in COLLAB.
                      prop: ***REMOVED***topLevel[].name***REMOVED***,
                      label: ***REMOVED***Name (full path sibling)***REMOVED***,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const formOverrideRelativeOnly: IFormOverride = {
  id: ***REMOVED***embedded-arrays***REMOVED***,
  label: ***REMOVED***Embedded Arrays***REMOVED***,
  pages: [
    {
      id: ***REMOVED***page1***REMOVED***,
      label: ***REMOVED***Page 1***REMOVED***,
      tabs: [
        {
          id: ***REMOVED***tab1***REMOVED***,
          label: ***REMOVED***Tab 1***REMOVED***,
          fields: [
            {
              prop: ***REMOVED***topLevel***REMOVED***,
              label: ***REMOVED***Wrap***REMOVED***,
              type: ***REMOVED***object***REMOVED***,
              multiple: true,
              tabs: [
                {
                  id: ***REMOVED***overviewTab***REMOVED***,
                  label: ***REMOVED***Overview***REMOVED***,
                  fields: [
                    {
                      id: ***REMOVED***nameWrapper***REMOVED***,
                      type: ***REMOVED***objectWrapper***REMOVED***,
                      label: ***REMOVED***Name Wrapper***REMOVED***,
                      fields: [{ prop: ***REMOVED***name***REMOVED*** }],
                    },
                  ],
                },
                {
                  id: ***REMOVED***nestedArrayTab***REMOVED***,
                  label: ***REMOVED***Nested Array***REMOVED***,
                  fields: [
                    {
                      multiple: true,
                      prop: ***REMOVED***nestedArray***REMOVED***,
                      type: ***REMOVED***object***REMOVED***,
                      fields: [
                        {
                          id: ***REMOVED***nestedArrayWrapper***REMOVED***,
                          type: ***REMOVED***objectWrapper***REMOVED***,
                          label: ***REMOVED***Arbitrary Wrapper***REMOVED***,
                          layout: ***REMOVED***grid2***REMOVED***,
                          fields: [{ prop: ***REMOVED***thing***REMOVED*** }, { prop: ***REMOVED***other***REMOVED*** }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const formOverrideFullyQualifiedOnly: IFormOverride = {
  id: ***REMOVED***embedded-arrays***REMOVED***,
  label: ***REMOVED***Embedded Arrays***REMOVED***,
  pages: [
    {
      id: ***REMOVED***page1***REMOVED***,
      label: ***REMOVED***Page 1***REMOVED***,
      tabs: [
        {
          id: ***REMOVED***tab1***REMOVED***,
          label: ***REMOVED***Tab 1***REMOVED***,
          fields: [
            {
              prop: ***REMOVED***topLevel***REMOVED***,
              label: ***REMOVED***Wrap***REMOVED***,
              type: ***REMOVED***object***REMOVED***,
              multiple: true,
              tabs: [
                {
                  id: ***REMOVED***overviewTab***REMOVED***,
                  label: ***REMOVED***Overview***REMOVED***,
                  fields: [
                    {
                      id: ***REMOVED***nameWrapper***REMOVED***,
                      type: ***REMOVED***objectWrapper***REMOVED***,
                      label: ***REMOVED***Name Wrapper***REMOVED***,
                      fields: [{ prop: ***REMOVED***topLevel[].name***REMOVED*** }],
                    },
                  ],
                },
                {
                  id: ***REMOVED***nestedArrayTab***REMOVED***,
                  label: ***REMOVED***Nested Array***REMOVED***,
                  fields: [
                    {
                      multiple: true,
                      prop: ***REMOVED***topLevel[].nestedArray***REMOVED***,
                      type: ***REMOVED***object***REMOVED***,
                      fields: [
                        {
                          id: ***REMOVED***nestedArrayWrapper***REMOVED***,
                          type: ***REMOVED***objectWrapper***REMOVED***,
                          label: ***REMOVED***Arbitrary Wrapper***REMOVED***,
                          layout: ***REMOVED***grid2***REMOVED***,
                          fields: [
                            { prop: ***REMOVED***topLevel[].nestedArray[].thing***REMOVED*** },
                            { prop: ***REMOVED***topLevel[].nestedArray[].other***REMOVED*** },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const knownFailingSample = {
  scenario: ***REMOVED***Mixed/over-qualified nested array props can create literal keys and drop nested payload values***REMOVED***,
  badFormValuesShape: {
    topLevel: [
      {
        name: ***REMOVED***Station A***REMOVED***,
        nestedArray: [{ thing: ***REMOVED***T1***REMOVED***, other: ***REMOVED***O1***REMOVED*** }],
        ***REMOVED***topLevel[].nestedArray***REMOVED***: [{ thing: ***REMOVED***T1***REMOVED***, other: ***REMOVED***O1***REMOVED*** }],
      },
    ],
  },
  badPayloadShape: {
    topLevel: [{ name: ***REMOVED***Station A***REMOVED*** }],
  },
  expectedPayloadShape: {
    topLevel: [{ name: ***REMOVED***Station A***REMOVED***, nestedArray: [{ thing: ***REMOVED***T1***REMOVED***, other: ***REMOVED***O1***REMOVED*** }] }],
  },
}

export const EmbeddedArraysFromSchemaWithOverrides = (): ReactElement => {
  const formOverrideState = useState<IFormOverride | undefined>(formOverride)
  const schemaState = useState<JSONSchema6 | undefined>(schema)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const [formValues, setFormValues] = useAtom(formValuesAtom)

  const [activeOverride, setActiveOverride] = useState<***REMOVED***mixed***REMOVED*** | ***REMOVED***relative***REMOVED*** | ***REMOVED***qualified***REMOVED***>(***REMOVED***mixed***REMOVED***)

  const setOverrideMode = (mode: ***REMOVED***mixed***REMOVED*** | ***REMOVED***relative***REMOVED*** | ***REMOVED***qualified***REMOVED***): void => {
    setFormValues({})
    setActiveOverride(mode)
    if (mode === ***REMOVED***mixed***REMOVED***) {
      formOverrideState[1](formOverride)
      return
    }
    if (mode === ***REMOVED***relative***REMOVED***) {
      formOverrideState[1](formOverrideRelativeOnly)
      return
    }
    formOverrideState[1](formOverrideFullyQualifiedOnly)
  }

  return (
    <>
      <Button
        type="alert"
        size="xs"
        className="mt-4 ml-4"
        onClick={() => {
          setFormValues({})
        }}
      >
        Reset Form Values
      </Button>
      <Button
        type={activeOverride === ***REMOVED***mixed***REMOVED*** ? ***REMOVED***default***REMOVED*** : ***REMOVED***secondary***REMOVED***}
        size="xs"
        className="mt-4 ml-2"
        onClick={() => setOverrideMode(***REMOVED***mixed***REMOVED***)}
      >
        Mixed Paths
      </Button>
      <Button
        type={activeOverride === ***REMOVED***relative***REMOVED*** ? ***REMOVED***default***REMOVED*** : ***REMOVED***secondary***REMOVED***}
        size="xs"
        className="mt-4 ml-2"
        onClick={() => setOverrideMode(***REMOVED***relative***REMOVED***)}
      >
        Relative Only
      </Button>
      <Button
        type={activeOverride === ***REMOVED***qualified***REMOVED*** ? ***REMOVED***default***REMOVED*** : ***REMOVED***secondary***REMOVED***}
        size="xs"
        className="mt-4 ml-2"
        onClick={() => setOverrideMode(***REMOVED***qualified***REMOVED***)}
      >
        Fully Qualified Only
      </Button>
      <SchemaFormWithEditorOverlay
        label="Embedded Arrays from schema with overrides"
        formOverrideState={formOverrideState}
        schemaState={schemaState}
        fieldOverrideState={fieldOverrideState}
        formValueState={[formValues, setFormValues]}
      />
      <div className="px-4 py-3 text-sm">
        <div className="font-semibold">Known failing sample (for regression checks)</div>
        <pre className="mt-2 overflow-x-auto rounded bg-slate-100 p-3 text-xs">
          {JSON.stringify(knownFailingSample, null, 2)}
        </pre>
      </div>
    </>
  )
}

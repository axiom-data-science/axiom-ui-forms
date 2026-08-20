import { IForm, IFormFieldOverride, IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import SchemaFormWithEditorOverlay, { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'
import formAtom from '@/state/formAtom'
import formValuesAtom from '@/state/formValuesAtom'
import { Button } from '@axdspub/axiom-ui-utilities'
import { useAtom } from 'jotai'
import { JSONSchema6 } from 'json-schema'
import { ReactElement, useState } from 'react'

const form: IForm = {
  id: 'embedded-arrays',
  label: 'Embedded Arrays',
  fields: [
    {
      id: 'topLevel',
      type: 'object',
      multiple: true,
      label: 'Top Level',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
        },
        {
          id: 'nestedArray',
          type: 'object',
          multiple: true,
          label: 'Nested Array',
          fields: [
            {
              id: 'thing',
              type: 'text',
              label: 'Thing',
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
  type: 'object',
  properties: {
    topLevel: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          nestedArray: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                thing: { type: 'string', title: 'A thing!' },
                other: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
}

const formOverrideWorks: IFormOverride = {
  id: 'embedded-arrays',
  label: 'Embedded Arrays',
  fields: [
    {
      prop: 'topLevel',
      label: 'Wrap',
      multiple: true,
      fields: [
        { prop: 'topLevel[].name' },
        {
          prop: 'topLevel[].nestedArray',
          layout: 'grid2',
          label: 'Nested Array Wrapper',
        },
      ],
    },
  ],
}

const formOverride: IFormOverride = {
  id: 'embedded-arrays',
  label: 'Embedded Arrays',
  pages: [
    {
      id: 'page1',
      label: 'Page 1',
      tabs: [
        {
          id: 'tab1',
          label: 'Tab 1',
          fields: [
            {
              prop: 'topLevel',
              label: 'Wrap',
              type: 'object',
              multiple: true,
              tabs: [
                {
                  id: 'overviewTab',
                  label: 'Overview',
                  fields: [
                    {
                      id: 'nameWrapper',
                      type: 'objectWrapper',
                      label: 'Name Wrapper',
                      fields: [{ prop: 'name' }],
                    },
                  ],
                },
                {
                  id: 'nestedArrayTab',
                  label: 'Nested Array',
                  fields: [
                    {
                      multiple: true,
                      prop: 'nestedArray',
                      type: 'object',
                      fields: [
                        {
                          id: 'nestedArrayWrapper',
                          type: 'objectWrapper',
                          label: 'Arbitrary Wrapper',
                          layout: 'grid2',
                          fields: [{ prop: 'thing' }, { prop: 'other' }],
                        },
                      ],
                    },
                    {
                      // Keep one sibling fully-qualified to mimic mixed path usage in COLLAB.
                      prop: 'topLevel[].name',
                      label: 'Name (full path sibling)',
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
  id: 'embedded-arrays',
  label: 'Embedded Arrays',
  pages: [
    {
      id: 'page1',
      label: 'Page 1',
      tabs: [
        {
          id: 'tab1',
          label: 'Tab 1',
          fields: [
            {
              prop: 'topLevel',
              label: 'Wrap',
              type: 'object',
              multiple: true,
              tabs: [
                {
                  id: 'overviewTab',
                  label: 'Overview',
                  fields: [
                    {
                      id: 'nameWrapper',
                      type: 'objectWrapper',
                      label: 'Name Wrapper',
                      fields: [{ prop: 'name' }],
                    },
                  ],
                },
                {
                  id: 'nestedArrayTab',
                  label: 'Nested Array',
                  fields: [
                    {
                      multiple: true,
                      prop: 'nestedArray',
                      type: 'object',
                      fields: [
                        {
                          id: 'nestedArrayWrapper',
                          type: 'objectWrapper',
                          label: 'Arbitrary Wrapper',
                          layout: 'grid2',
                          fields: [{ prop: 'thing' }, { prop: 'other' }],
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
  id: 'embedded-arrays',
  label: 'Embedded Arrays',
  pages: [
    {
      id: 'page1',
      label: 'Page 1',
      tabs: [
        {
          id: 'tab1',
          label: 'Tab 1',
          fields: [
            {
              prop: 'topLevel',
              label: 'Wrap',
              type: 'object',
              multiple: true,
              tabs: [
                {
                  id: 'overviewTab',
                  label: 'Overview',
                  fields: [
                    {
                      id: 'nameWrapper',
                      type: 'objectWrapper',
                      label: 'Name Wrapper',
                      fields: [{ prop: 'topLevel[].name' }],
                    },
                  ],
                },
                {
                  id: 'nestedArrayTab',
                  label: 'Nested Array',
                  fields: [
                    {
                      multiple: true,
                      prop: 'topLevel[].nestedArray',
                      type: 'object',
                      fields: [
                        {
                          id: 'nestedArrayWrapper',
                          type: 'objectWrapper',
                          label: 'Arbitrary Wrapper',
                          layout: 'grid2',
                          fields: [
                            { prop: 'topLevel[].nestedArray[].thing' },
                            { prop: 'topLevel[].nestedArray[].other' },
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
  scenario: 'Mixed/over-qualified nested array props can create literal keys and drop nested payload values',
  badFormValuesShape: {
    topLevel: [
      {
        name: 'Station A',
        nestedArray: [{ thing: 'T1', other: 'O1' }],
        'topLevel[].nestedArray': [{ thing: 'T1', other: 'O1' }],
      },
    ],
  },
  badPayloadShape: {
    topLevel: [{ name: 'Station A' }],
  },
  expectedPayloadShape: {
    topLevel: [{ name: 'Station A', nestedArray: [{ thing: 'T1', other: 'O1' }] }],
  },
}

export const EmbeddedArraysFromSchemaWithOverrides = (): ReactElement => {
  const formOverrideState = useState<IFormOverride | undefined>(formOverride)
  const schemaState = useState<JSONSchema6 | undefined>(schema)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const [formValues, setFormValues] = useAtom(formValuesAtom)

  const [activeOverride, setActiveOverride] = useState<'mixed' | 'relative' | 'qualified'>('mixed')

  const setOverrideMode = (mode: 'mixed' | 'relative' | 'qualified'): void => {
    setFormValues({})
    setActiveOverride(mode)
    if (mode === 'mixed') {
      formOverrideState[1](formOverride)
      return
    }
    if (mode === 'relative') {
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
        type={activeOverride === 'mixed' ? 'primary' : 'secondary'}
        size="xs"
        className="mt-4 ml-2"
        onClick={() => setOverrideMode('mixed')}
      >
        Mixed Paths
      </Button>
      <Button
        type={activeOverride === 'relative' ? 'primary' : 'secondary'}
        size="xs"
        className="mt-4 ml-2"
        onClick={() => setOverrideMode('relative')}
      >
        Relative Only
      </Button>
      <Button
        type={activeOverride === 'qualified' ? 'primary' : 'secondary'}
        size="xs"
        className="mt-4 ml-2"
        onClick={() => setOverrideMode('qualified')}
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

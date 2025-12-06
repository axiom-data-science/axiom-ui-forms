"use client";
import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { type JSONSchema6 } from 'json-schema'
import React, { useState, type ReactElement } from 'react'
import schema from './schema.json'
import formOverrides from './formOverrides'
import { type IFormOverride } from '@/library'

const PlatformsMetadata = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const formOverridesState = useState<IFormOverride | undefined>(formOverrides)

  return (
        <FormWithEditorOverlay
            schemaState={schemaState}
            formOverrideState={formOverridesState}
            label='Platform Metadata Form'
            />
  )
}

export default PlatformsMetadata

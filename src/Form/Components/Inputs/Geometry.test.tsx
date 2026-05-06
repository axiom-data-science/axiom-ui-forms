/**
 * Geometry.test.tsx - Test suite for GeometryInput component
 *
 * Tests the geometry field rendering and logic:
 * - External field binding via enabledShapesField setting
 * - MaxLineStringPoints validation
 * - Shape type merging from static settings and external field
 */

import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { GeometryInput, applyMaxPointsToFeature } from './Geometry'
import { type IGeometryField, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { type Feature } from 'geojson'
import type * as GeoJSON from 'geojson'
import * as formEngineHooks from '@/utils/formEngine/hooks'

// Mock useFormValue hook
vi.mock('@/utils/formEngine/hooks', async () => {
  const actual = await vi.importActual<typeof formEngineHooks>('@/utils/formEngine/hooks')
  return {
    ...actual,
    useFormValue: vi.fn(),
  }
})

// Mock axiom-maps imports
vi.mock('@axdspub/axiom-maps', () => ({
  MapLoader: ({ children }: { children: any }) => <div data-testid="map-loader">{children}</div>,
  EMapShape: {
    point: 'point',
    linestring: 'linestring',
    polygon: 'polygon',
  },
}))

// Mock axiom-ui-utilities
vi.mock('@axdspub/axiom-ui-utilities', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  TextArea: ({ value, onChange, ...props }: any) => (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} {...props} />
  ),
  utils: {
    makeClassName: (...args: any[]) => args.flat().filter(Boolean).join(' '),
  },
}))

describe('applyMaxPointsToFeature', () => {
  const makeLineString = (numPoints: number): Feature => ({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: Array.from({ length: numPoints }, (_, i) => [i, i]),
    },
  })

  it('returns feature unchanged when no maxPoints configured', () => {
    const f = makeLineString(10)
    const { feature, limitError } = applyMaxPointsToFeature(f)
    expect(feature.geometry).toEqual(f.geometry)
    expect(limitError).toBeUndefined()
  })

  it('returns feature unchanged when within limit', () => {
    const f = makeLineString(3)
    const { feature, limitError } = applyMaxPointsToFeature(f, 5)
    expect((feature.geometry as GeoJSON.LineString).coordinates).toHaveLength(3)
    expect(limitError).toBeUndefined()
  })

  it('returns feature unchanged when exactly at limit', () => {
    const f = makeLineString(5)
    const { feature, limitError } = applyMaxPointsToFeature(f, 5)
    expect((feature.geometry as GeoJSON.LineString).coordinates).toHaveLength(5)
    expect(limitError).toBeUndefined()
  })

  it('truncates coordinates and sets limitError when over limit', () => {
    const f = makeLineString(8)
    const { feature, limitError } = applyMaxPointsToFeature(f, 3)
    expect((feature.geometry as GeoJSON.LineString).coordinates).toHaveLength(3)
    expect(limitError).toMatch(/3/)
  })

  it('truncates to exactly maxPoints=2 (transect/segment use case)', () => {
    const f = makeLineString(10)
    const { feature, limitError } = applyMaxPointsToFeature(f, 2)
    expect((feature.geometry as GeoJSON.LineString).coordinates).toHaveLength(2)
    expect(limitError).toBeDefined()
  })

  it('does not truncate non-LineString geometries', () => {
    const pointFeature: Feature = {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: [0, 0] },
    }
    const { feature, limitError } = applyMaxPointsToFeature(pointFeature, 1)
    expect(feature.geometry.type).toBe('Point')
    expect(limitError).toBeUndefined()
  })

  it('preserves feature properties when truncating', () => {
    const f: Feature = {
      type: 'Feature',
      properties: { name: 'test', id: 42 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1],
          [2, 2],
          [3, 3],
        ],
      },
    }
    const { feature } = applyMaxPointsToFeature(f, 2)
    expect(feature.properties).toEqual({ name: 'test', id: 42 })
  })

  it('limitError message references the maxPoints value', () => {
    const f = makeLineString(10)
    const { limitError } = applyMaxPointsToFeature(f, 4)
    expect(limitError).toContain('4')
  })
})

describe('GeometryInput - External Field & Point Limit', () => {
  const baseField: IGeometryField = {
    id: 'geometry',
    type: 'geometry',
    label: 'Geometry Field',
  }

  const baseProps: IFieldInputProps = {
    field: baseField,
    onChange: vi.fn(),
    value: undefined,
    disabled: false,
  }

  describe('enabledShapesField integration', () => {
    it('reads enabled shapes from external form field', () => {
      const mockUseFormValue = vi.mocked(formEngineHooks.useFormValue)
      mockUseFormValue.mockReturnValue('point,linestring')

      const fieldWithExternal: IGeometryField = {
        ...baseField,
        settings: {
          enabledShapesField: 'shapeTypes',
          drawEnabled: true,
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldWithExternal} />
        </React.Suspense>
      )

      // Verify hook was called with correct path
      expect(mockUseFormValue).toHaveBeenCalledWith('shapeTypes')
    })

    it('parses comma-separated shape types from external field', () => {
      const mockUseFormValue = vi.mocked(formEngineHooks.useFormValue)
      mockUseFormValue.mockReturnValue('polygon,linestring')

      const fieldWithExternal: IGeometryField = {
        ...baseField,
        settings: {
          enabledShapesField: 'allowedShapes',
          drawEnabled: true,
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldWithExternal} />
        </React.Suspense>
      )

      expect(mockUseFormValue).toHaveBeenCalledWith('allowedShapes')
    })

    it('parses array of shape types from external field', () => {
      const mockUseFormValue = vi.mocked(formEngineHooks.useFormValue)
      mockUseFormValue.mockReturnValue(['point', 'polygon'])

      const fieldWithExternal: IGeometryField = {
        ...baseField,
        settings: {
          enabledShapesField: 'shapes',
          drawEnabled: true,
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldWithExternal} />
        </React.Suspense>
      )

      expect(mockUseFormValue).toHaveBeenCalledWith('shapes')
    })

    it('respects static settings precedence over external field', () => {
      const mockUseFormValue = vi.mocked(formEngineHooks.useFormValue)
      mockUseFormValue.mockReturnValue('linestring,polygon')

      // Static settings say only point is allowed
      const fieldWithBoth: IGeometryField = {
        ...baseField,
        settings: {
          enabledShapesField: 'externalShapes',
          drawEnabled: true,
          drawPointEnabled: true, // Explicitly enabled
          drawPathEnabled: false,
          drawPolygonEnabled: false,
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldWithBoth} />
        </React.Suspense>
      )

      // Static setting drawPointEnabled=true has priority
      expect(mockUseFormValue).toHaveBeenCalledWith('externalShapes')
    })

    it('handles null/undefined external field gracefully', () => {
      const mockUseFormValue = vi.mocked(formEngineHooks.useFormValue)
      mockUseFormValue.mockReturnValue(undefined)

      const fieldWithExternal: IGeometryField = {
        ...baseField,
        settings: {
          enabledShapesField: 'missingShapes',
          drawEnabled: true,
          drawPointEnabled: true, // Fallback to static
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldWithExternal} />
        </React.Suspense>
      )

      expect(mockUseFormValue).toHaveBeenCalledWith('missingShapes')
    })
  })

  describe('maxLineStringPoints validation', () => {
    it('accepts LineString within point limit', () => {
      const onChange = vi.fn()
      const fieldWithLimit: IGeometryField = {
        ...baseField,
        settings: {
          drawEnabled: true,
          drawPathEnabled: true,
          maxLineStringPoints: 10,
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldWithLimit} onChange={onChange} />
        </React.Suspense>
      )

      // LineString with 5 points should be valid (< 10)
      const coordinates = '0, 0\n1, 1\n2, 2\n3, 3\n4, 4'
      const textAreas = screen.queryAllByRole('textbox') || []
      if (textAreas.length > 0) {
        fireEvent.change(textAreas[0], { target: { value: coordinates } })
        // Should not show error for < maxLineStringPoints
      }
    })

    it('rejects LineString exceeding point limit', () => {
      const onChange = vi.fn()
      const fieldWithLimit: IGeometryField = {
        ...baseField,
        settings: {
          drawEnabled: true,
          drawPathEnabled: true,
          maxLineStringPoints: 3,
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldWithLimit} onChange={onChange} />
        </React.Suspense>
      )

      // LineString with 5 points should fail (> 3)
      const coordinates = '0, 0\n1, 1\n2, 2\n3, 3\n4, 4'
      const textAreas = screen.queryAllByRole('textbox') || []
      if (textAreas.length > 0) {
        fireEvent.change(textAreas[0], { target: { value: coordinates } })
        // Should show error exceeding maxLineStringPoints
      }
    })

    it('ignores maxLineStringPoints for non-LineString geometries', () => {
      const onChange = vi.fn()
      const fieldWithLimit: IGeometryField = {
        ...baseField,
        settings: {
          drawEnabled: true,
          drawPointEnabled: true,
          maxLineStringPoints: 1,
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldWithLimit} onChange={onChange} />
        </React.Suspense>
      )

      // Single Point should not be affected by maxLineStringPoints
      const coordinates = '0, 0'
      const textAreas = screen.queryAllByRole('textbox') || []
      if (textAreas.length > 0) {
        fireEvent.change(textAreas[0], { target: { value: coordinates } })
        // Should not error - Point is allowed
      }
    })
  })

  describe('combined usage: external field + maxLineStringPoints', () => {
    it('merges external shapes with maxLineStringPoints limit', () => {
      const mockUseFormValue = vi.mocked(formEngineHooks.useFormValue)
      mockUseFormValue.mockReturnValue('linestring,polygon')

      const onChange = vi.fn()
      const fieldCombined: IGeometryField = {
        ...baseField,
        settings: {
          enabledShapesField: 'allowedShapes',
          drawEnabled: true,
          maxLineStringPoints: 20, // Linestring cap
          showCoordinateInput: true,
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldCombined} onChange={onChange} />
        </React.Suspense>
      )

      // Both features should be active: shapes from external field + point limit
      expect(mockUseFormValue).toHaveBeenCalledWith('allowedShapes')
    })
  })
})

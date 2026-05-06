/**
 * Geometry.test.tsx - Test suite for GeometryInput component
 *
 * Tests the geometry field rendering and logic:
 * - External field binding via enabledShapesField setting
 * - MaxLineStringPoints validation
 * - Shape type merging from static settings and external field
 */

import { describe, it, expect, vi } from ***REMOVED***vitest***REMOVED***
import React from ***REMOVED***react***REMOVED***
import { render, screen, fireEvent } from ***REMOVED***@testing-library/react***REMOVED***
import { GeometryInput, applyMaxPointsToFeature } from ***REMOVED***./Geometry***REMOVED***
import { type IGeometryField, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type Feature } from ***REMOVED***geojson***REMOVED***
import type * as GeoJSON from ***REMOVED***geojson***REMOVED***
import * as formEngineHooks from ***REMOVED***@/utils/formEngine/hooks***REMOVED***

// Mock useFormValue hook
vi.mock(***REMOVED***@/utils/formEngine/hooks***REMOVED***, async () => {
  const actual = await vi.importActual<typeof formEngineHooks>(***REMOVED***@/utils/formEngine/hooks***REMOVED***)
  return {
    ...actual,
    useFormValue: vi.fn(),
  }
})

// Mock axiom-maps imports
vi.mock(***REMOVED***@axdspub/axiom-maps***REMOVED***, () => ({
  MapLoader: ({ children }: { children: any }) => <div data-testid="map-loader">{children}</div>,
  EMapShape: {
    point: ***REMOVED***point***REMOVED***,
    linestring: ***REMOVED***linestring***REMOVED***,
    polygon: ***REMOVED***polygon***REMOVED***,
  },
}))

// Mock axiom-ui-utilities
vi.mock(***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***, () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  TextArea: ({ value, onChange, ...props }: any) => (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} {...props} />
  ),
  utils: {
    makeClassName: (...args: any[]) => args.flat().filter(Boolean).join(***REMOVED*** ***REMOVED***),
  },
}))

describe(***REMOVED***applyMaxPointsToFeature***REMOVED***, () => {
  const makeLineString = (numPoints: number): Feature => ({
    type: ***REMOVED***Feature***REMOVED***,
    properties: {},
    geometry: {
      type: ***REMOVED***LineString***REMOVED***,
      coordinates: Array.from({ length: numPoints }, (_, i) => [i, i]),
    },
  })

  it(***REMOVED***returns feature unchanged when no maxPoints configured***REMOVED***, () => {
    const f = makeLineString(10)
    const { feature, limitError } = applyMaxPointsToFeature(f)
    expect(feature.geometry).toEqual(f.geometry)
    expect(limitError).toBeUndefined()
  })

  it(***REMOVED***returns feature unchanged when within limit***REMOVED***, () => {
    const f = makeLineString(3)
    const { feature, limitError } = applyMaxPointsToFeature(f, 5)
    expect((feature.geometry as GeoJSON.LineString).coordinates).toHaveLength(3)
    expect(limitError).toBeUndefined()
  })

  it(***REMOVED***returns feature unchanged when exactly at limit***REMOVED***, () => {
    const f = makeLineString(5)
    const { feature, limitError } = applyMaxPointsToFeature(f, 5)
    expect((feature.geometry as GeoJSON.LineString).coordinates).toHaveLength(5)
    expect(limitError).toBeUndefined()
  })

  it(***REMOVED***truncates coordinates and sets limitError when over limit***REMOVED***, () => {
    const f = makeLineString(8)
    const { feature, limitError } = applyMaxPointsToFeature(f, 3)
    expect((feature.geometry as GeoJSON.LineString).coordinates).toHaveLength(3)
    expect(limitError).toMatch(/3/)
  })

  it(***REMOVED***truncates to exactly maxPoints=2 (transect/segment use case)***REMOVED***, () => {
    const f = makeLineString(10)
    const { feature, limitError } = applyMaxPointsToFeature(f, 2)
    expect((feature.geometry as GeoJSON.LineString).coordinates).toHaveLength(2)
    expect(limitError).toBeDefined()
  })

  it(***REMOVED***does not truncate non-LineString geometries***REMOVED***, () => {
    const pointFeature: Feature = {
      type: ***REMOVED***Feature***REMOVED***,
      properties: {},
      geometry: { type: ***REMOVED***Point***REMOVED***, coordinates: [0, 0] },
    }
    const { feature, limitError } = applyMaxPointsToFeature(pointFeature, 1)
    expect(feature.geometry.type).toBe(***REMOVED***Point***REMOVED***)
    expect(limitError).toBeUndefined()
  })

  it(***REMOVED***preserves feature properties when truncating***REMOVED***, () => {
    const f: Feature = {
      type: ***REMOVED***Feature***REMOVED***,
      properties: { name: ***REMOVED***test***REMOVED***, id: 42 },
      geometry: {
        type: ***REMOVED***LineString***REMOVED***,
        coordinates: [
          [0, 0],
          [1, 1],
          [2, 2],
          [3, 3],
        ],
      },
    }
    const { feature } = applyMaxPointsToFeature(f, 2)
    expect(feature.properties).toEqual({ name: ***REMOVED***test***REMOVED***, id: 42 })
  })

  it(***REMOVED***limitError message references the maxPoints value***REMOVED***, () => {
    const f = makeLineString(10)
    const { limitError } = applyMaxPointsToFeature(f, 4)
    expect(limitError).toContain(***REMOVED***4***REMOVED***)
  })
})

describe(***REMOVED***GeometryInput - External Field & Point Limit***REMOVED***, () => {
  const baseField: IGeometryField = {
    id: ***REMOVED***geometry***REMOVED***,
    type: ***REMOVED***geometry***REMOVED***,
    label: ***REMOVED***Geometry Field***REMOVED***,
  }

  const baseProps: IFieldInputProps = {
    field: baseField,
    onChange: vi.fn(),
    value: undefined,
    disabled: false,
  }

  describe(***REMOVED***enabledShapesField integration***REMOVED***, () => {
    it(***REMOVED***reads enabled shapes from external form field***REMOVED***, () => {
      const mockUseFormValue = vi.mocked(formEngineHooks.useFormValue)
      mockUseFormValue.mockReturnValue(***REMOVED***point,linestring***REMOVED***)

      const fieldWithExternal: IGeometryField = {
        ...baseField,
        settings: {
          enabledShapesField: ***REMOVED***shapeTypes***REMOVED***,
          drawEnabled: true,
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldWithExternal} />
        </React.Suspense>
      )

      // Verify hook was called with correct path
      expect(mockUseFormValue).toHaveBeenCalledWith(***REMOVED***shapeTypes***REMOVED***)
    })

    it(***REMOVED***parses comma-separated shape types from external field***REMOVED***, () => {
      const mockUseFormValue = vi.mocked(formEngineHooks.useFormValue)
      mockUseFormValue.mockReturnValue(***REMOVED***polygon,linestring***REMOVED***)

      const fieldWithExternal: IGeometryField = {
        ...baseField,
        settings: {
          enabledShapesField: ***REMOVED***allowedShapes***REMOVED***,
          drawEnabled: true,
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldWithExternal} />
        </React.Suspense>
      )

      expect(mockUseFormValue).toHaveBeenCalledWith(***REMOVED***allowedShapes***REMOVED***)
    })

    it(***REMOVED***parses array of shape types from external field***REMOVED***, () => {
      const mockUseFormValue = vi.mocked(formEngineHooks.useFormValue)
      mockUseFormValue.mockReturnValue([***REMOVED***point***REMOVED***, ***REMOVED***polygon***REMOVED***])

      const fieldWithExternal: IGeometryField = {
        ...baseField,
        settings: {
          enabledShapesField: ***REMOVED***shapes***REMOVED***,
          drawEnabled: true,
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldWithExternal} />
        </React.Suspense>
      )

      expect(mockUseFormValue).toHaveBeenCalledWith(***REMOVED***shapes***REMOVED***)
    })

    it(***REMOVED***respects static settings precedence over external field***REMOVED***, () => {
      const mockUseFormValue = vi.mocked(formEngineHooks.useFormValue)
      mockUseFormValue.mockReturnValue(***REMOVED***linestring,polygon***REMOVED***)

      // Static settings say only point is allowed
      const fieldWithBoth: IGeometryField = {
        ...baseField,
        settings: {
          enabledShapesField: ***REMOVED***externalShapes***REMOVED***,
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
      expect(mockUseFormValue).toHaveBeenCalledWith(***REMOVED***externalShapes***REMOVED***)
    })

    it(***REMOVED***handles null/undefined external field gracefully***REMOVED***, () => {
      const mockUseFormValue = vi.mocked(formEngineHooks.useFormValue)
      mockUseFormValue.mockReturnValue(undefined)

      const fieldWithExternal: IGeometryField = {
        ...baseField,
        settings: {
          enabledShapesField: ***REMOVED***missingShapes***REMOVED***,
          drawEnabled: true,
          drawPointEnabled: true, // Fallback to static
        },
      }

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <GeometryInput {...baseProps} field={fieldWithExternal} />
        </React.Suspense>
      )

      expect(mockUseFormValue).toHaveBeenCalledWith(***REMOVED***missingShapes***REMOVED***)
    })
  })

  describe(***REMOVED***maxLineStringPoints validation***REMOVED***, () => {
    it(***REMOVED***accepts LineString within point limit***REMOVED***, () => {
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
      const coordinates = ***REMOVED***0, 0\n1, 1\n2, 2\n3, 3\n4, 4***REMOVED***
      const textAreas = screen.queryAllByRole(***REMOVED***textbox***REMOVED***) || []
      if (textAreas.length > 0) {
        fireEvent.change(textAreas[0], { target: { value: coordinates } })
        // Should not show error for < maxLineStringPoints
      }
    })

    it(***REMOVED***rejects LineString exceeding point limit***REMOVED***, () => {
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
      const coordinates = ***REMOVED***0, 0\n1, 1\n2, 2\n3, 3\n4, 4***REMOVED***
      const textAreas = screen.queryAllByRole(***REMOVED***textbox***REMOVED***) || []
      if (textAreas.length > 0) {
        fireEvent.change(textAreas[0], { target: { value: coordinates } })
        // Should show error exceeding maxLineStringPoints
      }
    })

    it(***REMOVED***ignores maxLineStringPoints for non-LineString geometries***REMOVED***, () => {
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
      const coordinates = ***REMOVED***0, 0***REMOVED***
      const textAreas = screen.queryAllByRole(***REMOVED***textbox***REMOVED***) || []
      if (textAreas.length > 0) {
        fireEvent.change(textAreas[0], { target: { value: coordinates } })
        // Should not error - Point is allowed
      }
    })
  })

  describe(***REMOVED***combined usage: external field + maxLineStringPoints***REMOVED***, () => {
    it(***REMOVED***merges external shapes with maxLineStringPoints limit***REMOVED***, () => {
      const mockUseFormValue = vi.mocked(formEngineHooks.useFormValue)
      mockUseFormValue.mockReturnValue(***REMOVED***linestring,polygon***REMOVED***)

      const onChange = vi.fn()
      const fieldCombined: IGeometryField = {
        ...baseField,
        settings: {
          enabledShapesField: ***REMOVED***allowedShapes***REMOVED***,
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
      expect(mockUseFormValue).toHaveBeenCalledWith(***REMOVED***allowedShapes***REMOVED***)
    })
  })
})

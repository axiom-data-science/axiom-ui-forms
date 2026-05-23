# Array Item Overrides Guide

## Overview

Field and form overrides now work with array item properties. This allows you to customize labels, layouts, tabs, pages, and wrapper objects for fields that appear in array items.

## Path Notation

When referencing array item properties in overrides, use one of these notations:

### 1. Array Bracket Notation (Recommended)
```json
{
  "prop": "arrayName[].propertyName"
}
```

Example:
```json
{
  "prop": "products[].name",
  "label": "Product Name"
}
```

### 2. Dot Notation
```json
{
  "prop": "arrayName.propertyName"
}
```

Example:
```json
{
  "prop": "products.name",
  "label": "Product Name"
}
```

Both notations work identically. Use whichever feels more natural for your use case.

## Use Cases

### Simple Label Overrides

```json
[
  {
    "prop": "users[].email",
    "label": "Email Address"
  },
  {
    "prop": "users[].phone",
    "label": "Phone Number"
  }
]
```

### Organizing with Tabs

Form override:
```json
{
  "fields": [{ "prop": "users" }],
  "tabs": [
    {
      "id": "contact",
      "label": "Contact Info",
      "fields": [
        { "prop": "users[].email" },
        { "prop": "users[].phone" }
      ]
    },
    {
      "id": "location",
      "label": "Location",
      "fields": [
        { "prop": "users[].address" },
        { "prop": "users[].city" }
      ]
    }
  ]
}
```

### Organizing with Pages

```json
{
  "fields": [{ "prop": "items" }],
  "pages": [
    {
      "id": "basic",
      "label": "Basic Information",
      "fields": [
        { "prop": "items[].name" },
        { "prop": "items[].sku" }
      ]
    },
    {
      "id": "pricing",
      "label": "Pricing",
      "fields": [
        { "prop": "items[].price" },
        { "prop": "items[].cost" }
      ]
    }
  ]
}
```

### Combining Field Overrides with Tabs

Field override (fields.json):
```json
[
  {
    "prop": "records[].firstName",
    "label": "First Name"
  },
  {
    "prop": "records[].lastName",
    "label": "Last Name"
  },
  {
    "prop": "records[].email",
    "label": "Email"
  }
]
```

Form override (form.json):
```json
{
  "tabs": [
    {
      "id": "name",
      "label": "Name",
      "fields": [
        { "prop": "records[].firstName" },
        { "prop": "records[].lastName" }
      ]
    },
    {
      "id": "contact",
      "label": "Contact",
      "fields": [
        { "prop": "records[].email" }
      ]
    }
  ]
}
```

## Nested Objects Within Array Items

If your array items contain nested objects, you can override those nested properties too:

```json
[
  {
    "prop": "users[].address.street",
    "label": "Street Address"
  },
  {
    "prop": "users[].address.city",
    "label": "City"
  }
]
```

This works because the override system recursively applies overrides through nested objects and arrays.

## Important Notes

1. **Array item overrides cascade**: When you add a tab or page override referencing array item fields, the layout applies to each array item individually.

2. **Path consistency**: The array property path must match exactly between schema, field overrides, and form overrides.

3. **Multiple notation styles**: You can mix both notations in the same override file:
   ```json
   [
     { "prop": "items[].name" },    // bracket notation
     { "prop": "items.description" } // dot notation
   ]
   ```

4. **Recursive fields**: All nested structures (pages, wizard steps, tabs) automatically get the array item field references available within their scope.

## Examples

See the test cases for complete working examples:
- `src/Form/TestForms/OverrideOfSchemaArray/` - Basic label overrides
- `src/Form/TestForms/ArrayWithTabs/` - Tabs layout for array items
- `src/Form/TestForms/ArrayWithWrapperObjects/` - Complex multi-tab arrangement

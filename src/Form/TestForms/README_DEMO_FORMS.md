# Demo Forms - New and Improved Functionality

This directory contains example form configurations demonstrating the new and improved form builder capabilities.

## 1. ObjectList Example (`ObjectListExample/`)

**Components:**
- `form.json` - Form configuration
- `ObjectListExample.tsx` - React component

**What it demonstrates:**
- **objectList field type** - Manages a keyed collection instead of an array
- Uses `settings.keyField` to specify which field provides the object key
- In this example, servers are keyed by `hostname`
- When you change the hostname, the key automatically updates
- Supports add, duplicate, and delete operations on keyed items
- Data structure: `{ "server1": { hostname: "server1", ip: "...", ... }, "server2": {...} }`

**Use cases:**
- Server/host management indexed by hostname
- Configuration profiles indexed by name
- User permissions indexed by user ID
- Any scenario where you need keyed lookup instead of array indexing

---

## 2. ObjectWrapper with Schema (`ObjectWrapperWithSchema/`)

**Components:**
- `schema.json` - JSON Schema with all fields
- `fields.json` - Field overrides using objectWrapper
- `ObjectWrapperWithSchema.tsx` - React component

**What it demonstrates:**
- **objectWrapper field type** in schema overrides
- Creates UI-only containers that organize schema fields without adding nesting
- `objectWrapper` has `skip_path: true` enforced (data doesn***REMOVED***t nest)
- In this example, a product schema is reorganized into two wrappers:
  - `product_info` wrapper: tabs for Basic Info, Inventory, and Shipping
  - `supplier_info` wrapper: flat list of supplier fields
- All data writes to root level (no nesting) despite tab organization
- Ideal for improving UX without changing data structure

**Use cases:**
- Organizing many flat fields into logical groups/tabs
- Restructuring schema fields contextually (override-based)
- Improving user experience for complex forms
- Temporary UI reorganization without data model changes

---

## 3. Tabs in Pages with Wrapper (`TabsInPagesWithWrapper/`)

**Components:**
- `form.json` - Full form configuration with pages, tabs, and wrapper
- `TabsInPagesWithWrapper.tsx` - React component

**What it demonstrates:**
- Complex layout combinations:
  - **Pages** at top level (General, Advanced Settings)
  - **Tabs** within the Advanced Settings page (Performance, Security, Logging)
  - **objectWrapper with nested tabs** inside the Performance tab:
    - Caching configuration (cache enable/TTL/strategy)
    - Compression configuration (enable/level)
- Multi-level navigation and organization
- objectWrapper provides additional UI organization without data nesting
- Demonstrates full capability of layout system

**Use cases:**
- Large configuration forms with multi-level organization
- Settings pages with progressive disclosure
- Advanced feature grouping
- Complex workflows with multiple decision trees

---

## Testing These Examples

Each component exports a React component ready to use. To test:

1. Import the component into your app:
   ```tsx
   import ObjectListExample from "@/Form/TestForms/ObjectListExample/ObjectListExample"
   import ObjectWrapperWithSchema from "@/Form/TestForms/ObjectWrapperWithSchema/ObjectWrapperWithSchema"
   import TabsInPagesWithWrapper from "@/Form/TestForms/TabsInPagesWithWrapper/TabsInPagesWithWrapper"
   ```

2. Render in your test page:
   ```tsx
   <ObjectListExample />
   <ObjectWrapperWithSchema />
   <TabsInPagesWithWrapper />
   ```

3. Use the editor overlay to view/edit the underlying form configuration JSON

---

## Key Concepts

### objectList vs multiple

| Feature | objectList | multiple |
|---------|-----------|----------|
| Storage | Keyed object `{ key: value }` | Array `[item1, item2]` |
| Key field | Configurable via `settings.keyField` | Array index (0, 1, 2...) |
| Use case | Named/identified items | Sequential/ordered items |
| Lookup | `data.servers[***REMOVED***server1***REMOVED***]` | `data.items[0]` |
| Key changes | Auto-update when keyField changes | N/A |

### objectWrapper vs object

| Feature | objectWrapper | object (regular) |
|---------|--------------|-----------------|
| skip_path | Always true (enforced) | Optional (false default) |
| Data nesting | Never nests | Can nest data |
| UI purpose | Pure organization | Data container |
| Condition with tabs | No multiple allowed | Can combine with multiple |
| Use case | Layout grouping override | Data structure |

### Layout Combinations

**Valid:**
- Pages + Tabs (page contains tabs)
- Tabs + objectWrapper (tab contains wrapper with nested tabs)
- objectWrapper + multiple fields (wrapper groups non-object multiple fields)

**Not supported:**
- objectWrapper + multiple: true (enforced by type)
- Nested pages/wizard_steps: only at form root level

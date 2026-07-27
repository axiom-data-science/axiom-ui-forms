Rules:

- Plese only change code in /src/Management and package.json if new packages are needed
- Permission is given to run commands
- Wherever possible, re-use patterns from the rest of the project (outside of /Management)

To do:

- Make sure form overrides that contain field overrides work correctly. Field override can occur in the form override object as well as field overrides
- Add an area below the Hierarch block that displays unused schema properties. It should display the title of the property as well as the path (json path), and a user should be able to grab from this list and drag to any of the areas where field drop is ok
- Highlight the dropzone within Hierarchy when a draggable field or group is picked up
- Add a way to seed the management you from other existing form/schema/field_overrides sets and make sure they work:
  -- /src/PTT/HAB/HabConfig.json (schema), /src/PTT/habFormOverride.ts (form override - will need to be converted to JSON), /src/PTT/habFieldOverrides.ts and /src/PTT/fieldOverrides.ts (field overrides - will need to be converted to JSON)
  -- /src/PTT/Oil - same pattern as HAB above
  -- /src/PTT/Larval - same pattern
  -- look for schema/form override/field overrides that are used in /src/Forms/TestForms

Please complete all tasks before prompting me

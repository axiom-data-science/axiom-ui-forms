import BooleanInput from ***REMOVED***@/Form/Components/Inputs/Boolean***REMOVED***
import LongString from ***REMOVED***@/Form/Components/Inputs/LongString***REMOVED***
import StringInput from ***REMOVED***@/Form/Components/Inputs/String***REMOVED***
import ObjectInput from ***REMOVED***@/Form/Components/Inputs/Object***REMOVED***
import Radio from ***REMOVED***@/Form/Components/Inputs/RadioGroup***REMOVED***
import SingleSelect from ***REMOVED***@/Form/Components/Inputs/SingleSelect***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import JSONStringInput from ***REMOVED***@/Form/Components/Inputs/JSONString***REMOVED***
import NumberInput from ***REMOVED***@/Form/Components/Inputs/Number***REMOVED***
import GeoJSONInput from ***REMOVED***@/Form/Components/Inputs/GeoJSON***REMOVED***
import DateTimeInput from ***REMOVED***@/Form/Components/Inputs/DateTime***REMOVED***
import DateInput from ***REMOVED***@/Form/Components/Inputs/Date***REMOVED***
import TimeInput from ***REMOVED***@/Form/Components/Inputs/Time***REMOVED***

const inputMap: Record<string, React.FC<IFieldInputProps>> = {
  text: StringInput,
  long_text: LongString,
  number: NumberInput,
  json: JSONStringInput,
  boolean: BooleanInput,
  select: SingleSelect,
  radio: Radio,
  object: ObjectInput,
  geojson: GeoJSONInput,
  datetime: DateTimeInput,
  date: DateInput,
  time: TimeInput
}

export default inputMap

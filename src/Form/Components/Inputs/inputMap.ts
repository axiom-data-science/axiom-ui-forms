import BooleanInput from ***REMOVED***@/Form/Components/Inputs/Boolean***REMOVED***
import LongString from ***REMOVED***@/Form/Components/Inputs/LongString***REMOVED***
import StringInput from ***REMOVED***@/Form/Components/Inputs/String***REMOVED***
import ObjectInput from ***REMOVED***@/Form/Components/Inputs/Object***REMOVED***
import Radio from ***REMOVED***@/Form/Components/Inputs/RadioGroup***REMOVED***
import SingleSelect from ***REMOVED***@/Form/Components/Inputs/SingleSelect***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import JSONStringInput from ***REMOVED***@/Form/Components/Inputs/JSONInputLoader***REMOVED***
import NumberInput from ***REMOVED***@/Form/Components/Inputs/Number***REMOVED***
import GeoJSONInput from ***REMOVED***@/Form/Components/Inputs/GeoJSON***REMOVED***
import GeometryInput from ***REMOVED***@/Form/Components/Inputs/Geometry***REMOVED***
import DateTimeInput from ***REMOVED***@/Form/Components/Inputs/DateTime***REMOVED***
import DateInput from ***REMOVED***@/Form/Components/Inputs/Date***REMOVED***
import TimeInput from ***REMOVED***@/Form/Components/Inputs/Time***REMOVED***
import ConstantInput from ***REMOVED***@/Form/Components/Inputs/Constant***REMOVED***
import OneOfInput from ***REMOVED***@/Form/Components/Inputs/OneOfInput***REMOVED***
import StateSelectorInput from ***REMOVED***@/Form/Components/Inputs/StateSelectorInput***REMOVED***
import FileUpload from ***REMOVED***@/Form/Components/Inputs/FileUpload/FileUpload***REMOVED***

const inputMap: Record<string, React.FC<IFieldInputProps>> = {
  text: StringInput,
  long_text: LongString,
  number: NumberInput,
  json: JSONStringInput,
  boolean: BooleanInput,
  select: SingleSelect,
  radio: Radio,
  object: ObjectInput,
  objectWrapper: ObjectInput,
  oneOf: OneOfInput,
  geojson: GeoJSONInput,
  geometry: GeometryInput,
  datetime: DateTimeInput,
  date: DateInput,
  time: TimeInput,
  constant: ConstantInput,
  stateSelector: StateSelectorInput,
  fileUpload: FileUpload
}

export default inputMap

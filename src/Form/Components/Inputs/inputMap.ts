import BooleanInput from '@/Form/Components/Inputs/Boolean'
import LongString from '@/Form/Components/Inputs/LongString'
import StringInput from '@/Form/Components/Inputs/String'
import ObjectInput from '@/Form/Components/Inputs/Object'
import Radio from '@/Form/Components/Inputs/RadioGroup'
import SingleSelect from '@/Form/Components/Inputs/SingleSelect'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import JSONStringInput from '@/Form/Components/Inputs/JSONInputLoader'
import NumberInput from '@/Form/Components/Inputs/Number'
import GeoJSONInput from '@/Form/Components/Inputs/GeoJSON'
import GeometryInput from '@/Form/Components/Inputs/Geometry'
import DateTimeInput from '@/Form/Components/Inputs/DateTime'
import DateInput from '@/Form/Components/Inputs/Date'
import TimeInput from '@/Form/Components/Inputs/Time'
import ConstantInput from '@/Form/Components/Inputs/Constant'
import OneOfInput from '@/Form/Components/Inputs/OneOfInput'

const inputMap: Record<string, React.FC<IFieldInputProps>> = {
  text: StringInput,
  long_text: LongString,
  number: NumberInput,
  json: JSONStringInput,
  boolean: BooleanInput,
  select: SingleSelect,
  radio: Radio,
  object: ObjectInput,
  oneOf: OneOfInput,
  geojson: GeoJSONInput,
  geometry: GeometryInput,
  datetime: DateTimeInput,
  date: DateInput,
  time: TimeInput,
  constant: ConstantInput
}

export default inputMap

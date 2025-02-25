import BooleanInput from '@/Form/Components/Inputs/Boolean'
import LongString from '@/Form/Components/Inputs/LongString'
import StringInput from '@/Form/Components/Inputs/String'
import ObjectInput from '@/Form/Components/Inputs/Object'
import Radio from '@/Form/Components/Inputs/RadioGroup'
import SingleSelect from '@/Form/Components/Inputs/SingleSelect'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import JSONStringInput from '@/Form/Components/Inputs/JSONString'
import NumberInput from '@/Form/Components/Inputs/Number'
import GeoJSONInput from '@/Form/Components/Inputs/GeoJSON'
const inputMap: Record<string, React.FC<IFieldInputProps>> = {
  text: StringInput,
  long_text: LongString,
  number: NumberInput,
  json: JSONStringInput,
  boolean: BooleanInput,
  select: SingleSelect,
  radio: Radio,
  object: ObjectInput,
  geojson: GeoJSONInput

}

export default inputMap

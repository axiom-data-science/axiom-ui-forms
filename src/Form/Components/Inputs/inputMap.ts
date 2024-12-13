import BooleanInput from ***REMOVED***@/Form/Components/Inputs/Boolean***REMOVED***
import LongString from ***REMOVED***@/Form/Components/Inputs/LongString***REMOVED***
import StringInput from ***REMOVED***@/Form/Components/Inputs/String***REMOVED***
import ObjectInput from ***REMOVED***@/Form/Components/Inputs/Object***REMOVED***
import Radio from ***REMOVED***@/Form/Components/Inputs/RadioGroup***REMOVED***
import SingleSelect from ***REMOVED***@/Form/Components/Inputs/SingleSelect***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***

const inputMap: Record<string, React.FC<IFieldInputProps>> = {
  text: StringInput,
  long_text: LongString,
  boolean: BooleanInput,
  select: SingleSelect,
  radio: Radio,
  object: ObjectInput

}

export default inputMap

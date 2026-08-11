import SelectInput from ***REMOVED***@/Form/Components/Inputs/SingleSelect***REMOVED***
import { IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import type { ReactElement } from ***REMOVED***react***REMOVED***

const states = `"Alabama","AL"
"Alaska","AK"
"Arizona","AZ"
"Arkansas","AR"
"California","CA"
"Colorado","CO"
"Connecticut","CT"
"Delaware","DE"
"District of Columbia","DC"
"Florida","FL"
"Georgia","GA"
"Hawaii","HI"
"Idaho","ID"
"Illinois","IL"
"Indiana","IN"
"Iowa","IA"
"Kansas","KS"
"Kentucky","KY"
"Louisiana","LA"
"Maine","ME"
"Montana","MT"
"Nebraska","NE"
"Nevada","NV"
"New Hampshire","NH"
"New Jersey","NJ"
"New Mexico","NM"
"New York","NY"
"North Carolina","NC"
"North Dakota","ND"
"Ohio","OH"
"Oklahoma","OK"
"Oregon","OR"
"Maryland","MD"
"Massachusetts","MA"
"Michigan","MI"
"Minnesota","MN"
"Mississippi","MS"
"Missouri","MO"
"Pennsylvania","PA"
"Rhode Island","RI"
"South Carolina","SC"
"South Dakota","SD"
"Tennessee","TN"
"Texas","TX"
"Utah","UT"
"Vermont","VT"
"Virginia","VA"
"Washington","WA"
"West Virginia","WV"
"Wisconsin","WI"
"Wyoming","WY"
"American Samoa","AS"
"Guam","Guam"
"Northern Mariana Islands","MP"
"Puerto Rico","PR"
"U.S. Virgin Islands","VI"`
  .split(***REMOVED***\n***REMOVED***)
  .map((line) => {
    const [label, value] = line.split(***REMOVED***,***REMOVED***)
    return { label: label.replace(/"/g, ***REMOVED******REMOVED***), value: value.replace(/"/g, ***REMOVED******REMOVED***) }
  })

const StateSelector = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  return (
    <SelectInput
      field={{
        ...field,
        type: ***REMOVED***select***REMOVED***,
        options: states,
      }}
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  )
}

export default StateSelector

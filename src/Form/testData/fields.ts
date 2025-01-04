import { type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***

export const testFields: IFormField[] = [
  {
    id: ***REMOVED***short***REMOVED***,
    label: ***REMOVED***Test component***REMOVED***,
    type: ***REMOVED***text***REMOVED***,
    required: false
  },
  {
    id: ***REMOVED***long***REMOVED***,
    label: ***REMOVED***Long string component***REMOVED***,
    type: ***REMOVED***long_text***REMOVED***,
    required: false,
    multiple: false
  },
  {
    id: ***REMOVED***description***REMOVED***,
    label: ***REMOVED***Description***REMOVED***,
    type: ***REMOVED***long_text***REMOVED***,
    required: false
  },
  {
    id: ***REMOVED***agree***REMOVED***,
    label: ***REMOVED***Do u agree?***REMOVED***,
    type: ***REMOVED***boolean***REMOVED***,
    required: true
  },
  {
    label: ***REMOVED***Select one***REMOVED***,
    id: ***REMOVED***color***REMOVED***,
    type: ***REMOVED***select***REMOVED***,
    required: true,
    multiple: false,
    options: [
      {
        label: ***REMOVED***Red***REMOVED***,
        value: ***REMOVED***red***REMOVED***
      },
      {
        label: ***REMOVED***Green***REMOVED***,
        value: ***REMOVED***green***REMOVED***
      },
      {
        label: ***REMOVED***Blue***REMOVED***,
        value: ***REMOVED***blue***REMOVED***
      }
    ]
  },
  {
    label: ***REMOVED***Pick a size***REMOVED***,
    id: ***REMOVED***size***REMOVED***,
    type: ***REMOVED***radio***REMOVED***,
    required: false,
    layout: ***REMOVED***vertical***REMOVED***,
    multiple: true,
    options: [
      {
        label: ***REMOVED***Small***REMOVED***,
        value: ***REMOVED***small***REMOVED***
      },
      {
        label: ***REMOVED***Medium***REMOVED***,
        value: ***REMOVED***medium***REMOVED***
      },
      {
        label: ***REMOVED***Large***REMOVED***,
        value: ***REMOVED***large***REMOVED***
      }
    ]
  },
  {
    label: ***REMOVED***Address***REMOVED***,
    id: ***REMOVED***address***REMOVED***,
    type: ***REMOVED***object***REMOVED***,
    required: true,
    layout: ***REMOVED***vertical***REMOVED***,
    multiple: true,
    fields: [
      {
        id: ***REMOVED***street***REMOVED***,
        label: ***REMOVED***Street***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        required: true
      },
      {
        id: ***REMOVED***city_state_zip***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        required: true,
        layout: ***REMOVED***horizontal***REMOVED***,
        fields: [
          {
            id: ***REMOVED***city***REMOVED***,
            label: ***REMOVED***City***REMOVED***,
            type: ***REMOVED***text***REMOVED***,
            required: true
          },
          {
            id: ***REMOVED***state***REMOVED***,
            label: ***REMOVED***State***REMOVED***,
            type: ***REMOVED***text***REMOVED***,
            required: true
          },
          {
            id: ***REMOVED***zip***REMOVED***,
            label: ***REMOVED***Zip***REMOVED***,
            type: ***REMOVED***text***REMOVED***,
            required: true
          }
        ]
      },
      {
        id: ***REMOVED***notes***REMOVED***,
        label: ***REMOVED***Notes***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: true
      },
      {
        id: ***REMOVED***family***REMOVED***,
        label: ***REMOVED***Family members***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        multiple: true,
        layout: ***REMOVED***horizontal***REMOVED***,
        fields: [
          {
            id: ***REMOVED***name***REMOVED***,
            label: ***REMOVED***Name***REMOVED***,
            type: ***REMOVED***text***REMOVED***,
            required: true
          },
          {
            id: ***REMOVED***age***REMOVED***,
            label: ***REMOVED***Age***REMOVED***,
            type: ***REMOVED***text***REMOVED***,
            required: true
          }
        ]
      }
    ]
  }
]

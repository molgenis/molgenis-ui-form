// @flow

export type EntityFieldType = 'BOOL' | 'CATEGORICAL' | 'ENUM' | 'XREF' | 'MREF' | 'ONETOMANY' |
  'INT' | 'DECIMAL' | 'LONG' | 'TEXT' | 'SCRIPT' | 'HTML' | 'DATE' | 'DATE_TIME' | 'CATEGORICAL_MREF' |
  'STRING' | 'HYPERLINK' | 'EMAIL' | 'FILE' | 'ONE_TO_MANY' | 'COMPOUND'

export type HtmlFieldType = 'radio' | 'select' | 'integer' | 'long' | 'decimal' | 'text-area' | 'date' | 'date-time' | 'checkbox' |
  'text' | 'email' | 'file' | 'field-group' | 'multi-select' | 'single-select' | 'script' | 'html' | 'hyperlink'

export type MapperMode = 'UPDATE' | 'CREATE'

export type FieldOption = {
  id: string,
  value: string | boolean | number | null,
  label: string
}

export type FormField = {
  type: HtmlFieldType,
  id: string,
  label: string,
  required: ((?Object) => boolean),
  disabled: boolean,
  visible: ((?Object) => boolean),
  options?: (() => Promise<Array<FieldOption>>),
  children?: Array<FormField>,
  validate: ((?Object) => boolean),
  maxlength?: number,
  addNullOption?: boolean
}

export type RefEntityType = {
  href: string,
  hrefCollection: string,
  idAttribute: string,
  labelAttribute?: string,
  languageCode?: string,
  writable?: boolean
}

/**
 * Optional settings object, allows user to tune the mapper, all fields are optional
 */
export type MapperOptions = {
  mapperMode?: MapperMode,
  booleanLabels?: {
    trueLabel: string,
    falseLabel: string
  },
  formOptions?: {
    addEnumNullOption: boolean,
    addBooleanNullOption: boolean,
    addCategoricalNullOption: boolean
  },
  showNonVisibleAttributes?: boolean
}

/**
 * Construct to store mapper settings, all attributes are non optional.
 */
export type MapperSettings = {
  mapperMode: MapperMode,
  booleanLabels: {
    trueLabel: string,
    falseLabel: string
  },
  formOptions: {
    addEnumNullOption: boolean,
    addBooleanNullOption: boolean,
    addCategoricalNullOption: boolean
  },
  showNonVisibleAttributes: boolean
}

export type FormComponentOptions = {
  showEyeButton?: boolean,
  allowAddingOptions?: boolean,
  inputDebounceTime: number
}

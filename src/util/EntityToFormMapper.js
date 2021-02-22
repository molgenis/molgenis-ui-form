// @flow
import type {
  EntityFieldType,
  FieldOption,
  FormField,
  HtmlFieldType,
  RefEntityType,
  MapperOptions,
  MapperSettings
} from '../flow.types'

import { isValid, isRequired, isVisible } from './helpers/expressionEvaluators'
import UriGenerator from './helpers/uriGenerator'
// $FlowFixMe
import api from '@molgenis/molgenis-api-client'
// $FlowFixMe
import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'
// $FlowFixMe
import moment from 'moment'

const DEFAULTS = {
  mapperMode: 'UPDATE',
  booleanLabels: {
    trueLabel: 'True',
    falseLabel: 'False'
  },
  showNonVisibleAttributes: false
}

// Create an object type UserException
function MappingException (message: string) {
  this.message = message
  this.name = 'MappingException'
}

// Make the exception convert to a pretty string when used as a string
// (e.g. by the error console)
// Add flow flowfixme as a workaround for flow bug
// $FlowFixMe
MappingException.prototype.toString = function () {
  return this.name + ': "' + this.message + '"'
}

// Cache fetchFieldOptions request responses.
// key:  requestUri as string, value: raw api v2 response
const refOptionsCache = {}

const refEntityLabelAttribute = (refEntity) => refEntity.labelAttribute ? refEntity.labelAttribute : refEntity.idAttribute

const buildRefOptionsQuery = (refEntity: RefEntityType, search: ?string | ?Array<string>):string => {
  const idAttribute = refEntity.idAttribute
  const labelAttribute = refEntityLabelAttribute(refEntity)

  // map refEntity.hrefCollection v1 URLs to v2 to enable the use of RSQL queries
  let uri = refEntity.hrefCollection.replace('/v1/', '/v2/')
  return UriGenerator.generateUri(search, uri, idAttribute, labelAttribute)
}

/**
 * Uses the idAttribute, labelAttribute, and hrefCollection parameters of the refEntity
 * to query a data table. Returns a list of {id, value, label} items as a Promise
 *
 * @param refEntity The refEntity of the attribute.
 * @param search An optional search query used to filter the items of the response
 * @return {Promise} Promise object representing an Array of FieldOption
 */
const fetchFieldOptions = (refEntity: RefEntityType, search: ?string | ?Array<string>): Promise<Array<FieldOption>> => {
  const uri = buildRefOptionsQuery(refEntity, search)

  const itemToOption = (item) => ({
    id: item[refEntity.idAttribute],
    value: item[refEntity.idAttribute],
    label: item[refEntityLabelAttribute(refEntity)]
  })

  if (refOptionsCache[uri]) {
    return Promise.resolve(refOptionsCache[uri].items.map(itemToOption))
  }

  return api.get(uri).then(response => {
    refOptionsCache[uri] = response
    return response.items.map(itemToOption)
  })
}

/**
 * Uses the idAttribute, labelAttribute, and hrefCollection parameters of the refEntity
 * to check if current user is allowed to add option. Returns boolean true if allowed else false
 *
 * @param refEntity The refEntity of the attribute.
 * @param search An optional search query used to filter the items of the response
 * @return {Promise} Promise resulting in boolean
 */
const isUserAllowedAddOption = (refEntity: RefEntityType, search: ?string | ?Array<string>): Promise<boolean> => {
  const uri = buildRefOptionsQuery(refEntity, search)

  if (refOptionsCache[uri]) {
    return Promise.resolve(refOptionsCache[uri].meta.permissions.includes('ADD_DATA'))
  }

  return api.get(uri).then((response) => {
    refOptionsCache[uri] = response
    return refOptionsCache[uri].meta.permissions.includes('ADD_DATA')
  })
}

/**
 * Build a function that returns a Promise of an array containing objects of type FieldOption
 *
 * Simple types like STRING or TEXT do not have input properties, in this case 'null' is returned
 * The returned function returns a Promise of an array consisting of type FieldOption
 *
 * @example Example schema for generating field options
 * const schema = {
 *  fields: [
 *    {
 *      id: 'example',
 *      label: 'Example field',
 *      options: () => Promise.resolve([
 *          {
 *            id: '1',
 *            value: '1',
 *            label: 'Example option 1'
 *          },
 *          {
 *            id: '2',
 *            value: '2',
 *            label: 'Example option 2'
 *          }
 *        ]
 *    }
 *  ]
 * }
 *
 * @param attribute
 * @param options MapperOptions optional object containing options to configure mapper
 * @returns {Function|null} Function which returns a Promise representing an Array of FieldOptions
 */
const getFieldOptions = (attribute, options: MapperSettings): ?(() => Promise<Array<FieldOption>>) => {
  const fetchOptionsFunction = (search: ?string | Array<string>): Promise<Array<FieldOption>> => {
    return fetchFieldOptions(attribute.refEntity, search).then(response => {
      return response
    })
  }

  switch (attribute.fieldType) {
    case 'CATEGORICAL':
    case 'CATEGORICAL_MREF':
      if (attribute.categoricalOptions) {
        return () => Promise.resolve(attribute.categoricalOptions.map(option => {
          option.value = option.id
          return option
        }))
      } else {
        return fetchOptionsFunction
      }
    case 'ONE_TO_MANY':
    case 'XREF':
    case 'MREF':
      return fetchOptionsFunction
    case 'ENUM':
      const enumOptions = attribute.enumOptions.map(option => {
        return {
          id: option,
          value: option,
          label: option
        }
      })
      return (): Promise<Array<FieldOption>> => Promise.resolve(enumOptions)
    case 'BOOL':
      const boolOptions = [
        { id: 'true', value: true, label: options.booleanLabels.trueLabel },
        { id: 'false', value: false, label: options.booleanLabels.falseLabel }
      ]
      return (): Promise<Array<FieldOption>> => Promise.resolve(boolOptions)
    default:
      return null
  }
}

/**
 * Build a function that returns a Promise resulting in bool indicating if user is allowed to a an option
 *
 * @param attribute
 * @returns {Function} Function which returns a Promise indicating if user can add a option
 */
const buildIsAddAllowedFunction = (attribute): ?(() => Promise<boolean>) => {
  switch (attribute.fieldType) {
    case 'CATEGORICAL':
    case 'CATEGORICAL_MREF':
    case 'ONE_TO_MANY':
    case 'XREF':
    case 'MREF':
      return (search: ?string | Array<string>): Promise<boolean> => {
        return isUserAllowedAddOption(attribute.refEntity, search).then(response => {
          return response
        })
      }
    default:
      return () => Promise.resolve(false)
  }
}

/**
 * Translate MOLGENIS attribute types to HTML field types
 *
 * @private
 * @param fieldType Attribute type e.g. STRING, XREF etc...
 * @returns {String} HTML type e.g. text, number, select etc...
 */
const getHtmlFieldType = (fieldType: EntityFieldType): HtmlFieldType => {
  switch (fieldType) {
    case 'BOOL':
    case 'CATEGORICAL':
    case 'ENUM':
      return 'radio'
    case 'XREF':
      return 'single-select'
    case 'ONE_TO_MANY':
    case 'MREF':
      return 'multi-select'
    case 'INT':
      return 'integer'
    case 'DECIMAL':
      return 'decimal'
    case 'LONG':
      return 'long'
    case 'TEXT':
      return 'text-area'
    case 'SCRIPT':
      return 'script'
    case 'HTML':
      return 'html'
    case 'DATE':
      return 'date'
    case 'DATE_TIME':
      return 'date-time'
    case 'CATEGORICAL_MREF':
      return 'checkbox'
    case 'STRING':
      return 'text'
    case 'HYPERLINK':
      return 'hyperlink'
    case 'EMAIL':
      return 'email'
    case 'FILE':
      return 'file'
    case 'COMPOUND':
      return 'field-group'
    default:
      throw new MappingException(`unknown fieldType (${fieldType})`)
  }
}

/**
 * Construct function that queries backend to check for uniqueness.
 * Returned function is expected to the called with resolve and reject functions to handle async callback and
 * proposedValue to verify uniqueness for. When runnig the mapper in update mode the optional data param is expected to
 * contain the id value of the entity to be updated.
 * @param attribute
 * @param entityMetadata
 * @param mapperOptions
 * @returns {*}
 */
const buildIsUniqueFunction = (attribute, entityMetadata: any, mapperOptions: MapperSettings): (() => Promise<boolean>) => {
  // no need to check uniqueness if uniqueness is not required, or uniqueness check not supported for field type
  // todo maybe add support for multi value field types
  if (!attribute.unique || attribute.fieldType === 'CATEGORICAL_MREF' || attribute.fieldType === 'MREF' || attribute.fieldType === 'ONE_TO_MANY') {
    return () => Promise.resolve(true)
  }

  return (proposedValue: any, data: any) => {
    return new Promise((resolve, reject) => {
      let query = { selector: attribute.name, comparison: '==', arguments: proposedValue }
      if (mapperOptions.mapperMode === 'UPDATE') {
        query = {
          operator: 'AND',
          operands: [
            query,
            {
              selector: entityMetadata.idAttribute,
              comparison: '!=',
              arguments: data[entityMetadata.idAttribute] // to validate uniqueness in update mode there must be a id value present
            }
          ]
        }
      }

      const testUniqueUrl = entityMetadata.hrefCollection + '?&num=1&q=' + encodeRsqlValue(transformToRSQL(query))
      return api.get(testUniqueUrl).then((response) => {
        resolve(response.items.length <= 0)
      }, (error) => {
        reject(error)
      })
    })
  }
}

/**
 * Determine if field should be disabled
 * @param attribute
 * @param entityMetaData
 * @param mapperOptions
 * @returns boolean
 */
const isDisabledField = (attribute, entityMetaData, mapperOptions: MapperSettings): boolean => {
  if (attribute.fieldType === 'ONE_TO_MANY') {
    return true
  }

  if (mapperOptions.mapperMode === 'CREATE') {
    return false
  }

  if (mapperOptions.mapperMode === 'UPDATE' && attribute.name === entityMetaData.idAttribute) {
    return true
  }

  return attribute.readOnly
}

/**
 * Generate a schema field object suitable for the forms
 *
 * @param attribute Attribute metadata from an EntityType V2 response
 * @param entityMetadata object containing entityMetadata
 * @param mapperOptions MapperOptions optional object containing options to configure mapper
 * @returns {{type: String, id, label, description, required: boolean, disabled, visible, options: ({uri, id, label, multiple}|{uri, id, label})}}
 */
const generateFormSchemaField = (attribute, entityMetadata:any, mapperOptions: MapperSettings): FormField => {
  // options is a function that always returns an array of option objects
  const options = getFieldOptions(attribute, mapperOptions)
  const isDisabled = isDisabledField(attribute, entityMetadata, mapperOptions)
  let fieldProperties = {
    id: attribute.name,
    label: attribute.label,
    description: attribute.description,
    type: getHtmlFieldType(attribute.fieldType),
    required: isRequired(attribute),
    disabled: isDisabled,
    readOnly: isDisabled,
    visible: isVisible(attribute, mapperOptions),
    validate: isValid(attribute),
    unique: buildIsUniqueFunction(attribute, entityMetadata, mapperOptions),
    isAddOptionAllowed: buildIsAddAllowedFunction(attribute)
  }

  if (attribute.fieldType === 'COMPOUND') {
    const children = attribute.attributes.map(attribute => generateFormSchemaField(attribute, entityMetadata, mapperOptions))
    fieldProperties = { ...fieldProperties, children }
  }

  if ((attribute.fieldType === 'INT' || attribute.fieldType === 'LONG') && attribute.range) {
    let range = {}
    if (attribute.range.hasOwnProperty('min')) {
      range.min = attribute.range.min
    }
    if (attribute.range.hasOwnProperty('max')) {
      range.max = attribute.range.max
    }

    fieldProperties = { ...fieldProperties, range }
  }

  return options ? { ...fieldProperties, options } : fieldProperties
}

const toISO8601DateString = (molgenisDate: string) => moment(molgenisDate, moment.ISO_8601, true).format('YYYY-MM-DD')

const getFieldValue = (fieldType: HtmlFieldType, fieldData: any, refEntityIdAttribute: string) => {
  switch (fieldType) {
    case 'file':
      return fieldData ? fieldData.filename : undefined
    case 'checkbox':
    case 'multi-select':
      return fieldData && fieldData.map(data => data[refEntityIdAttribute])
    case 'radio':
    case 'single-select':
      return fieldData && typeof fieldData === 'object' ? fieldData[refEntityIdAttribute] : fieldData
    case 'date':
      return fieldData && toISO8601DateString(fieldData)
    default:
      return fieldData
  }
}

const getDefaultValue = (fieldType: EntityFieldType, defaultValue: any) => {
  switch (fieldType) {
    case 'BOOL':
      return defaultValue === 'true' ? true : defaultValue === 'false' ? false : defaultValue === 'null' ? null : undefined
    case 'CATEGORICAL_MREF':
    case 'MREF':
      return defaultValue && defaultValue.split(',').map(item => item.trim())
    case 'DATE':
      return defaultValue && toISO8601DateString(defaultValue)
    default:
      return defaultValue
  }
}

/**
 * Generates a data object suitable for the forms
 * Recursively calls itself when a field of type "field-group" is present
 * "field-group" fields do not have data, only their children do
 *
 * @param fields an array of field objects
 * @param data a data object containing everything a EntityType V2 response has in its item list
 * @param attributes an array of MOLGENIS attribute metadata, used for idAttribute
 * @param options Object containing settings for the mapper
 * @returns a {fieldId: value} object
 */
const generateFormData = (fields: any, data: any, attributes: any, options: MapperSettings) => {
  return attributes.reduce((accumulator, attribute) => {
    const field = fields.find(field => attribute.name === field.id)
    const idAttribute = attribute.refEntity && attribute.refEntity.idAttribute

    if (!field) {
      accumulator[attribute.name] = data[attribute.name]
      return accumulator
    }

    if (field.type === 'field-group') {
      return { ...accumulator, ...generateFormData(field.children, data, attribute.attributes, options) }
    }

    accumulator[field.id] = options.mapperMode === 'CREATE'
      ? getDefaultValue(attribute.fieldType, attribute.defaultValue)
      : getFieldValue(field.type, data[field.id], idAttribute)

    return accumulator
  }, {})
}

/**
 * Returns true if entity attribute should be included in form
 *
 * @param attribute
 * @param options
 * @returns {boolean}
 */
const isFormFieldAttribute = (attribute: any, options: MapperSettings): boolean => {
  return !(
    (options.mapperMode === 'CREATE' ? attribute.auto : attribute.auto && !attribute.visible) || // server side generated field
    (attribute.hasOwnProperty('expression') && attribute.expression.length > 0) // computed field
  )
}

/**
 * Generates an array for form fields
 *
 * @param metaData object containing the entity metaData
 * @param options MapperOptions object containing options to configure mapper
 * @returns a an array of Field objects
 */
const generateFormFields = (metaData: any, options: MapperSettings): Array<FormField> => {
  const { attributes, ...entityMetadata } = metaData
  return attributes
    .filter((attr) => {
      return isFormFieldAttribute(attr, options)
    })
    .map((attr) => {
      return generateFormSchemaField(attr, entityMetadata, options)
    })
}

/**
 * Construct mapper settings taking into account the user settings, if no settings are passed the defaults are used
 * @param settings
 * @returns {{mapperMode: *, booleanLabels: {trueLabel: string, falseLabel: string, nillLabel: string}}}
 */
const buildMapperSettings = (settings?: MapperOptions): MapperSettings => {
  if (!settings) {
    return DEFAULTS
  }

  const mapperMode = settings.mapperMode ? settings.mapperMode : DEFAULTS.mapperMode

  let booleanLabels = DEFAULTS.booleanLabels
  if (settings.booleanLabels) {
    booleanLabels = {
      trueLabel: settings.booleanLabels.trueLabel ? settings.booleanLabels.trueLabel : 'True',
      falseLabel: settings.booleanLabels.falseLabel ? settings.booleanLabels.falseLabel : 'False'
    }
  }

  let showNonVisibleAttributes = DEFAULTS.showNonVisibleAttributes
  if (typeof (settings.showNonVisibleAttributes) === 'boolean') {
    showNonVisibleAttributes = settings.showNonVisibleAttributes
  }

  return {
    mapperMode,
    booleanLabels,
    showNonVisibleAttributes
  }
}

/**
 * Generates both fields and data objects for rendering a form
 *
 * @param metadata MOLGENIS metadata, containing attributes
 * @param data
 * @param userSettings MapperOptions optional object containing options to configure mapper
 * @returns {{formFields: Array<FormField>, formData: *}}
 */
const generateForm = (metadata: any, data: ?any, userSettings?: MapperOptions) => {
  const mapperSettings = buildMapperSettings(userSettings)
  const formFields = generateFormFields(metadata, mapperSettings)
  const formData = generateFormData(formFields, data || {}, metadata.attributes, mapperSettings)

  return {
    formFields,
    formData
  }
}

export default {
  generateForm
}

const templateFormField = {
  label: 'Some Field',
  description: 'Type "1-234" to remove the error',
  type: 'string',
  required: () => false,
  validate: () => true
}

export const expressionValidationFormFields = [
  {
    ...templateFormField,
    id: 'expression-validation-error-field',
    visible: (formData) => {
      if (formData['expression-validation-error-field'] !== '1-234') {
        throw new Error('input not equal 1-234')
      } else {
        return true
      }
    }
  },
  {
    ...templateFormField,
    id: 'expression-validation-error-field-other',
    visible: (formData) => {
      if (formData['expression-validation-error-field-other'] !== '1-234') {
        throw new Error('input not equal 1-234')
      } else {
        return true
      }
    }
  }
]

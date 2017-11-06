/**
 * Run all validators from a field against the value present in that field
 *
 * @param validators
 * @param value
 * @returns {boolean}
 */
const run = (validators, value) => {
  if (validators.length > 0) {
    let valid = true

    validators.forEach(validator => {
      valid = validator(value)
    })

    return valid
  } else {
    return true
  }
}

export default {
  run
}
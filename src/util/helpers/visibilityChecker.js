/**
 * Checks whether a compound should be shown based on the visibility of its children
 *
 * @param field the compound field
 * @param data the entire data of the form
 */
const isCompoundVisible = (field, data) => {
  return field.children.some(child => {
    if (child.type === 'field-group') {
      return isCompoundVisible(child, data)
    }
    return child.visible(data)
  })
}

export default {
  isCompoundVisible
}

import api from '@molgenis/molgenis-api-client'

/**
 * Helper function for deciding if this field need to be a PseudonymRegistrationComponent
 *
 * @param field
 * @returns {Function} Function which evaluates to a boolean
 */
const isPseudonymRegistrationComponent = (field) => {
  return field.tags && field.tags.length > 0 && field.tags.findIndex(tag => tag.objectIRI === 'http://purl.obolibrary.org/obo/NCIT_C142654') !== -1
}

const requestConfiguration = (id) => api.get(`/api/v2/PseudonymRegistrationConfig?q=ID=like=${id}`)

const submitPseudonymRegistration = async (config, options, id) => {
  let requestID = null
  try {
    await api.post(`/api/data/${config.LinkEntityName}`, options).then(async response => {
      if (response.status === 201) {
        // We generated a new id, lets get it and store it in the create form
        await api.get(`/api/data/${config.LinkEntityName}?q=${config.FieldName}==${id}`).then(response => {
          requestID = response.items[0].data.ID
        }, (error) => {
          throw new Error(`Error: ${error.statusText} Please contact a system administator`)
        })
      }
    }, async error => {
      if (error.status === 400) {
        // This id may already exist, lets check for it.
        let preExistingId = ''
        await api.get(`/api/data/${config.LinkEntityName}?q=${config.FieldName}==${id}`).then(response => {
          preExistingId = response.items[0].data.ID
          if (preExistingId !== '') {
            throw new Error(`This reccord already exist with the id: ${preExistingId}`)
          } else {
            throw new Error(`Error: Please contact a system administator`)
          }
        }, (error) => {
          throw new Error(`Error: ${error.statusText} Please contact a system administator`)
        })
      } else {
        throw new Error(`Error: ${error.statusText} Please contact a system administator`)
      }
    })
  } catch (error) {
    await Promise.reject(error.toString())
  }
  return requestID
}

export default {
  isPseudonymRegistrationComponent, requestConfiguration, submitPseudonymRegistration
}

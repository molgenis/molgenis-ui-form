import api from '@molgenis/molgenis-api-client'

/**
 * Helper function for deciding if this field need to be a PseudonymRegistrationComponent
 *
 * @param field
 * @returns {Function} Function which evaluates to a boolean
 */
const isPseudonymRegistrationComponent = (field) => {
  return field.hasOwnProperty('tags') && field.tags.length > 0 && field.tags.findIndex(tag => tag.objectIRI === 'http://purl.obolibrary.org/obo/NCIT_C142654') !== -1
}

const requestConfiguration = (id) => api.get(`/api/v2/PseudonymRegistrationConfig?q=ID=like=${id}`)

const submitPseudonymRegistration = async (config, originalID) => {
  console.log(config)
  let requestID = null
  const postOptions = { body: JSON.stringify({ OriginalID: originalID }) }
  try {
    await api.post(`/api/data/${config.LinkEntityName}`, postOptions).then(async response => {
      if (response.status === 201) {
        requestID = await getNewPseudonym(config, originalID)
      }
    }, async error => {
      if (error.status === 400) {
        checkForDuplicateID(config, originalID)
      } else {
        throw new Error(`${error.statusText} Please contact a system administator`)
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

const getNewPseudonym = async (config, originalID) => {
  let newPseudonym = null
  await api.get(`/api/data/${config.LinkEntityName}?q=${config.FieldName}==${originalID}`).then(response => {
    newPseudonym = response.items[0].data.ID
  }, (error) => {
    throw new Error(`${error.statusText} Please contact a system administator`)
  })
  return newPseudonym
}

const checkForDuplicateID = async (config, originalID) => {
  await api.get(`/api/data/${config.LinkEntityName}?q=${config.FieldName}==${originalID}`).then(response => {
    const preExistingId = response.items[0].data.ID
    if (preExistingId !== '') {
      throw new Error(`This record already exist with the id: ${preExistingId}`)
    } else {
      throw new Error(`Error: Please contact a system administator`)
    }
  }, (error) => {
    throw new Error(`${error.statusText} Please contact a system administator`)
  })
}

import api from '@molgenis/molgenis-api-client'
import pseudonymRegistration from '@/util/helpers/pseudonymRegistration'
import td from 'testdouble'

td.reset()
const get = td.function('api.get')
td.when(get('/api/v2/PseudonymRegistrationConfig?q=ID=like=ID')).thenResolve('ok')
td.replace(api, 'get', get)

/*
const submitPseudonymRegistration = async (config, options, id) => {
*/
describe.only('pseudonymRegistration helper tests', () => {
  describe('requestConfiguration', (done) => {
    it('should get the PseudonymRegistration configuration', () => {
      pseudonymRegistration.requestConfiguration('ID').then((result) => {
        expect(result).to.equal('ok')
        done()
      })
    })
  })

  describe('isPseudonymRegistrationComponent', () => {
    it('should find out if this field has a PseudonymRegistration tag', () => {
      expect(pseudonymRegistration.isPseudonymRegistrationComponent(
        {
          tags: [
            {
              objectIRI: 'http://purl.obolibrary.org/obo/NCIT_C142654'
            }
          ]
        }
      )).to.equal(true)
      expect(pseudonymRegistration.isPseudonymRegistrationComponent({
        tags: [
          {
            objectIRI: 'http://molgenis.org'
          }
        ]
      })).to.equal(false)
      expect(pseudonymRegistration.isPseudonymRegistrationComponent({ other: 'props' })).to.equal(false)
    })
  })
})

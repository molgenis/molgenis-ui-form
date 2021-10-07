import api from '@molgenis/molgenis-api-client'
import pseudonymRegistration from '@/util/helpers/pseudonymRegistration'
import td from 'testdouble'

describe('pseudonymRegistration helper tests', () => {
  beforeEach(() => {
    td.reset()
    const get = td.function('api.get')
    const post = td.function('api.post')
    td.when(get('/api/v2/PseudonymRegistrationConfig?q=ID=like=ID')).thenResolve('ok')
    td.when(post('/api/data/LinkEntityName', { body: 'data' })).thenResolve({ status: 201 })
    td.when(get('/api/data/LinkEntityName?q=FieldName==ID')).thenResolve({ items: [{ data: { ID: 'GENERATED_ID' } }] })
    td.replace(api, 'get', get)
    td.replace(api, 'post', post)
  })

  describe('submitPseudonymRegistration', () => {
    let config = {
      FieldName: 'FieldName',
      LinkEntityName: 'LinkEntityName'
    }
    it('should save the new ID en generate a Pseudonym registration ID', (done) => {
      pseudonymRegistration.submitPseudonymRegistration(config, { body: 'data' }, 'ID').then(ID => {
        console.log(ID)
        expect(ID).to.equal('GENERATED_ID')
        done()
      })
    })
  })

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

import api from '@molgenis/molgenis-api-client'
import pseudonymRegistration from '@/util/helpers/pseudonymRegistration'
import td from 'testdouble'

describe('pseudonymRegistration helper tests', () => {
  let config = {
    FieldName: 'FieldName',
    LinkEntityName: 'LinkEntityName'
  }
  let get
  let post

  beforeEach(() => {
    get = td.function('api.get')
    post = td.function('api.post')
    td.replace(api, 'get', get)
    td.replace(api, 'post', post)
  })

  afterEach(() => {
    td.reset()
  })

  describe('Happy flow 😊', () => {
    beforeEach(() => {
      td.when(get('/api/v2/PseudonymRegistrationConfig?q=ID=like=ID')).thenResolve('ok')
      td.when(post('/api/data/LinkEntityName', { body: '{"OriginalID":"ID"}' })).thenResolve({ status: 201 })
      td.when(get('/api/data/LinkEntityName?q=FieldName==ID'))
        .thenResolve({ items: [{ data: { ID: 'GENERATED_ID' } }] })
    })

    describe('submitPseudonymRegistration', () => {
      it('should save the new ID en generate a Pseudonym registration ID', (done) => {
        pseudonymRegistration.submitPseudonymRegistration(config, 'ID').then(ID => {
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
  describe('Sad flow 😥', () => {
    describe('submitPseudonymRegistration', () => {
      it('should after creating a new pseudonym throw a error if then new id could not be retrieved', (done) => {
        td.when(post('/api/data/LinkEntityName', { body: '{"OriginalID":"ID"}' }))
          .thenResolve({ status: 201 })
        td.when(get('/api/data/LinkEntityName?q=FieldName==ID'))
          .thenReject({ statusText: 'failed' })
        pseudonymRegistration.submitPseudonymRegistration(config, 'ID').then(() => {}, (error) => {
          expect(error).to.equal('Error: failed Please contact a system administrator')
          done()
        })
      })

      it('should throw an error if the server response is not created (201) ', (done) => {
        td.when(post('/api/data/LinkEntityName', { body: '{"OriginalID":"ID"}' }))
          .thenResolve({ status: 200 })
        pseudonymRegistration.submitPseudonymRegistration(config, 'ID').then(() => {}, (error) => {
          expect(error).to.equal('Error: Unexpected status code 200')
          done()
        })
      })

      it('should fail with an error message when server replies with a non bad request (400)', (done) => {
        td.when(post('/api/data/LinkEntityName', { body: '{"OriginalID":"ID"}' }))
          .thenReject({ status: 500, statusText: 'Internal server error' })
        pseudonymRegistration.submitPseudonymRegistration(config, 'ID').then(() => {}, (error) => {
          expect(error).to.equal('Error: Internal server error Please contact a system administrator')
          done()
        })
      })

      describe('when server replies with bad request (400)', (done) => {
        beforeEach(() => {
          td.when(post('/api/data/LinkEntityName', { body: '{"OriginalID":"ID"}' }))
            .thenReject({ status: 400, statusText: 'Internal server error' })
        })
        it('should return an error with the preexisting ID', (done) => {
          td.when(get('/api/data/LinkEntityName?q=FieldName==ID'))
            .thenResolve({ items: [{ data: { ID: 'duplicate' } }] })
          pseudonymRegistration.submitPseudonymRegistration(config, 'ID').then(() => {}, (error) => {
            expect(error).to.equal('Error: This record already exist with the id: duplicate')
            done()
          })
        })
        it('should return an error if no duplicate id was found', (done) => {
          td.when(get('/api/data/LinkEntityName?q=FieldName==ID'))
            .thenResolve({ items: [{ data: { ID: '' } }] })
          pseudonymRegistration.submitPseudonymRegistration(config, 'ID').then(() => {}, (error) => {
            expect(error).to.equal('Error: Please contact a system administrator')
            done()
          })
        })
        it('should return an error if the server returns an error while getting an id', (done) => {
          td.when(get('/api/data/LinkEntityName?q=FieldName==ID'))
            .thenReject({ statusText: 'Some error' })
          pseudonymRegistration.submitPseudonymRegistration(config, 'ID').then(() => {}, (error) => {
            expect(error).to.equal('Error: Some error Please contact a system administrator')
            done()
          })
        })
      })
    })
  })
})

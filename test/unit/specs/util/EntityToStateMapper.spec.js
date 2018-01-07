// import EntityToStateMapper from '@/util/EntityToStateMapper'
// import td from 'testdouble'
// import api from '@molgenis/molgenis-api-client'
//
// import * as schemas from './test-schemas'
//
// const response = {
//   items: [
//     {value: 'ref1', label: 'label1'},
//     {value: 'ref2', label: 'label2'},
//     {value: 'ref3', label: 'label3'}
//   ]
// }
//
// const get = td.function('api.get')
// td.when(get('/api/v1/it_emx_datatypes_TypeTestRef')).thenResolve(response)
// td.replace(api, 'get', get)
//
// describe('Entity to state mapper', () => {
//   describe('General functions', () => {
//     it('should throw an error for an unknown fieldType', () => {
//       const invalidSchema = {
//         attributes: [{
//           'fieldType': 'NON_EXISTING_TYPE'
//         }]
//       }
//
//       const result = () => {
//         EntityToStateMapper.generateFormFields(invalidSchema)
//       }
//
//       expect(result).to.throw('unknown fieldType (NON_EXISTING_TYPE)')
//     })
//   })
//
//   describe('Generate form fields and data for a [STRING] attribute', () => {
//     it('should map a [STRING] attribute to a form field object', () => {
//       const fields = EntityToStateMapper.generateFormFields(schemas.stringSchema)
//
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('text')
//       expect(field.id).to.equal('string')
//       expect(field.label).to.equal('String Field')
//       expect(field.description).to.equal('STRING description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//       expect(field.inputProperties).to.equal(undefined)
//       expect(field.required({'text': 'not test'})).to.equal(true)
//       expect(field.required({'text': 'test'})).to.equal(false)
//       expect(field.validators[0]({'string': 'valid'})).to.deep.equal({valid: true, message: null})
//       expect(field.validators[0]({'string': 'not valid'})).to.deep.equal({valid: false, message: 'Invalid value!'})
//     })
//
//     it('should map a [STRING] attribute with a visible expression to a form field object ', () => {
//       const fields = EntityToStateMapper.generateFormFields(schemas.stringSchemaWithVisibleExpression)
//
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('text')
//       expect(field.id).to.equal('string')
//       expect(field.label).to.equal('String Field')
//       expect(field.description).to.equal('STRING description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible({'string': 'hide me'})).to.deep.equal(false)
//     })
//
//     it('should map a [STRING] entity to a form data object', () => {
//       const fields = EntityToStateMapper.generateFormFields(schemas.stringSchema)
//       const data = {string: 'string value'}
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//
//       expect(formData).to.deep.equal({string: 'string value'})
//     })
//   })
//
//   describe('Generate form fields and data for a [EMAIL] attribute', () => {
//     const fields = EntityToStateMapper.generateFormFields(schemas.emailSchema)
//     const data = {email: 'foobar@molgenis.org'}
//
//     it('should map a [EMAIL] attribute to a form field object', () => {
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('email')
//       expect(field.id).to.equal('email')
//       expect(field.label).to.equal('Email Field')
//       expect(field.description).to.equal('Email description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//     })
//
//     it('should map a [EMAIL] entity to a form data object', () => {
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//       expect(formData).to.deep.equal({email: 'foobar@molgenis.org'})
//     })
//   })
//
//   describe('Generate form fields and data for a [TEXT] attribute', () => {
//     const fields = EntityToStateMapper.generateFormFields(schemas.textSchema)
//     const data = {text: 'text value'}
//
//     it('should map a [TEXT] attribute to a form field object', () => {
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('text-area')
//       expect(field.id).to.equal('text')
//       expect(field.label).to.equal('Text Field')
//       expect(field.description).to.equal('TEXT description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//       expect(field.inputProperties).to.equal(undefined)
//     })
//
//     it('should map a [TEXT] entity to a form data object', () => {
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//       expect(formData).to.deep.equal({text: 'text value'})
//     })
//   })
//
//   describe('Generate form fields and data for a [BOOLEAN] attribute', () => {
//     it('should map a [BOOLEAN] attribute to a form field object', done => {
//       const fields = EntityToStateMapper.generateFormFields(schemas.booleanSchema)
//
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('radio')
//       expect(field.id).to.equal('boolean')
//       expect(field.label).to.equal('Boolean Field')
//       expect(field.description).to.equal('Boolean description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//       expect(typeof field.options).to.equal('function')
//
//       field.options().then(response => {
//         expect(response).to.deep.equal([
//           {id: 'true', value: true, label: 'True'},
//           {id: 'false', value: false, label: 'False'}
//         ])
//         done()
//       })
//     })
//
//     it('should map a nillable [BOOLEAN] attribute to a form field object', done => {
//       const fields = EntityToStateMapper.generateFormFields(schemas.booleanSchemaNillable)
//
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('radio')
//       expect(field.id).to.equal('boolean')
//       expect(field.label).to.equal('Boolean Field')
//       expect(field.description).to.equal('Boolean description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//       expect(typeof field.options).to.equal('function')
//
//       field.options().then(response => {
//         expect(response).to.deep.equal([
//           {id: 'true', value: true, label: 'True'},
//           {id: 'false', value: false, label: 'False'},
//           {id: 'null', value: 'null', label: 'N/A'}
//         ])
//         done()
//       })
//     })
//
//     it('should map a [BOOLEAN] entity to a form data object', () => {
//       const fields = EntityToStateMapper.generateFormFields(schemas.booleanSchema)
//       const data = {boolean: false}
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//
//       expect(formData).to.deep.equal({boolean: false})
//     })
//   })
//
//   describe('Generate form fields and data for a [INT] attribute', () => {
//     const fields = EntityToStateMapper.generateFormFields(schemas.intSchema)
//     const data = {integer: 99}
//
//     it('should map a [INT] attribute to a form field object', () => {
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('number')
//       expect(field.id).to.equal('integer')
//       expect(field.label).to.equal('Integer Field')
//       expect(field.description).to.equal('Integer description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//     })
//
//     it('should map a [INT] entity to a form data object', () => {
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//       expect(formData).to.deep.equal({integer: 99})
//     })
//   })
//
//   describe('Generate form fields and data for a [LONG] attribute', () => {
//     const fields = EntityToStateMapper.generateFormFields(schemas.longSchema)
//     const data = {long: 2147483648} // max java int + 1
//
//     it('should map a [LONG] attribute to a form field object', () => {
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('number')
//       expect(field.id).to.equal('long')
//       expect(field.label).to.equal('Long Field')
//       expect(field.description).to.equal('Long description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//     })
//
//     it('should map a [LONG] entity to a form data object', () => {
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//       expect(formData).to.deep.equal({long: 2147483648})
//     })
//   })
//
//   describe('Generate form fields and data for a [DECIMAL] attribute', () => {
//     const fields = EntityToStateMapper.generateFormFields(schemas.decimalSchema)
//     const data = {decimal: 0.205}
//
//     it('should map a [DECIMAL] attribute to a form field object', () => {
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('number')
//       expect(field.id).to.equal('decimal')
//       expect(field.label).to.equal('Decimal Field')
//       expect(field.description).to.equal('Decimal description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//     })
//
//     it('should map a [DECIMAL] entity to a form data object', () => {
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//       expect(formData).to.deep.equal({decimal: 0.205})
//     })
//   })
//
//   describe('Generate form fields and data for a [FILE] attribute', () => {
//     const fields = EntityToStateMapper.generateFormFields(schemas.fileSchema)
//     const data = {
//       file: {
//         'href': '/api/v1/sys_FileMeta/aaa123bbb',
//         'id': 'aaa123bbb',
//         'filename': 'foo.txt',
//         'contentType': 'text/plain',
//         'size': 5,
//         'url': 'https://someserver/files/api',
//         'ownerUsername': 'admin'
//       }
//     }
//
//     it('should map a [FILE] attribute to a form field object', () => {
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('file')
//       expect(field.id).to.equal('file')
//       expect(field.label).to.equal('File Field')
//       expect(field.description).to.equal('File description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//     })
//
//     it('should map a [FILE] entity to a form data object', () => {
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//       expect(formData).to.deep.equal({
//         file: {
//           'href': '/api/v1/sys_FileMeta/aaa123bbb',
//           'id': 'aaa123bbb',
//           'filename': 'foo.txt',
//           'contentType': 'text/plain',
//           'size': 5,
//           'url': 'https://someserver/files/api',
//           'ownerUsername': 'admin'
//         }
//       })
//     })
//   })
//
//   describe('Generate form fields and data for a [HTML] attribute', () => {
//     const fields = EntityToStateMapper.generateFormFields(schemas.htmlSchema)
//     const data = {html: '<p>gloves on</p>'}
//
//     it('should map a [HTML] attribute to a form field object', () => {
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('text-area')
//       expect(field.id).to.equal('html')
//       expect(field.label).to.equal('Html Field')
//       expect(field.description).to.equal('Html description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//     })
//
//     it('should map a [HTML] entity to a form data object', () => {
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//       expect(formData).to.deep.equal({html: '<p>gloves on</p>'})
//     })
//   })
//
//   describe('Generate form fields and data for a [HYPERLINK] attribute', () => {
//     const fields = EntityToStateMapper.generateFormFields(schemas.hyperlinkSchema)
//     const data = {hyperlink: 'https://google.com'}
//
//     it('should map a [HYPERLINK] attribute to a form field object', () => {
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('url')
//       expect(field.id).to.equal('hyperlink')
//       expect(field.label).to.equal('Hyperlink Field')
//       expect(field.description).to.equal('Hyperlink description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//     })
//
//     it('should map a [HYPERLINK] entity to a form data object', () => {
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//       expect(formData).to.deep.equal({hyperlink: 'https://google.com'})
//     })
//   })
//
//   describe('Generate form fields and data for a [ENUM] attribute', () => {
//     it('should map a [ENUM] attribute to a form field object', done => {
//       const fields = EntityToStateMapper.generateFormFields(schemas.enumSchema)
//
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('radio')
//       expect(field.id).to.equal('enum')
//       expect(field.label).to.equal('Enum Field')
//       expect(field.description).to.equal('Enum description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//       expect(typeof field.options).to.equal('function')
//
//       field.options().then(response => {
//         expect(response).to.deep.equal([
//           {id: 'enum1', value: 'enum1', label: 'enum1'},
//           {id: 'enum2', value: 'enum2', label: 'enum2'},
//           {id: 'enum3', value: 'enum3', label: 'enum3'},
//           {id: 'null', value: 'null', label: 'N/A'}
//         ])
//         done()
//       })
//     })
//
//     it('should map a nillable [ENUM] attribute to a form field object', done => {
//       const fields = EntityToStateMapper.generateFormFields(schemas.enumSchemaNillable)
//
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('radio')
//       expect(field.id).to.equal('enum')
//       expect(field.label).to.equal('Enum Field')
//       expect(field.description).to.equal('Enum description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//       expect(typeof field.options).to.equal('function')
//
//       field.options().then(response => {
//         expect(response).to.deep.equal([
//           {id: 'enum1', value: 'enum1', label: 'enum1'},
//           {id: 'enum2', value: 'enum2', label: 'enum2'},
//           {id: 'enum3', value: 'enum3', label: 'enum3'}
//         ])
//         done()
//       })
//     })
//
//     it('should map a [ENUM] entity to a form data object', () => {
//       const fields = EntityToStateMapper.generateFormFields(schemas.enumSchema)
//       const data = {enum: 'enum1'}
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//
//       expect(formData).to.deep.equal({enum: 'enum1'})
//     })
//   })
//
//   describe('Generate form fields and data for a [DATE] attribute', () => {
//     const fields = EntityToStateMapper.generateFormFields(schemas.dateSchema)
//     const data = {date: '1947/04/07'}
//
//     it('should map a [DATE] attribute to a form field object', () => {
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('date')
//       expect(field.id).to.equal('date')
//       expect(field.label).to.equal('Date Field')
//       expect(field.description).to.equal('Date description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//     })
//
//     it('should map a [DATE] entity to a form data object', () => {
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//       expect(formData).to.deep.equal({date: '1947/04/07'})
//     })
//   })
//
//   describe('Generate form fields and data for a [DATE_TIME] attribute', () => {
//     const fields = EntityToStateMapper.generateFormFields(schemas.dateTimeSchema)
//     const data = {datetime: '1985-08-12T11:12:13+0500'}
//
//     it('should map a [DATE_TIME] attribute to a form field object', () => {
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('date-time')
//       expect(field.id).to.equal('datetime')
//       expect(field.label).to.equal('Date and time Field')
//       expect(field.description).to.equal('Date and time description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//     })
//
//     it('should map a [DATE_TIME] entity to a form data object', () => {
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//       expect(formData).to.deep.equal({datetime: '1985-08-12T11:12:13+0500'})
//     })
//   })
//
//   describe('Generate form fields and data for a [CATEGORICAL] attribute', () => {
//     const fields = EntityToStateMapper.generateFormFields(schemas.categoricalSchema)
//     const data = {categorical: 'ref1'}
//
//     it('should map a [CATEGORICAL] attribute to a form field object', done => {
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('radio')
//       expect(field.id).to.equal('categorical')
//       expect(field.label).to.equal('Categorical Field')
//       expect(field.description).to.equal('Categorical description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//       expect(typeof field.options).to.equal('function')
//
//       field.options().then(response => {
//         expect(response).to.deep.equal([
//           {id: 'ref1', value: 'ref1', label: 'label1'},
//           {id: 'ref2', value: 'ref2', label: 'label2'},
//           {id: 'ref3', value: 'ref3', label: 'label3'}
//         ])
//         done()
//       })
//     })
//
//     it('should map a [CATEGORICAL] entity to a form data object', () => {
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//       expect(formData).to.deep.equal({categorical: 'ref1'})
//     })
//   })
//
//   describe('Generate form fields and data for a [CATEGORICAL_MREF] attribute', () => {
//     const fields = EntityToStateMapper.generateFormFields(schemas.categoricalMrefSchema)
//     const data = {categorical_mref: 'ref1'}
//
//     it('should map a [CATEGORICAL_MREF] attribute to a form field object', done => {
//       expect(fields.length).to.equal(1)
//       const field = fields[0]
//       expect(field.type).to.equal('checkbox')
//       expect(field.id).to.equal('categorical_mref')
//       expect(field.label).to.equal('Categorical MREF Field')
//       expect(field.description).to.equal('Categorical MREF description')
//       expect(field.disabled).to.equal(false)
//       expect(field.readOnly).to.equal(false)
//       expect(field.visible).to.equal(true)
//       expect(typeof field.options).to.equal('function')
//
//       field.options().then(response => {
//         expect(response).to.deep.equal([
//           {id: 'ref1', value: 'ref1', label: 'label1'},
//           {id: 'ref2', value: 'ref2', label: 'label2'},
//           {id: 'ref3', value: 'ref3', label: 'label3'}
//         ])
//         done()
//       })
//     })
//
//     it('should map a [CATEGORICAL_MREF] entity to a form data object', () => {
//       const formData = EntityToStateMapper.generateFormData(fields, data)
//       expect(formData).to.deep.equal({categorical_mref: 'ref1'})
//     })
//   })
// })

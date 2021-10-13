const mockResponse = require('./mockResponse.js')

module.exports = {
  getPseudonymRegistrationConfig,
  postPseudonymConnector,
  getPseudonymConnector,
  getV1TypeTestRef,
  getV2TypeTestRef,
  getLocalization,
  getTypeTest
}

function getPseudonymRegistrationConfig (_request, response) {
  response.json(
    {
      'items': [
        {
          'ID': 'PseudonymRegistration',
          'GeneratedTokenDescription': 'MyPseudonymID is cool for lost of reasons',
          'GeneratedTokenName': 'MyPseudonymID',
          'LinkEntityName': 'PseudonymConnector',
          'FieldName': 'OriginalID'
        }
      ]
    }
  )
}

function postPseudonymConnector (request, response) {
  let body = []
  request.on('data', (chunk) => {
    body.push(chunk)
  }).on('end', () => {
    body = JSON.parse(Buffer.concat(body).toString())
    if (body.OriginalID === 'DuplicatePseudonym' || body.OriginalID === '') {
      response.status(400).send('Error')
    } else {
      response.sendStatus(201)
    }
  })
}

function getPseudonymConnector (_request, response) {
  response.json(
    {
      items: [
        {
          data: {
            ID: 'PseudonymID', OriginalID: 'OriginalID'
          }
        }
      ]
    }
  )
}

function getV1TypeTestRef (_request, response) {
  response.json(mockResponse)
}

function getV2TypeTestRef (request, response) {
  // try to mock (some) search behavior
  const likeQuery = /value=like=*([^,]+),label=like=\1/.exec(request.query.q)
  const inQuery = /value=in=*([^,]+),label=in=\1/.exec(request.query.q)
  if (inQuery !== null) {
    response.json({ ...mockResponse, items: mockResponse.items.filter(item => item.value === inQuery[1] || item.label === inQuery[1]) })
  } else if (likeQuery !== null) {
    response.json({ ...mockResponse, items: mockResponse.items.filter(item => item.value.includes(likeQuery[1]) || item.label.includes(likeQuery[1])) })
  } else {
    response.json(mockResponse)
  }
}

function getLocalization (_request, response) {
  const localizedMessages = {
    'form_required_field': 'This field is required',
    'form_validation_failed': 'Validation failed',
    'form_not_unique': 'Not a unique value',
    'form_not_a_valid_number': 'Not a valid number',
    'form_not_a_valid_integer': 'Not a valid integer value',
    'form_not_a_valid_long': 'Not a valid long value',
    'form_not_a_valid_hyperlink': 'Not a valid hyperlink',
    'form_not_a_valid_email': 'Not a valid email',
    'form_not_within_range': 'Value is outside of range',
    'form_below_min_value': 'Value is below allowed value',
    'form_above_max_value': 'Value is above allowed value',
    'form_maxlength_exceeded': 'Maximum field length is',
    'form_boolean_true': 'True',
    'form_boolean_false': 'False',
    'form_boolean_missing': 'N/A',
    'form_no_options': 'No options found.',
    'form_hide_optional_hint': 'Hide optional fields.',
    'form_show_optional_hint': 'Show all fields.',
    'form_file_change': 'Change',
    'form_file_browse': 'Browse',
    'form_invalid_input': 'This is not a valid input for this field type',
    'form_show_more': 'Show more'
  }
  response.json(localizedMessages)
}

function getTypeTest (request, response) {
  const meta = { permissions: ['ADD_DATA'] }
  const result = request.query.q === 'string==\'string value\';id!=123-abc' ? { items: [], meta } : { items: [{ foo: 'bar' }], meta }
  response.json(result)
}

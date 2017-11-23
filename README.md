# MOLGENIS Vue forms

> Vue library for generating web forms

## TODO

- Handle compounds
- Option schema for providing options or to specify an asynch target to fetch data on search
- Unit tests
- Validation expressions
- Validators pointing to data from other fields

## Usage

```vue
<template>
    <molgenis-vue-form 
        id="example-form"
        :fields="fields"
        :data="data"
        :options="options">
    </molgenis-vue-form>
</template>
  
<script>
    import MolgenisVueForm from '@molgenis/molgenis-vue-form'
    
    export default {
      name: 'molgenis-vue-form-example',
      data () {
        return {
          fields: [
            {...}
          ],
          data: {
            ...
          },
          options: {
            required: false,
            onSubmit: (formdata) => ...,
            onCancel: () => ...
          }
        }
      },
      components: {
        MolgenisVueForm
      }
    } 
</script>
```

## Specifications

The molgenis-vue-form component accepts the following properties

| parameter | description | required | default | 
|-----------|-------------|----------|---------|
| id        | An ID used for the <form> HTML element | Yes | N/A 
| fields    | An Array of field objects. See the [specifications](#field-specifications) and the [example](#example-field-object). | Yes | N/A
| data      | A key value map for preselected data in form fields. See the [example](#example-data-object). | No | {}
| options   | An option object. See the [specifications](#option-specifications) and the [example](#example-options-object). | Yes | N/A

### Option specifications

| parameter | description | required | default |
|-----------|-------------|----------|---------|
| readonly  | Set form to readonly | No | FALSE |
| onSubmit  | Function for what to do on submit | Yes | N/A |
| onCancel  | Function for what to do on cancel | Yes | N/A |

### Field specifications

| parameter | description |
|-----------|-------------|
| type      | HTML input type. Used to render the correct input. See [supported types](#supported-types) 
| label     | Label used as a label for the input field. |
| description | Description placed below the input field. Hidden if description is empty. |
| required  | A boolean or a function determining whether a field is required. |
| disabled  | A boolean or a function determining whether a field is disabled. |
| readonly  | A boolean or a function determining whether a field is readonly (similar to disabled). |
| visible   | A boolean or a function determining whether a field is visible. |
| validators | A list of functions which determine whether a field is valid on submit. |
| options | An object containing options for select, radios, and checkboxes typed fields. See [examples](#multiple-option-fields-example)|

Functions in any of the parameters mentioned above should accept a data object containing the data from the form. 

Functions should **always** return true or false. 

See the [field object examples](#example-field-object) for code examples.

#### Supported types

The following types are supported

| type | renders |
|------|-------------|
| radios | A list of radio buttons |
| select | A Vue Multiselect dropdown which supports asynchronous and synchronous option lists
| number | A HTML5 number input |
| text-area | A textarea HTML element |
| date | A Vue Flatpickr Date component |
| date-time | A Vue Flatpickr Date component with 'enableTime = true' |
| checkboxes | A list of checkboxes |
| text | A HTML5 text input |
| url | A HTML5 text url |
| email | A HTML5 text email |
| password | A HTML5 password input |
| file | A HTML5 file input |

## Examples

### Example field object

```js
/**
 * An example of a username field, a password field, and a confirm password field.
 * Because our user is a funny guy, the username should be funny_guy_101. If not, the form will not be valid.
 * The second password field should match the first password field, else the form will not be valid
 */
const fields = [
  {
    type: 'text',
    id: 'username',
    label: 'Username',
    required: true,
    disabled: false,
    visible: true,
    validators: [
      (formdata) => formdata['username'] === 'funny_guy_101' 
    ]
  },
  {
    type: 'password',
    id: 'password',
    label: 'Password',
    required: true,
    disabled: false,
    visible: true
  },
  {
    type: 'password',
    id: 'password-confirm',
    label: 'Confirm password',
    required: true,
    disabled: false,
    visible: true,
    validators: [
      (formdata) => formdata['password'] === formdata['password-confirm']
    ]
  }
]
```

### Example data object

```js
/**
* The following data object contains data for user form which contains an input field for:
* - username
* - country
* - organisation
* - bio
*/
const data = {
  username: 'User',
  country: 'Netherlands',
  organisation: 'Github repositories',
  bio: 'A software developer who loves Vue'
}
```

### Example options object

```js
const options = {
  readonly: true,
  onSubmit: (formdata) => console.log("Nice data: " + formdata),
  onCancel: () => console.log("Why did you close my form :'(")
}
```

### Multiple option fields example

```js
const fields = [
  {
    type: 'select',
    id: 'select-field',
    label: 'Who is it?',
    required: true,
    options: {
      uri: '/api/for/fetching/data',
      options: [],
      multiple: false,
    }
  },
  {
    type: 'radios',
    id: 'radios-field',
    label: 'Who did it',
    description: 'there can be only one',
    required: true,
    options: {
      options: [
        {id: 'captain-yellow', value: 'captain-yellow', label: 'Captain Yellow'},
        {id: 'admiral-blue', value: 'admiral-blue', label: 'Admiral Blue'},
        {id: 'general-red', value: 'general-red', label: 'General Red'}
      ]
    }
  },
  {
    type: 'checkboxes',
    id: 'checkboxes-field',
    label: 'Who are awesome',
    description: 'Everyone can be awesome',
    required: true,
    options: {
      options: [
        {id: 'captain-yellow', value: 'captain-yellow', label: 'Captain Yellow'},
        {id: 'admiral-blue', value: 'admiral-blue', label: 'Admiral Blue'},
        {id: 'general-red', value: 'general-red', label: 'General Red'},
      ]
    }
  }
]
```

## Build setup

### [yarn](https://yarnpkg.com) - recommended

```bash

# Install dependencies
yarn install
  
# Server with hot reload at localhost:3000
yarn run dev
  
# Build for production with minification
yarn run build
  
# Run tests
yarn run test
```

### [npm](https://www.npmjs.com)

```bash
# Install dependencies
npm install
  
# Server with hot reload at localhost:3000
npm run dev
  
# Build for production with minification
npm run build
  
# Run tests
npm run test
```

## License

GNU GPLv3 © Mark-de-Haan <markdehaan90@gmail.com>

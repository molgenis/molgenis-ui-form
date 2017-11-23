# MOLGENIS Vue forms

> Vue library for generating web forms

## TODO
- Handle compounds
- Option schema for providing options or to specify an asynch target to fetch data on search
- Unit tests
- Validation expressions
- Validators pointing to data from other fields

## Import and usage
```bash
yarn install @molgenis/molgenis-vue-forms
```

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

## MOLGENIS Vue Form specifications

When using the molgenis-vue-form component, the following options are available to you

| parameter | description | required | default | 
|-----------|-------------|----------|---------|
| id        | An ID used for the <form> HTML element | Yes | N/A 
| fields    | An Array of field objects. See [field Specifications](#field-specifications). | Yes | N/A
| data      | A key value map for preselected data in form fields. See [data specifications](#data-specifications). | No | {}
| options   | An option object. See [option specifications](#option-specifications). | Yes | N/A

### Option specifications

| parameter | description | required | default |
|-----------|-------------|----------|---------|
| readonly  | Set form to readonly | No | FALSE |
| onSubmit  | Function for what to do on submit | Yes | N/A |
| onCancel  | Function for what to do on cancel | Yes | N/A |

#### Example options object

```js
const options = {
  readonly: true,
  onSubmit: (formdata) => console.log("Nice data: " + formdata),
  onCancel: () => console.log("Why did you close my form :'(")
}
```

### Field specifications

| parameter | description |
|-----------|-------------|
| type      | HTML input type. Used to render the correct input. See [Field input types](#field-input-types) 
| label     | Label used as a label for the input field. |
| description | Description placed below the input field. Hidden if description is empty. |
| required  | A boolean or a function determining whether a field is required. |
| disabled  | A boolean or a function determining whether a field is disabled. |
| readonly  | A boolean or a function determining whether a field is readonly (similar to disabled). |
| visible   | A boolean or a function determining whether a field is visible. |
| validators | A list of functions which determine whether a field is valid on submit. |
| options | An object containing options for select, radios, and checkboxes typed fields. |

Functions in any of the parameters mentioned above should accept a data object containing the data from the form.  

See the [field object examples](#example-field-object) for code examples.

#### Field input types

The following types are supported:

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

#### Example field object

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

### Data specifications

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

## Build setup

### [yarn](https://yarnpkg.com) - recommend
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

## License

GNU GPLv3 © Mark-de-Haan <markdehaan90@gmail.com>

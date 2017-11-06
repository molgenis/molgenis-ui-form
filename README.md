# vue-forms

> Library for generating web forms

## TODO
- Validation / Visible / Nullable expressions
- Handle compounds
- Option schema for providing options or to specify an asynch target to fetch data on search
- Unit tests
- Validators pointing to data from other fields

## Usage
// TODO Write down example usages on how to import etc...

## API Specifications

### Form API
When using the molgenis-form component, the following options are available to you

| parameter | description | required | default | 
|-----------|-------------|----------|---------|
| id        | An ID used for the <form> HTML element | Yes | N/A 
| type      | The type of schema that is supplied. Use molgenis-entity to specify that EntityType metadata was supplied | false | 'custom'
| schema    | A JSON schema representing the structure of the form. Understands MOLGENIS EntityType metadata. See Schema API | true | N/A
| data      | A map of { field.id: value }. For a MOLGENIS EntityType, field.id is attribute.name. See Data API | false | An Empty Javascript Object
| readOnlyForm | A boolean that sets the entire form to read only | false | false
| onSubmit  | A function what to do on submit | true | N/A 
| onCancel  | A function what to do on cancel | true | N/A

### Schema API
// TODO Write down specs for SCHEMA object in forms

#### Example schema
Say we want a form consisting of a username and password, you can use the following schema
```
schema
{
    username: {
        type: 'text',
        id: 'username',
        label: 'Username',
        description: 'The name of the user',
        required: true,
        disabled: false,
        visible: true,
        options: [],
        validators: []
    },
    password: {
        type: 'password',
        id: 'password',
        label: 'Password',
        description: 'Password to MOLGENIS',
        required: true,
        disabled: false,
        visible: true,
        options: [],
        validators: []
    }
}
```
// TODO more examples

#### Input types
For each field in a custom schema, you can use the following types

| type | description |
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

#### Custom validators
// TODO Write down example of a custom validator

### Data API
// TODO Write down specs for DATA object in forms

#### Example Data

## Build setup

### [yarn](https://yarnpkg.com) - recommend
``` bash
# Install dependencies
yarn install

# Server with hot reload at localhost:8080
yarn run dev

# Build for production with minification
yarn run build
```

## License

GNU GPLv3 © Mark-de-Haan <markdehaan90@gmail.com>

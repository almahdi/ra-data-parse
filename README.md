# ra-data-parse

A Parse data provider for
[react-admin](https://github.com/marmelab/react-admin).


## Features
All Data Provider Actions are supported including Authentication
* `GET_LIST`
* `GET_ONE`
* `CREATE`
* `UPDATE`
* `UPDATE_MANY`
* `DELETE`
* `DELETE_MANY`
* `GET_MANY`
* `GET_MANY_REFERENCE`

## Installation

```sh
# via npm
npm install ra-data-parse

# via yarn
yarn add ra-data-parse
```

## Usage

Import this package, set the parse configurations and pass it as the dataProvider to
react-admin.

```javascript
//in app.js
import React from "react";
import { Admin, Resource } from "react-admin";
import {ParseAuth, ParseClient} from 'ra-data-parse'

const parseConfig = {
    URL: '',
    JAVASCRIPT_KEY: '',
    APP_ID: ''
}

const dataProvider = ParseClient(parseConfig);

const App = () => (
  <Admin dataProvider={dataProvider}>
    ...
  </Admin>
);

export default App;
```

## Authentication
This client allows you to set Authentication for login

``` javascript

// Pass it as the second parameter after the base URL.
const authProvider = ParseAuth(parseConfig);
```
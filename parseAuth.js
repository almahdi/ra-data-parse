import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';
import Parse from 'parse';

export default ({URL, APP_ID, JAVASCRIPT_KEY}) => {
    if (Parse.applicationId === null || Parse.javaScriptKey === null) {
        Parse.initialize(APP_ID, JAVASCRIPT_KEY);
        Parse.serverURL = URL;
    }
    return async (type, params) => {
        // console.log("parseAuth",type, params);
        if (type === AUTH_LOGIN) {
            const { username, password } = params;
            try {
                const user = await Parse.User.logIn(username, password);
                return user;
            } catch (error) {
                throw Error("Wrong username / password");
            }
        }
        if (type === AUTH_LOGOUT) {
            try {
                await Parse.User.logOut();
                return Promise.resolve();
            } catch(error) {
                throw Error(error.toString());
            }

        }
        if (type === AUTH_ERROR) {
            // ...
            // Parse.User.logOut().then
            return Promise.resolve();

        }
        if (type === AUTH_CHECK) {
            // return Promise.resolve();
            // const { resource } = params;
            return Parse.User.current() ? Promise.resolve() : Promise.reject();
            // if (resource === 'posts') {
            //     // check credentials for the posts resource
            // }
            // if (resource === 'comments') {
            //     // check credentials for the comments resource
            // }
        }
        return Promise.reject('Unknown method');
    };
}
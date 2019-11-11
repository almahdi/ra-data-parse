import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    UPDATE_MANY,
    DELETE,
    DELETE_MANY
} from "react-admin";

import Parse from "parse";
export default ({URL, APP_ID, JAVASCRIPT_KEY}) => {
    if(Parse.applicationId == null || Parse.javaScriptKey == null) {
        Parse.initialize(APP_ID, JAVASCRIPT_KEY);
        Parse.serverURL = URL;
    }
    return async (type, resource, params) => {
        const resourceObj = Parse.Object.extend(resource);
        const query = new Parse.Query(resourceObj);

        switch (type) {
            case GET_LIST: {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const { filter } = params;

                const count = await query.count();
                query.limit(perPage);
                query.skip((page - 1) * perPage);

                if (order === "DESC") query.descending(field);
                else if (order === "ASEC") query.ascending(field);
                Object.keys(filter).map(f => query.matches(f, filter[f], 'i'));
                const results = await query.find();
                return {
                    total: count,
                    data: results.map(o => ({ id: o.id, ...o.attributes }))
                };
            }
            case GET_ONE: {
                const result = await query.get(params.id);
                return {
                    data: {id: result.id, ...result.attributes}
                };
            }
            case GET_MANY: {
                const results = params.ids.map(id => (new Parse.Query(resourceObj)).get(id));
                const data = await Promise.all(results);
                return {
                    total: data.length,
                    data: data.map(o => ({ id: o.id, ...o.attributes }))
                };

            }
            case GET_MANY_REFERENCE: {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                query.equalTo(params.target, params.id);
                const count = await query.count();
                query.limit(perPage);
                query.skip((page - 1) * perPage);
                if (order === "DESC") query.descending(field);
                else if (order === "ASEC") query.ascending(field);

                const results = await query.find();
                return {
                    total: count,
                    data: results.map(o => ({ id: o.id, ...o.attributes }))
                };

            }
            case CREATE: {
                const resObj = new resourceObj();
                // Object.keys(params.data).map(key=>resObj.set(key, params.data[key]));
                try {
                    const r = await resObj.save(params.data);
                    return {data: {id: r.id, ...r.attributes}}
                } catch (error) {
                    return error;
                }
            }
            case UPDATE: {
                try {
                    const obj = await query.get(params.id);
                    const keys = Object.keys(params.data).filter(o=> o=="id" || o=="createdAt" || o=="updatedAt" ? false : true);
                    const data = keys.reduce((r,f,i)=>{
                        r[f] = params.data[f];
                        return r;
                    }, {});
                    // console.log(obj);
                    const r = await obj.save(data);
                    // console.log(r);
                    // console.log({data: {id: r.id, ...r.attributes}});
                    return {data: {id: r.id, ...r.attributes}}
                } catch (error) {
                    throw Error(error.toString());
                }
            }
            case UPDATE_MANY: {
                try {
                    const qs = await Promise.all(params.ids.map(id => (new Parse.Query(resourceObj)).get(id)));
                    qs.map(q => q.save(params.data));
                    return {data: params.ids}
                } catch {
                    throw Error("Failed to update all");
                }
            }
            case DELETE: {
                try {
                    const obj = await query.get(params.id);
                    const data = {data: {id: obj.id, ...obj.attributes}}
                    await obj.destroy();
                    return data;
                } catch(error) {
                    throw Error("Unable to delete");
                }
            }
            case DELETE_MANY: {
                try {
                    const qs = await Promise.all(params.ids.map(id=>(new Parse.Query(resourceObj)).get(id)));
                    await Promise.all(qs.map(obj=>obj.destroy()));
                    return {data: params.ids}
                } catch(error) {
                    throw Error("Unable to delete all");
                }

            }
        }
    };
}

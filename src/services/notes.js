import axios from "axios";
const baseUrl = `/api/notes`;

let token;

const setToken = (t) => {
    token = `Bearer ${t}`;
}

const getAll = () => {
    const request = axios.get(baseUrl);
    const nonExisting = {
        id: 10000,
        content: 'This note is not saved to server',
        date: '2019-05-30T17:30:31.098Z',
        important: true,
    }
    return request.then(res => res.data.concat(nonExisting)); //then() returns a promise object,
    // whose then() will take in a function handler, that has res.data as argument
    //This is called promise chaining
}


const create = (newObject) => {
    const config = {
        headers: {Authorization: token}
    };
    const request = axios.post(baseUrl, newObject, config);
    return request.then(res => res.data);
}

const update = (id, newObject) => {
    const url = `${baseUrl}/${id}`;
    const request = axios.put(url, newObject);
    return request.then(res => res.data);
}

const exportObj = {
    getAll: getAll,
    create: create,
    update: update,
    setToken
};
export default exportObj;

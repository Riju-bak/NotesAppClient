import axios from "axios";
const baseUrl = `/api/notes`;

let token;

const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
}

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data.map(dat => {
        return {...dat, user: dat.user.id}
    }); //then() returns a promise object,
    // whose then() will take in a function handler, that has res.data as argument
    //This is called promise chaining
}


const create = async (newObject) => {
    const config = {
        headers: {Authorization: token}
    };
    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
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

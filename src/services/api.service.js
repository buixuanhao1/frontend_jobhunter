import axios from "./axios.customize";

const loginUserAPI = (username, password) => {
    const URL_BACKEND = "/api/v1/auth/login";
    const data = {
        username: username,
        password: password
    }
    return axios.post(URL_BACKEND, data)
}

const createUserAPI = (name, email, password, address, age) => {
    const URL_BACKEND = "/api/v1/users";
    const data = {
        name: name,
        password: password,
        email: email,
        address: address,
        age: age
    }
    return axios.post(URL_BACKEND, data)
}

const updateUserAPI = (id, name, address, age, gender) => {
    const URL_BACKEND = "/api/v1/users";
    const data = {
        id: id,
        name: name,
        address: address,
        age: age,
        gender: gender
    }
    return axios.put(URL_BACKEND, data)
}

const deleteUserAPI = (id) => {
    const URL_BACKEND = `/api/v1/users/${id}`;
    return axios.delete(URL_BACKEND);
};

const fetchAllUserAPI = () => {
    const URL_BACKEND = "/api/v1/users";
    return axios.get(URL_BACKEND)
}

const fetchAllCompanyAPI = (query) => {
    const URL_BACKEND = `/api/v1/companies?${query}`;
    return axios.get(URL_BACKEND)
}

const callFetchCompanyById = (id) => {
    const URL_BACKEND = `/api/v1/companies/${id}`;
    return axios.get(URL_BACKEND)
}

const fetchAllJobAPI = (query) => {
    const URL_BACKEND = `/api/v1/jobs?${query}`;
    return axios.get(URL_BACKEND)
}

const callFetchJobById = (id) => {
    const URL_BACKEND = `/api/v1/jobs/${id}`;
    return axios.get(URL_BACKEND)
}



export { callFetchJobById, fetchAllJobAPI, callFetchCompanyById, fetchAllCompanyAPI, loginUserAPI, createUserAPI, fetchAllUserAPI, updateUserAPI, deleteUserAPI };
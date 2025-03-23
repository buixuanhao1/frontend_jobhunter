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

const fetchAllUserAPI = () => {
    const URL_BACKEND = "/api/v1/users";
    return axios.get(URL_BACKEND)
}

export { loginUserAPI, createUserAPI, fetchAllUserAPI, updateUserAPI };
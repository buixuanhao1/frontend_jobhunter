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

const registerUserAPI = (name, email, password, gender, address, age) => {
    const URL_BACKEND = "/api/v1/auth/register";
    const data = {
        name: name,
        email: email,
        password: password,
        gender: gender,
        address: address,
        age: age
    }
    return axios.post(URL_BACKEND, data)
}


const deleteCompanyAPI = (id) => {
    const URL_BACKEND = `/api/v1/companies/${id}`;
    return axios.delete(URL_BACKEND);
};

const getAccount = () => {
    const URL_BACKEND = "/api/v1/auth/account";
    return axios.get(URL_BACKEND)
}

const logoutUserAPI = () => {
    const URL_BACKEND = "/api/v1/auth/logout";
    return axios.post(URL_BACKEND);
}

const callCreateCompany = (data) => {
    const URL_BACKEND = "/api/v1/companies";
    return axios.post(URL_BACKEND, data);
};

const callUpdateCompany = (id, data) => {
    const URL_BACKEND = `/api/v1/companies/${id}`;
    return axios.put(URL_BACKEND, data);
};

const callUploadSingleFile = (file, folder) => {
    const URL_BACKEND = "/api/v1/files";
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return axios.post(URL_BACKEND, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export {
    deleteCompanyAPI, logoutUserAPI, getAccount, registerUserAPI, callFetchJobById, fetchAllJobAPI, callFetchCompanyById, fetchAllCompanyAPI,
    loginUserAPI, createUserAPI, fetchAllUserAPI, updateUserAPI, deleteUserAPI, callCreateCompany, callUpdateCompany, callUploadSingleFile
};
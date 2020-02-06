let TOKEN_HEADER_NAME = "X-CSRF-Token";
let TIHLDE_API_URL = "https://tihlde.org/api/v1/";
if (__DEV__) {
    TIHLDE_API_URL = "https://nettkom-api.herokuapp.com/api/v1/";
}

export class IRequest {
    constructor(method, url, data={}, withAuth=true, args={}, token) {
        this.method = method;
        this.data = data;
        this.headers = {'Content-Type': 'application/json'};
        this.url = TIHLDE_API_URL + url;
        this.args = args;

        if (withAuth) {
            this.headers[TOKEN_HEADER_NAME] = token;
        }

        for (const key in args) {
            this.headers[key] = args[key];
        }
    }

    response() {
        if (this.method === 'GET') {
            return new IResponse(getRequest(this.method, this.url, this.headers, this.data));
        } else {
            return new IResponse(request(this.method, this.url, this.headers, this.data));
        }
    }
}

class IResponse {
    constructor(response) {
        this.response = response.then((data) => {
            if (!data) {
                data = {};
            }

            this.isError = !data.ok;
            this.status = data.status;

            if (data.json === undefined) {
                return data;
            }

            return data.json();
        }).catch((error) => console.log(error));
    }

    then(method) {
        return this.response.then(method);
    }
}

const request = (method, url, headers, data) => {
    return fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(data),
    })
    .catch((error) => console.log(error));
};

const getRequest = (method, url, headers, args) => {
    return fetch(url+argsToParams(args), {
        method: method,
        headers: headers,
    })
    .catch((error) => console.log(error));
};

const argsToParams = (data) => {
    let args = '?';
    for (let key in data) {
        if (Array.isArray(data[key]) ) {
            for (let value in data[key]) {
            args += '&' + key + '=' + data[key][value];
            }
        } else {
            args += '&' + key + '=' + data[key];
        }
    }
    return args;
};

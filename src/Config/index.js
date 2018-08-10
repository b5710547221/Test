import axios from "axios";

// SET API Server
export const API = {
    base: "https://barkodo-api.pieros.site/barkodo_api/api"
};

// SET Theme Color Applicationƒ
export const Bakodo_Color = "#B7A5EF";
export const Loading_Color = "#6E69CC";

export const apiRequest = async (path, method = "GET", body = {}, serviceType = "customer", userToken = null, userId = null) => {
    headers = {
        "Client-Service": "MobileClient",
        "Auth-Key": "BarkodoAPIs",
        "Content-Type": "application/json",
        "Service-Type": serviceType,
        "Authorization": userToken,
        "User-Id": userId
	};
	
    switch (method) {
        case "GET":
            return await axios.get(API["base"] + path, {
                    headers, timeout: 3000
                }
            );
        case "POST":
            return await axios.post(API["base"] + path, body, {
                    headers, timeout: 3000
                }
            );
		case "PUT":
			return await axios.put(API["base"]+ path, body, {
				headers, timeout: 3000
				}
			);
    }
};

export const getAPI = async (name, params) => {
    const url = "http://www.worldenergystation.com/barkodo/index.php/response";
    const option = {
        headers: {
            "Content-Type": "application/json"
        },
        timeout: 10000
    };
    const body = {
        name: name,
        params: params
    };
    return await axios.post(url, body, option);
};

export const getAPIPromise = (name, params) => {
    const url = "http://www.worldenergystation.com/barkodo/index.php/response";
    const option = {
        headers: {
            "Content-Type": "application/json"
        },
        timeout: 10000
    };
    const body = {
        name: name,
        params: params
    };
    return axios.post(url, body, option);
};

import axios from "axios";

// SET API Server
export const API = {
    base: "http://worldenergystation.com/barkodo/index.php/barkodo_api/api"
    //base: "http://192.168.1.85:8888/Barkodo/api/V1/"
    // base: 'http://localhost:8888/Barkodo2/index.php/response'
};

// SET Theme Color Applicationƒ
export const Bakodo_Color = "#B7A5EF";
export const Loading_Color = "#6E69CC";

export const apiRequest = async (path, method = "GET", body = {}, serviceType = "customer", userToken = null, userId = null) => {
    headers = {
        "Client-Service": "MobileClient",
        "Auth-Key": "BarkodoAPIs",
        "Content-Type": "application/json",
        "ServiceType": serviceType,
        "Authorization": userToken,
        "User-Id": userId
	};
	
    switch (method) {
        case "GET":
            return await axios.get("http://worldenergystation.com/barkodo/index.php/barkodo_api/api" + path, {
                    headers
                }
            );
        case "POST":
            return await axios.post("http://worldenergystation.com/barkodo/index.php/barkodo_api/api" + path, body, {
                    headers
                }
            );
		case "PUT":
			return await axios.put("http://worldenergystation.com/barkodo/index.php/barkodo_api/api" + path, body, {
				headers
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

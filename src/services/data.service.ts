import axios from "axios";

const client = axios.create({
    baseURL: 'http://localhost:3300/api',
    headers: {
        'Accept': 'application/json'
    }
})

export class DataService {
    static async useAxios<T>(url: string, method: 'get' | 'post' | 'put' | 'delete' = 'get', payload: any = {}) {
        return await client.request<T>({
            url, method, data: payload
        })
    }

    static async register(obj: any) {
        return await client.request({
            url: '/user/signup',
            method: 'POST',
            data: obj
        })
    }

    static async verifyEmail(code: number) {
        return await client.request({
            url: `/user/verify/${code}`,
            method: 'PUT'
        })
    }

    static async login(obj: any) {
        return await client.request({
            url: '/user/login',
            method: 'POST',
            data: obj
        })
    }
}
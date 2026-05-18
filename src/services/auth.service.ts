import type { AuthModel } from "@/models/auth.model";

const AUTH_KEY = 'psep_2026_auth'

export class AuthService {
    static getAuth(): AuthModel {
        return JSON.parse(localStorage.getItem(AUTH_KEY)!)
    }

    static hasAuth() {
        return localStorage.getItem(AUTH_KEY) != null
    }

    static saveAuth(auth: AuthModel) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
    }

    static clearAuth() {
        localStorage.removeItem(AUTH_KEY)
    }

    static getAccessToken() {
        return this.getAuth().access
    }

    static getRefreshToken() {
        return this.getAuth().refresh
    }
}
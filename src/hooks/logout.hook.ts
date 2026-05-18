import { AuthService } from "@/services/auth.service";
import { useRouter } from "vue-router";

export function useLogout() {
    const router = useRouter()

    return (e: any | null = null) => {
        if (e)
            alert(e.message)
        
        AuthService.clearAuth()
        router.push('/login')
    }
}
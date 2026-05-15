import { AuthService } from "@/services/auth.service";
import { useRouter } from "vue-router";

export function useLogout() {
    const router = useRouter()

    return () => {
        AuthService.clearAuth()
        router.push('/login')
    }
}
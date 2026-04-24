// src/features/auth/logic/use-auth-actions.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Dùng react-router-dom
import { authService } from '../api/auth.service';
import { useAuthStore } from '../state/use-auth-store';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';

export function useAuthActions() {
    const navigate = useNavigate(); // Khởi tạo hàm điều hướng
    const setAuth = useAuthStore((state) => state.setAuth);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (credentials: LoginRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.login(credentials);
            console.log('Login response from service:', response); // Debug: Kiểm tra phản hồi từ API
            console.log('User data:', response.user); // Debug: Kiểm tra dữ liệu user
            console.log('User token:', response.token); // Debug: Kiểm tra dữ liệu user

            if (!response || !response.token || !response.user) {
                throw new Error('Invalid response from server');
            }

            // 1. Cập nhật Global State (Zustand)
            setAuth(response.user, response.token);
            
            // 2. Điều hướng về trang chủ hoặc dashboard
            navigate('/workspace'); // Điều hướng tới trang workspace sau khi đăng nhập thành công
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            console.error('Login error from action:', err); // Debug: Kiểm tra lỗi
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (data: RegisterRequest) => {
        
        setIsLoading(true);
        setError(null);
        try {
        const response = await authService.register(data);
        
        // 1. Cập nhật Global State (Zustand)
        setAuth(response.user, response.token);
        
        // 2. Điều hướng về trang chủ hoặc dashboard
        navigate('/workspace'); // Điều hướng tới trang workspace sau khi đăng ký thành công
        return true;
        } catch (err) {
        setError(err.response?.data?.message || 'Register failed');
        return false;
        } finally {
        setIsLoading(false);
        }
    };
    return { handleLogin, handleRegister, isLoading, error };
}
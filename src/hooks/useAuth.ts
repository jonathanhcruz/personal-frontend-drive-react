import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginService, logout as logoutService } from '../services/auth.service';
import { setAccessToken } from '../lib/axios';
import type { LoginRequest } from '../types/api.types';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => loginService(credentials),
    onSuccess: (token) => {
      setAccessToken(token);
      navigate('/drive', { replace: true });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutService,
    onSettled: () => {
      setAccessToken(null);
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
};

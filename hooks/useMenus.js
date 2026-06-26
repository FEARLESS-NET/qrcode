// frontend/src/hooks/useMenus.js (yangi fayl)
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../api/axios';

export const useMenus = () => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: async () => {
      const res = await axiosInstance.get('/menus');
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    refetchOnWindowFocus: false,
  });
};
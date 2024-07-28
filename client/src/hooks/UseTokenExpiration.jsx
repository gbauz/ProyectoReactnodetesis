import { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthProvider';

const useTokenExpiration = () => {
  const { token, expirationTime, logout } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!token || !expirationTime) return;
    const checkTokenExpiration = () => {
      const currentTime = new Date().getTime();
      const timeLeft = expirationTime - currentTime;
      if (timeLeft <= 5 * 60 * 1000) setIsModalVisible(true); //Mostrar el modal antes de 5 min de acabarse
    };
    const intervalId = setInterval(checkTokenExpiration, 1000); // Verificar cada segundo
    return () => clearInterval(intervalId);
  }, [token, expirationTime]);

  const handleOk = () => {
    setIsModalVisible(false);
    logout();
  };

  return { isModalVisible, handleOk };
};

export default useTokenExpiration;
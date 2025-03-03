// 📂 src/components/ProximityAlert.js

import React, { useState, useEffect } from "react";

// Função para calcular a distância entre duas coordenadas (Haversine Formula)
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Raio da Terra em metros
  const rad = (deg) => (deg * Math.PI) / 180;

  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c; // Distância em metros

  return distancia;
};

const ProximityAlert = ({ userLocation, partnerLocation }) => {
  const [estaPerto, setEstaPerto] = useState(false);

  useEffect(() => {
    if (userLocation && partnerLocation) {
      const distancia = calcularDistancia(
        userLocation.latitude, userLocation.longitude,
        partnerLocation.latitude, partnerLocation.longitude
      );

      console.log(`📏 Distância calculada: ${distancia.toFixed(2)} metros`);
      
      // Atualiza o estado se a distância for menor que 300 metros
      setEstaPerto(distancia <= 300);
    }
  }, [userLocation, partnerLocation]);

  // Se não estiver perto, não exibe nada
  if (!estaPerto) return null;

  return (
    <div className="alerta-proximidade">
      ❤️ Seu amor está perto! ❤️
    </div>
  );
};

export default ProximityAlert;

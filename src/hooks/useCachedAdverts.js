import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const baseUrl = window?.env?.VITE_API_URL || "http://localhost:8585";
const CACHE_KEY = "cached_adverts";
const CACHE_TIMESTAMP_KEY = "cached_adverts_timestamp";
const TTL = 15 * 60 * 1000; // 15 minutos

export const useCachedAdverts = (category = "") => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener anuncios y almacenarlos en caché
  const fetchAndCache = async () => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/v1/advertises?active=true&size=1000`
      );
      localStorage.setItem(CACHE_KEY, JSON.stringify(data.content));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      return data.content;
    } catch (error) {
      console.error("Error al cargar anuncios:", error);
      return [];
    }
  };

  // Función que maneja la carga de anuncios, con o sin caché
  const loadAdverts = useCallback(
    async (forceRefresh = false) => {
      setLoading(true);

      const cached = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      const isValid =
        cached && timestamp && Date.now() - parseInt(timestamp, 10) < TTL;

      let adverts = [];

      if (forceRefresh || !isValid) {
        // Si es forzado o el caché ha expirado, obtenemos los datos nuevamente
        adverts = await fetchAndCache();
      } else {
        // Si los datos aún son válidos, los usamos
        adverts = JSON.parse(cached);
      }

      // Filtrar por categoría si es necesario
      const filtered = category
        ? adverts.filter((adv) => adv.category?.description === category)
        : adverts;

      setData(filtered);
      setLoading(false);
    },
    [category]
  );

  // Cargar los anuncios en el efecto inicial
  useEffect(() => {
    loadAdverts();
  }, [category, loadAdverts]);

  // Función de refresco manual
  const refreshAdverts = () => {
    loadAdverts(true); // Forzar el refresco de los anuncios
  };

  return { data, loading, refreshAdverts };
};

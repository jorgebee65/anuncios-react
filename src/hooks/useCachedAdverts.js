import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;
const CACHE_KEY = "cached_adverts";
const CACHE_TIMESTAMP_KEY = "cached_adverts_timestamp";
const TTL = 15 * 60 * 1000; // 15 minutos

export const useCachedAdverts = (category = "") => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    const isValid =
      cached && timestamp && Date.now() - parseInt(timestamp, 10) < TTL;

    const process = async () => {
      const adverts = isValid ? JSON.parse(cached) : await fetchAndCache();
      const filtered = category
        ? adverts.filter((adv) => adv.category?.description === category)
        : adverts;
      setData(filtered);
      setLoading(false);
    };

    process();
  }, [category]);

  return { data, loading };
};

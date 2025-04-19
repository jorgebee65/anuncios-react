import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;
const CACHE_KEY = "cached_categories";
const CACHE_TIMESTAMP_KEY = "cached_categories_timestamp";
const TTL = 60 * 60 * 1000; // 1 hora

export const useCachedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAndCache = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/categories`);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (cached && timestamp && Date.now() - parseInt(timestamp, 10) < TTL) {
      setCategories(JSON.parse(cached));
      setLoading(false);
    } else {
      fetchAndCache();
    }
  }, []);

  return { categories, loading };
};

import axios from "axios"
import { useEffect, useState } from "react";
const API_URL = 'http://localhost:8080'

interface FetchState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}

const useFetch = <T>(url: string): FetchState<T> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(API_URL + `${url}`, { signal: controller.signal });
                setData(response.data);
                setError(null);
            } catch (error: any) {
                if (axios.isCancel(error)) {
                    console.log(error.message);
                } else {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        return () => {
            controller.abort();
        };
    }, [url]);
    return { data, isLoading, error };
}

export default useFetch;    
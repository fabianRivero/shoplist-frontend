import axios, { CancelTokenSource } from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../auth/context";
import { TokenStorage } from "../services";
import { AuthActionType } from "../../auth/models";

interface Props<B, D> {
    serviceCall: (body: B) => Promise<D>;
    trigger?: boolean;
}

type Data<D> = D | null;
type CustomError = string | null;

interface ReturnType<B, D> {
    isLoading: boolean;
    data: Data<D>;
    error: CustomError;
    executeFetch: (body: B) => Promise<void>;
}

export const useAxios = <B, D>({ serviceCall, trigger = false }: Props<B, D>): ReturnType<B, D> => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] =useState<Data<D>>(null);
    const [error, setError] = useState<CustomError>(null);
    const cancelSource = useRef<CancelTokenSource | null>(null);
    const { dispatch } = useContext(AuthContext);

    const executeFetch = useCallback(async (body: B = {} as B) => {
        setIsLoading(true);
        setError(null);

        const source = axios.CancelToken.source();
        cancelSource.current = source;

        try{
            const token = TokenStorage.getToken();
            if(token){
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            }

            const response = await serviceCall(body);
            setData(response);
        } catch (err: unknown){
            if(axios.isCancel(err)){
                console.warn("Petición cancelada", (err as Error).message);
            } else if (axios.isAxiosError(err)){
                if (err.status === 403 || err.status === 401){
                    dispatch({ type: AuthActionType.LOGOUT })
                }

                setError(err.message || "Error desconocido")
            } else {
                setError("Error desconocido")
            }
        } finally {
            setIsLoading(false)
        }
    }, [dispatch, serviceCall])

    useEffect(() => {
        if(trigger){
            executeFetch();
        }

        return () => {
            if(cancelSource.current){
                cancelSource.current.cancel("Componente desmontado")
            }
        }
    }, [trigger, executeFetch])

    return { isLoading, data, error, executeFetch }
}


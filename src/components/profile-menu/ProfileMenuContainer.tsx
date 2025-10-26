import { useContext, useState } from "react";
import { AuthContext } from "../../auth/context";
import { AuthService } from "../../auth/services";
import { useNavigate } from "react-router-dom";
import { HeaderModalContext } from "../../shared/components/headerModal/context";
import "./profile-menu-container.scss";
import { AuthActionType } from "../../auth/models";
import { ModalContext } from "../../shared/components/modal/context";
import { TokenStorage } from "../../shared/services";

export const ProfileMenuContainer = () => {
    const { state, dispatch } = useContext(AuthContext);
    const { setState: setHeaderModalState } = useContext(HeaderModalContext)
    const { setState: modalSetState } = useContext(ModalContext)    
        
    const navigate = useNavigate();
    
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    const [showCurrencyChange, setShowCurrencyChange] = useState(false);
    const [newCurrency, setNewCurrency] = useState("");
    const [currencyTitle, setCurrencyTitle] = useState(state.user?.currency);

    const [deleteVerificationPassword, setDeleteVerificationPassword] = useState("");
    const [showDeletePassword, setShowDeletePassword] = useState(false);
    const [deleteVerification, setDeleteVerification] = useState(false);

    const handleChangePasswordClick = () => {
        setShowPasswordChange((prev: boolean) => !prev);
        setCurrentPassword("");
        setNewPassword("");
        setIsVerified(false);
    }
    
    const handleVerifyPassword = async () => {
        if (!currentPassword) return alert("Ingresa tu contraseña actual.");
        if(!state.user?.email) {navigate("/"); return};
        setLoading(true);
        try {
            const authService = new AuthService();
            await authService.login(state.user.email, currentPassword);
            setIsVerified(true);
        } catch {
            alert("La contraseña actual es incorrecta.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword) return alert("Ingresa la nueva contraseña.");
        setLoading(true);
        try {
            const response = confirm("¿Estas seguro de que quieres cambiar la contraseña?")
            
            if(response){
                const authService = new AuthService();
                await authService.updateUser(undefined, newPassword);

                alert("Contraseña actualizada correctamente. Vuelve a iniciar sesión si deseas ingresar nuevamente.");
                setShowPasswordChange(false);
                setHeaderModalState(false)
                navigate("/")
            }

        } catch (error) {
            if (error instanceof Error) {
                alert(error.message || "Error al actualizar la contraseña.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChangeCurrency = () => {
        setShowCurrencyChange((prev: boolean) => !prev);
        setNewCurrency("");
    } 

    const handleUpdateCurrency = async () => {
        if (!newCurrency) return alert("Ingresa la nueva divisa.");
        if (newCurrency.length < 3) return alert("La divisa debe tener por lo menos 3 caracteres.");
        setLoading(true)
        try {            
            const authService = new AuthService();
            await authService.setInitialSetup(newCurrency);
            const usertoken = TokenStorage.getToken();
            const newUserInfo = usertoken ? TokenStorage.decodeToken(usertoken) : undefined;
            if (newUserInfo) {
            dispatch({ type: AuthActionType.UPDATE, payload: newUserInfo });
            }


            alert("Divisa actualizada correctamente.");
            setShowCurrencyChange(false);
            setCurrencyTitle(newCurrency)

        } catch (error) {
            if (error instanceof Error) {
                alert(error.message || "Error al actualizar la divisa.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccountClick = () => {
        setShowDeletePassword((prev: boolean) => !prev);
        setDeleteVerificationPassword("");
        setDeleteVerification(false)
    }

    const handleVerifyDeletePassword = async () => {
        if(!deleteVerificationPassword) return alert("Ingresa tu contraseña actual.");
        
        if(!state.user?.email) {navigate("/"); return} ;

        setLoading(true);
        try {
            const authService = new AuthService();
            await authService.login(state.user.email, deleteVerificationPassword);
            setDeleteVerification(true);
        } catch {
            alert("La contraseña actual es incorrecta.");
        } finally {
            setLoading(false);
        }
    }

    const  handleDeleteAccount = async () =>  {
        const confirmation = confirm("¿Estás seguro de que quieres eliminar tu cuenta?");
        if(confirmation && state.user?.email){
            try{
                const authService = new AuthService();
                await authService.deleteAcount(state.user.email); 
                alert("La cuenta se eliminó correctamente.")
                setHeaderModalState(false)
                navigate("/") 

            } catch(error){
                if(error instanceof Error){
                alert(error.message || "Error al eliminar cuenta");
            }
            }
        }
    }

    const logout = async () => {
        try{
            const authService = new AuthService();
            modalSetState({ open: false , data: undefined})
            await authService.logout();
            dispatch({ type: AuthActionType.LOGOUT });
            setHeaderModalState(false)
        }catch (error){
            if(error instanceof Error){
                alert(error.message || "Error al cerrar sesión");
            }
        }
    }


    return (
        <div className="profile-menu-container">
            <div className="profile-info">
                <p><span>Nombre de usuario</span> {state.user?.username}</p>
                <p><span>Email:</span> {state.user?.email}</p>
                <p><span>Divisa:</span> {currencyTitle}</p> 
                
                <button onClick={handleChangeCurrency}>
                    {showCurrencyChange ? "Cancelar" : "Cambiar divisa"}
                </button>
                {showCurrencyChange && (
                    <div className="change-section">
                        <div className="currency-change">
                            <input type="text" placeholder="Nueva divisa" onChange={(e) => setNewCurrency(e.target.value)}/>
                        </div>

                        <button disabled={loading} onClick={handleUpdateCurrency}>
                            {loading ? "Cambiando divisa..." : "Cambiar divisa"}
                        </button>
                    </div>
                )}

                <button onClick={handleChangePasswordClick}>
                    {showPasswordChange ? "Cancelar" : "Cambiar contraseña"}
                </button>

                {showPasswordChange && (
                    <div className="password-change">
                        {!isVerified ? (
                            <div className="change-section">
                                <input
                                    type="password"
                                    placeholder="Contraseña actual"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                                <button disabled={loading} onClick={handleVerifyPassword}>
                                    {loading ? "Verificando..." : "Verificar"}
                                </button>
                            </div>
                        ) : (
                            <div className="change-section">
                                <input
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button disabled={loading} onClick={handleUpdatePassword}>
                                    {loading ? "Guardando..." : "Guardar nueva contraseña"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <button onClick={handleDeleteAccountClick}>
                    {showDeletePassword ? "Cancelar" : "Eliminar cuenta"}
                </button>
                {showDeletePassword && (
                    <div className="password-change">
                        {!deleteVerification ? (
                            <div className="change-section">
                                <input
                                    type="password"
                                    placeholder="Contraseña actual"
                                    value={deleteVerificationPassword}
                                    onChange={(e) => setDeleteVerificationPassword(e.target.value)}
                                />
                                <button disabled={loading} onClick={handleVerifyDeletePassword}>
                                    {loading ? "Verificando..." : "Verificar"}
                                </button>
                            </div>
                        ) : (
                            <div className="change-section">
                            <button disabled={loading} onClick={handleDeleteAccount}>
                                {loading ? "Eliminando..." : "Eliminar cuenta"}
                            </button>
                            </div>
                        )}
                    </div>
                )}
                <button onClick={logout}>Cerrar Sesión</button>
            </div>
        </div>
    );
}
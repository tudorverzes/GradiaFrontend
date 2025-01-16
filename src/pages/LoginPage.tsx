import React, {useEffect, useState} from "react";
import {useAuth} from "../context/useAuth";
import {
    IonAlert, IonButton, IonCol,
    IonContent,
    IonHeader, IonIcon, IonImg, IonInput, IonInputPasswordToggle,
    IonItem,
    IonLabel,
    IonLoading,
    IonPage, IonRow, IonSpinner, IonText,
    IonTitle,
    IonToolbar, useIonRouter
} from "@ionic/react";
import './LoginPage.css';
import {chevronForwardSharp} from "ionicons/icons";


const LoginPage = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { login, loading, error, loggedIn } = useAuth();

    const router = useIonRouter();
    useEffect(() => {
        if (loggedIn) {
            router.push('/chat', 'forward', 'replace');
        }
    }, [loggedIn]);

    useEffect(() => {
        document.title = 'Gradia | Log in';
    });

    const handleLogin = async () => {
        await login(username, password);
    };

    return (
        <IonPage id="login-page">
            <div className="login-container">
                <IonAlert
                    isOpen={error !== null}
                    header="Error"
                    message={'The username or password is incorrect. Please try again.'}
                    buttons={['Close']}
                />

                <div className="logo-container">
                    <img src="public/logo_gradia.svg" alt="Gradia logo" className="logo"/>
                    <p className="motto">
                        Discover, Improve, Excel. Academically and Beyond.<br/>
                        Log in or <a href="/register" className="create-account-link">Create an account</a>.
                    </p>
                </div>

                <IonItem>
                    <IonInput
                        placeholder="Username"
                        value={username}
                        onIonInput={(e) => setUsername(e.detail.value!)}
                        required
                    />
                </IonItem>
                <div className="last-row-input">
                    <IonItem>
                        <IonInput
                            placeholder="Password"
                            type="password"
                            value={password}
                            onIonInput={(e) => setPassword(e.detail.value!)}
                            required
                        >
                            <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                        </IonInput>
                    </IonItem>

                    <IonButton expand="block" className="icon-button" onClick={handleLogin} disabled={loading}>
                        {!loading ? <IonIcon slot="icon-only" icon={chevronForwardSharp}></IonIcon> :
                            <IonSpinner></IonSpinner>}
                    </IonButton>
                </div>

                <div>
                    <p className="forgot-password">Forgot your password? <a href="#">Reset it here</a>.</p>
                </div>

            </div>
            <div className="footer">
                <p>
                    By continuing, you agree to the<br/>
                    <a href="#">Terms of Sale</a>, <a href="#">Terms of Service</a>, and <a href="#">Privacy Policy</a>.
                </p>
            </div>
        </IonPage>
    )
}

export default LoginPage;
import React, {useEffect, useState} from "react";
import {useAuth} from "../context/useAuth";
import {
    IonAlert, IonButton,
    IonContent,
    IonHeader, IonIcon, IonInput, IonInputPasswordToggle,
    IonItem,
    IonLabel,
    IonLoading,
    IonPage, IonSpinner,
    IonTitle,
    IonToolbar, useIonRouter
} from "@ionic/react";
import './LoginPage.css';
import {chevronForwardSharp} from "ionicons/icons";

const RegisterPage = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { register, loading, error, loggedIn } = useAuth();

    const router = useIonRouter();
    useEffect(() => {
        if (loggedIn) {
            router.push('/chat', 'forward', 'replace');
        }

        document.title = 'Gradia | Register';
    }, [loggedIn]);

    const handleRegister = async () => {
        await register(username, email, password);
    };

    return (
        <IonPage id="register-page">
            <div className="login-container">
                <IonAlert
                    isOpen={error !== null}
                    header="Error"
                    message={error || 'An error occurred'}
                    buttons={['Close']}
                />

                <div className="logo-container">
                    <img src="public/logo_gradia.svg" alt="Gradia logo" className="logo"/>
                    <p className="motto">
                        Discover, Improve, Excel. Academically and Beyond.<br/>
                        <a href="/login">Log in</a> if you already have an account.
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

                <IonItem>
                    <IonInput
                        placeholder="E-mail"
                        value={email}
                        onIonInput={(e) => setEmail(e.detail.value!)}
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

                    <IonButton expand="block" className="icon-button" onClick={handleRegister} disabled={loading}>
                        {!loading ? <IonIcon slot="icon-only" icon={chevronForwardSharp}></IonIcon> :
                            <IonSpinner></IonSpinner>}
                    </IonButton>
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

export default RegisterPage;
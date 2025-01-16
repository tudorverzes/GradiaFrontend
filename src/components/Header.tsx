import {IonAvatar, IonBackButton, IonButton, IonButtons, IonRow, IonToolbar} from "@ionic/react";
import {chevronBackSharp} from "ionicons/icons";
import React from "react";
import {Chat} from "../props/Chat";
import {useAuth} from "../context/useAuth";

interface HeaderProps {
    chat?: Chat | null;
    hasBackButton: boolean;
}

const Header = ({ chat, hasBackButton }: HeaderProps) => {
    const { logout } = useAuth();

    return (
        <div className="header">
            <div className="header-content">
                <IonToolbar>
                    <IonRow>
                        <img
                            className="logo"
                            src="public/logo_gradia.svg"
                            alt="Ionic logo"
                            style={{ marginLeft: hasBackButton ? '0' : '10px' }}
                        />
                    </IonRow>
                    <IonButtons slot="start">
                        {hasBackButton && <IonBackButton icon={chevronBackSharp} defaultHref="/chat" />}
                    </IonButtons>
                    <IonButtons slot="end">
                        {chat && <IonButton expand="block">{chat?.style}</IonButton>}
                        <IonAvatar onClick={
                            () => {
                                logout();
                            }
                        }>
                            <img
                                alt="Silhouette of a person's head"
                                src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
                            />
                        </IonAvatar>
                    </IonButtons>
                </IonToolbar>
            </div>
        </div>
    );
};

export default Header;
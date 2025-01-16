import { useParams } from "react-router";
import React, {useEffect, useRef, useState} from "react";
import {
    IonAlert, IonAvatar, IonBackButton, IonButton, IonButtons, IonCol,
    IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel,
    IonList, IonLoading, IonPage, IonProgressBar, IonRow, IonSpinner,
    IonTitle, IonToolbar, useIonRouter
} from "@ionic/react";
import { useChat } from "../hooks/useChat";
import './ChatPage.css';
import {add, chevronBack, chevronBackSharp, chevronForwardSharp, logoApple, settingsSharp} from "ionicons/icons"; // Import a CSS file for custom styles
import styleIcon from '../../public/brand_family_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';
import Header from "../components/Header";

const ChatPage = () => {
    const params = useParams<{ id: string }>();
    const router = useIonRouter();
    const ionContentRef = useRef<HTMLIonContentElement>(null); // Ref for IonContent

    const id = Number(params.id);
    if (isNaN(id)) {
        console.error("Invalid ID. Must be a number.");
        if (router.canGoBack())
            router.goBack();
        else
            router.push('/chat', 'forward', 'replace');
    }

    const { chat, error, loading, sendMessage } = useChat(id);

    const [message, setMessage] = useState<string>('');
    const [placeholder, setPlaceholder] = useState<string>('Do you have any questions?');

    useEffect(() => {
        document.title = 'Gradia | ' + chat?.title || 'Gradia';
    });

    useEffect(() => {
        if (chat?.style === 'humorous' || chat?.style === 'informal') {
            setPlaceholder('Got any questions?');
        } else {
            setPlaceholder('Do you have any questions?');
        }

        if (ionContentRef.current) {
            ionContentRef.current.scrollToBottom(300); // 300ms animation duration
        }
    }, [chat]);

    const handleSend = async () => {
        sendMessage(message).then(() => {
            setMessage('');
        });
    }

    return (
        <IonPage id="chat-page">
            <Header hasBackButton={true} chat={chat}/>

            <IonContent fullscreen className="chat-content" ref={ionContentRef}>
                <IonLoading isOpen={loading && message === ''} message="Loading..." />
                <IonAlert
                    isOpen={error !== null}
                    header="Error"
                    message={error || 'An error occurred'}
                    buttons={['Close']}
                />

                <IonList className="chat-list">
                    <div className="chat-container">
                        {chat?.type === 'paperAnalysis' &&
                        <div className='message-container user-message'>
                            <div className="message-content">
                                Paper analysis based on: <a href="#" target="_blank">{chat?.paperTitle}</a>
                            </div>
                        </div>}

                        {chat?.messages.map((message, index) => (
                            <div key={index} className={`message-container ${message.isSentByUser ? 'user-message' : 'ai-message'}`}>
                                <div className="message-content">
                                    <div className="message-body">{message.body}</div>
                                    <div className="message-timestamp">
                                        {new Intl.DateTimeFormat('en-GB', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    }).format(new Date(message.timestamp))}
                                    </div>

                                    {!message.isSentByUser && message.analysis && (
                                        <IonGrid className="analysis-grid">
                                            <IonRow>
                                                <IonCol>
                                                    <IonLabel>Academic</IonLabel>
                                                    <IonProgressBar color="dark" value={message.analysis.academic / 100} />
                                                </IonCol>
                                                <IonCol>
                                                    <IonLabel>Formal</IonLabel>
                                                    <IonProgressBar color="dark" value={message.analysis.formal / 100} />
                                                </IonCol>
                                                <IonCol>
                                                    <IonLabel>Informal</IonLabel>
                                                    <IonProgressBar color="dark" value={message.analysis.informal / 100} />
                                                </IonCol>
                                                <IonCol>
                                                    <IonLabel>Humorous</IonLabel>
                                                    <IonProgressBar color="dark" value={message.analysis.humorous / 100} />
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </IonList>

                <div className="chat-input-container">
                    <div className="chat-input">
                        <IonItem className={`chat-input-item`}>
                            <IonInput
                                placeholder={placeholder}
                                disabled={loading}
                                class="custom"
                                value={message}
                                onIonInput={(e) => setMessage(e.detail.value!)}
                                required
                            />
                        </IonItem>
                        <IonButton expand="block" className="icon-button" onClick={handleSend} disabled={loading}>
                            {!loading ? <IonIcon slot="icon-only" icon={chevronForwardSharp}></IonIcon> : <IonSpinner></IonSpinner>}
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default ChatPage;
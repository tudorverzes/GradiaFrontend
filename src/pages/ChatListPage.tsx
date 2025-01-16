import {useChats} from "../hooks/useChats";
import {
    IonAlert, IonButton,
    IonButtons,
    IonContent, IonFab, IonFabButton, IonFabList,
    IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading,
    IonMenuButton, IonModal,
    IonPage,
    IonRefresher, IonRefresherContent, IonSelect, IonSelectOption, IonSpinner, IonText, IonTextarea,
    IonTitle,
    IonToolbar, useIonRouter
} from "@ionic/react";
import React, {useEffect, useRef, useState} from "react";
import {
    add,
    share,
    chatboxEllipses,
    arrowBackOutline,
    trash,
    trashSharp,
    trashBinSharp, chevronForwardSharp, document as documentIcon
} from "ionicons/icons";
import Header from "../components/Header";
import './ChatListPage.css';


const ChatListPage = () => {
    const { chats, loading, error, deleteChat, refreshChats, startChat, startPaperAnalysis } = useChats();

    const chatModal = useRef<HTMLIonModalElement>(null);
    const paperModal = useRef<HTMLIonModalElement>(null);

    const [chatQuery, setChatQuery] = useState<string>('');
    const [chatQueryStyle, setChatQueryStyle] = useState<string>('academic');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [paperFile, setPaperFile] = useState<File | null>(null);
    const [paperQueryStyle, setPaperQueryStyle] = useState<string>('academic');

    const router = useIonRouter();

    async function canDismiss(data?: any, role?: string) {
        return role !== 'gesture';
    }

    const openFileChooser = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setPaperFile(files[0]);
        }
    };

    const onDeleteChat = async (chatId: number) => {
        await deleteChat(chatId).then(() => {
            console.log('Chat deleted');
        });
    }

    const refresh = async () => {
        await refreshChats().then(() => {
            console.log('Chats refreshed');
        });
    }

    useEffect(() => {
        document.title = 'Gradia | Chat List';
    }, []);

    return (
        <IonPage id="chat-list-page">
            <Header hasBackButton={false}/>

            <IonContent fullscreen className="chat-list-content">
                <IonRefresher slot="fixed" onIonRefresh={refresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <IonLoading isOpen={loading && chatQuery === '' && !paperFile} message="Loading..."/>
                <IonAlert
                    isOpen={error !== null}
                    header="Error"
                    message={error || 'An error occurred'}
                    buttons={['Close']}
                />

                <IonModal ref={chatModal} id="chat-modal" trigger="chat-modal-button" canDismiss={canDismiss}>
                    <IonContent>
                        <div className="modal-content">
                            <textarea
                                value={chatQuery}
                                onInput={e => setChatQuery((e.target as HTMLTextAreaElement).value)}
                                className="full-size-textarea"
                                placeholder="Type your question here..."
                            ></textarea>

                            <div className="controls-container">
                                <IonSelect
                                    aria-label="Select a style for the answer"
                                    interface="popover"
                                    placeholder="Select style"
                                    onIonChange={e => setChatQueryStyle(e.detail.value)}
                                    className="style-select"
                                >
                                    <IonSelectOption value="academic">Academic</IonSelectOption>
                                    <IonSelectOption value="formal">Formal</IonSelectOption>
                                    <IonSelectOption value="informal">Informal</IonSelectOption>
                                    <IonSelectOption value="humorous">Humorous</IonSelectOption>
                                </IonSelect>

                                <IonButton
                                    onClick={() => {
                                        startChat(chatQuery, chatQueryStyle).then(r => {
                                            if (r) {
                                                router.push(`/chat/${r}`, 'forward');
                                            }
                                        });
                                    }}
                                    className="start-chat-button icon-button"
                                    disabled={loading}
                                >
                                        {!loading ? <IonIcon slot="icon-only" icon={chevronForwardSharp}></IonIcon> : <IonSpinner></IonSpinner>}
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
                </IonModal>

                <IonModal
                    ref={paperModal}
                    id="paper-modal"
                    trigger="paper-modal-button"
                    canDismiss={canDismiss}
                    onDidDismiss={() => setPaperFile(null)}
                >
                    <IonContent>
                        <div className="modal-content" onClick={openFileChooser}>
                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="application/pdf"
                                onChange={handleFileChange}
                            />

                            {/* Display file name in the center */}
                            {paperFile ? (
                                <IonText className="file-name">
                                    {paperFile.name}
                                </IonText>
                            ) : (
                                <IonText className="file-name">
                                    Click to select a file
                                </IonText>
                            )}
                        </div>

                        {/* Bottom controls */}
                        <div className="controls-container">
                            <IonSelect
                                aria-label="Select a style for the answer"
                                interface="popover"
                                placeholder="Select style"
                                onIonChange={e => setPaperQueryStyle(e.detail.value)}
                                className="style-select"
                            >
                                <IonSelectOption value="academic">Academic</IonSelectOption>
                                <IonSelectOption value="formal">Formal</IonSelectOption>
                                <IonSelectOption value="informal">Informal</IonSelectOption>
                                <IonSelectOption value="humorous">Humorous</IonSelectOption>
                            </IonSelect>

                            <IonButton
                                onClick={() => {
                                    startPaperAnalysis(paperFile, paperQueryStyle).then(r => {
                                        if (r) {
                                            router.push(`/chat/${r}`, 'forward');
                                        }
                                    });
                                }}
                                className="start-analysis-button  icon-button"
                                disabled={loading}
                            >
                                {!loading ? <IonIcon slot="icon-only" icon={chevronForwardSharp}></IonIcon> : <IonSpinner></IonSpinner>}
                            </IonButton>
                        </div>
                    </IonContent>
                </IonModal>

                <IonFab horizontal="end" vertical="bottom" slot="fixed">
                    <IonFabButton>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>

                    <IonFabList side="top">
                        <IonFabButton id="paper-modal-button">
                            <IonIcon icon={documentIcon} />
                        </IonFabButton>

                        <IonFabButton id="chat-modal-button">
                            <IonIcon icon={chatboxEllipses} />
                        </IonFabButton>
                    </IonFabList>
                </IonFab>

                <div className="chat-list-container">
                    <IonList className="list">
                        {chats.map(chat => (
                            <IonItem className="list-item" key={chat.id}>
                                <IonLabel className="item-label" onClick={() => router.push(`/chat/${chat.id}`, 'forward')}>
                                    <h2>{chat.title}</h2>
                                    <div className="item-details">
                                        <p className="chat-type">{chat.type === 'chat' ? "Chat" : "Paper Analysis"}</p>
                                        <p>{new Intl.DateTimeFormat('en-GB', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        }).format(new Date(chat.timestamp))}</p>
                                    </div>
                                </IonLabel>
                                <IonIcon className="icon" icon={trashSharp} slot="end" onClick={() => onDeleteChat(chat.id)} />
                            </IonItem>
                        ))}
                    </IonList>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default ChatListPage;
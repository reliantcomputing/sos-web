import { useEffect, useState } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import { ChatList } from "react-chat-elements";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";

export const Chat = () => {
    const [messages, setMessages] = useState([
        new Message({
            id: 1,
            message: "I'm the recipient! (The person you're talking to)",
        }), // Gray bubble
        new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
    ]);

    const chats = useSelector((state) => state.chats);
    const user = useSelector((state) => state.user);
    const chatChannel = useSelector((state) => state.channels.chatChannel);
    const [chat, setChat] = useState({});
    const [text, setText] = useState("");

    console.log(chats);
    useEffect(() => {
        if (chat.id) {
            setChat(chats.find((c) => c.id == chat.id));
        }
    }, [chats]);

    const renderChats = (_chat) => {
        return (
            <div style={{ height: 70, borderBottom: "solid", borderBottomWidth: 0.5, padding: 10, borderBottomColor: "white" }}>
                <div
                    className="row"
                    onClick={() => {
                        setChat(_chat);
                    }}
                >
                    <div className="col-md-2">
                        <img className="img-fluid" src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.clker.com%2Fcliparts%2Fd%2FL%2FP%2FX%2Fz%2Fi%2Fno-image-icon-md.png&f=1&nofb=1" />
                    </div>
                    <div className="col-md-10">
                        <h4 style={{ margin: 0, padding: 0, fontWeight: "bold", color: "white" }}>{_chat.name}</h4>
                        {/* <p style={{ margin: 0, padding: 0, color: "white" }}>{_chat.messages.length > 0 ? _chat.messages[_chat.messages.length - 1] : "No messages"}</p> */}
                    </div>
                </div>
            </div>
        );
    };

    const renderChatsWithAccept = (chat) => {
        return (
            <div style={{ height: 110, borderBottom: "solid", borderBottomWidth: 0.5, padding: 10, borderBottomColor: "white" }}>
                <div className="row">
                    <div className="col-md-2">
                        <img className="img-fluid" src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.clker.com%2Fcliparts%2Fd%2FL%2FP%2FX%2Fz%2Fi%2Fno-image-icon-md.png&f=1&nofb=1" />
                    </div>
                    <div className="col-md-10">
                        <h4 style={{ margin: 0, padding: 0, fontWeight: "bold", color: "white" }}>{"Chat request from sit #" + chat.sit_number}</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Button
                            onClick={() => {
                                let payload = {
                                    sit_number: "1",
                                    waiter_id: user.id,
                                };
                                chatChannel.push("accept:chat", payload);
                            }}
                            className="p-button-success mt-2"
                            label="Accept"
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="row">
            <div className="col-md-4">
                <div style={{ backgroundColor: "#0084FF", height: 750 }}>
                    {chats.map((chat, index) => {
                        if (chat.id) {
                            return renderChats(chat);
                        } else {
                            return renderChatsWithAccept(chat);
                        }
                    })}
                </div>
            </div>
            <div className="col-md-8">
                <ChatFeed
                    messages={chat.messages ? chat.messages : []} // Array: list of message objects
                    isTyping={false} // Boolean: is the recipient typing
                    hasInputField={false} // Boolean: use our input, or use your own
                    showSenderName // show the name of the user who sent the message
                    bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
                    // JSON: Custom bubble styles
                    bubbleStyles={{
                        text: {
                            fontSize: 15,
                        },
                        chatbubble: {
                            borderRadius: 70,
                            padding: 13,
                        },
                    }}
                />
                {chat.id && (
                    <div className="row mt-4">
                        <div className="col-md-6">
                            <InputTextarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message" className="form-control" />
                        </div>
                        <div className="col-md-4">
                            <Button
                                label="Send"
                                onClick={() => {
                                    console.log("================================", chat);
                                    chatChannel.push(`send:message:${chat.id}`, {
                                        seen: false,
                                        user_id: "1",
                                        text: text,
                                        message_from: "WAITER",
                                    });
                                    setText("");
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

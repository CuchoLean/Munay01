// src/components/ChatModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ChatModal = ({
  show,
  onHide,
  currentUser,
  receiverUser,
  chatHistory,
  onUpdateMessages,
}) => {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState([]);

  const stompClient = useRef(null);

  useEffect(() => {
    if (!show || !receiverUser) return;

    setLocalMessages(chatHistory || []);

    const socket = new SockJS(`http://localhost:8080/ws`);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to server", stompClient.current);

        stompClient.current.subscribe(
          `/user/${currentUser}/private`,
          (message) => {
            const parsedMessage = JSON.parse(message.body);

            // ✅ Asegúrate que solo se agreguen mensajes de esta conversación
            if (
              parsedMessage.senderName === receiverUser ||
              parsedMessage.receiverName === receiverUser
            ) {
              setLocalMessages((prev) => {
                const updated = [...prev, parsedMessage];
                onUpdateMessages(receiverUser, updated); // 🔄 actualiza el padre también
                return updated;
              });
            }
          }
        );
      },
      debug: (str) => console.log(str),
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [show, receiverUser]); // 👈 incluye receiverUser como dependencia

  const sendMessage = () => {
    if (stompClient.current && stompClient.current.connected) {
      const message = {
        senderName: currentUser,
        receiverName: receiverUser,
        message: input,
      };
      stompClient.current.publish({
        destination: "/app/private-message",
        body: JSON.stringify(message),
      });
      const updated = [...localMessages, message];
      setLocalMessages(updated);
      onUpdateMessages(receiverUser, updated);
      setInput("");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chat con {receiverUser}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ maxHeight: "400px", minHeight: "150px", overflowY: "auto" }}
      >
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.senderName === currentUser ? "right" : "left",
            }}
          >
            <strong>{msg.senderName}</strong>: {msg.message}
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Form.Control
          type="text"
          value={input}
          placeholder="Escribe tu mensaje..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button variant="primary" onClick={sendMessage}>
          Enviar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatModal;

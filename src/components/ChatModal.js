// src/components/ChatModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ChatModal = ({ show, onHide, currentUser, receiverUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const stompClient = useRef(null);
  const token = localStorage.getItem("accessToken"); // Asegúrate que este sea tu JWT


  useEffect(() => {
    if (show) {
const socket = new SockJS(`http://localhost:8080/us?token=Bearer ${token}`);
    stompClient.current = new Client({
  webSocketFactory: () => socket,
  onConnect: () => {
    stompClient.current.subscribe('/user/queue/private', (message) => {
  setMessages((prev) => [...prev, JSON.parse(message.body)]);
});
  },
  debug: (str) => console.log(str),
});

      stompClient.current.activate();
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [show]);

  const sendMessage = () => {
    if (stompClient.current && stompClient.current.connected) {
      const message = {
        senderName: currentUser,
        receiverName: receiverUser,
        content: input,
      };
      stompClient.current.publish({
        destination: "/app/private-message",
        body: JSON.stringify(message),
      });
      setMessages((prev) => [...prev, message]);
      setInput("");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chat con {receiverUser}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.senderName === currentUser ? "right" : "left",
            }}
          >
            <strong>{msg.senderName}</strong>: {msg.content}
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

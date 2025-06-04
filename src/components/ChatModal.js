// src/components/ChatModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

const ChatModal = ({
  show,
  onHide,
  currentUser,
  receiverUser,
  receiverName,
  onUpdateMessages,
}) => {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const token = localStorage.getItem("accessToken");
  const currentName = "Tú";
  const stompClient = useRef(null);
  const bottomRef = useRef(null); // 👈 ref para scroll automático

  useEffect(() => {
    if (!show || !receiverUser) return;

    // Cargar historial de mensajes desde backend
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/mensajes/historial",
          {
            params: { user1: currentUser, user2: receiverUser },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLocalMessages(response.data);
        onUpdateMessages(receiverUser, response.data);
      } catch (error) {
        console.error("Error cargando historial:", error);
        setLocalMessages([]); // opcional para limpiar si falla
        onUpdateMessages(receiverUser, []);
      }
    };

    fetchHistory();

    const socket = new SockJS(`http://localhost:8080/ws`);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.current.subscribe(
          `/user/${currentUser}/private`,
          (message) => {
            const parsedMessage = JSON.parse(message.body);

            if (
              parsedMessage.senderName === receiverUser ||
              parsedMessage.receiverName === receiverUser
            ) {
              setLocalMessages((prev) => {
                const updated = [...prev, parsedMessage];
                onUpdateMessages(receiverUser, updated);
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
  }, [show, receiverUser]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [localMessages]);

  const sendMessage = async () => {
    if (stompClient.current && stompClient.current.connected) {
      const message = {
        senderName: currentUser,
        receiverName: receiverUser,
        message: input,
      };
      try {
        const response = await axios.post(
          "http://localhost:8080/mensajes/crear",
          message,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const savedMessage = response.data; // mensaje con id, fecha, etc.

        // Enviar por websocket para notificar al receptor
        stompClient.current.publish({
          destination: "/app/private-message",
          body: JSON.stringify(savedMessage),
        });

        // Actualizar estado local y padre con el mensaje guardado
        const updated = [...localMessages, savedMessage];
        setLocalMessages(updated);
        onUpdateMessages(receiverUser, updated);
        setInput("");
      } catch (error) {
        console.error("Error guardando mensaje:", error);
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chat con {receiverName}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ maxHeight: "400px", minHeight: "150px", overflowY: "auto" }}
      >
        {localMessages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.senderName === currentUser ? "right" : "left",
            }}
          >
            <strong>
              {msg.senderName === currentUser ? currentName : receiverName}
            </strong>
            : {msg.message}{" "}
          </div>
        ))}
        <div ref={bottomRef} /> {/* 👈 Marcador de scroll */}
      </Modal.Body>
      <Modal.Footer>
        <InputGroup>{/*en una sola linea*/}
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
        </InputGroup>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatModal;

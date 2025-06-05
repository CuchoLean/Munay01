import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import MensajeService from "../services/MensajeService";

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
  const [isLoading, setIsLoading] = useState(true);
  const currentName = "Tú";
  const stompClient = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!show || !receiverUser) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await MensajeService.fetchHistorial(
          currentUser,
          receiverUser
        );
        setLocalMessages(response.data);
        onUpdateMessages(receiverUser, response.data);
      } catch (error) {
        console.error("Error cargando historial:", error);
        setLocalMessages([]);
        onUpdateMessages(receiverUser, []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();

    const socket = new SockJS(`http://munayaws.duckdns.org:8080/ws`);
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
      if (stompClient.current) stompClient.current.deactivate();
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
        const response = await MensajeService.crearMensaje(message);
        const savedMessage = response.data;
        stompClient.current.publish({
          destination: "/app/private-message",
          body: JSON.stringify(savedMessage),
        });

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
        style={{
          height: "400px",
          minHeight: "150px",
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#f5f5f5", // Fondo gris suave
        }}
      >
        {localMessages.length === 0 && !isLoading ? (
          <div style={{ textAlign: "center", color: "gray" }}>
            Esto va a ser el inicio de una bonita historia
          </div>
        ) : (
          localMessages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  msg.senderName === currentUser ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "10px 15px",
                  borderRadius: "20px",
                  backgroundColor:
                    msg.senderName === currentUser
                      ? "#e1bee7" // Morado claro para mensajes enviados
                      : "#c5a7e2", // Ajuste de color más opaco para los mensajes recibidos
                  color: msg.senderName === currentUser ? "black" : "black", // Asegurar que el color del texto sea oscuro
                  fontSize: "14px",
                  position: "relative",
                  opacity: 1, // Asegurando que la opacidad sea 100% para todos los mensajes
                  wordWrap: "break-word", // Asegura que el texto se ajuste dentro del mensaje
                  overflowWrap: "break-word", // Rompe las palabras largas si es necesario
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  {msg.senderName === currentUser ? currentName : receiverName}
                </div>
                <div>{msg.message}</div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div style={{ textAlign: "center", color: "gray" }}>
            Cargando mensajes..
          </div>
        )}
        <div ref={bottomRef} /> {/* 👈 Marcador de scroll */}
      </Modal.Body>
      <Modal.Footer>
        <InputGroup>
          <Form.Control
            type="text"
            value={input}
            placeholder="Escribe tu mensaje..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{
              minWidth: "250px", // Asegura que el input no sea demasiado pequeño
            }}
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

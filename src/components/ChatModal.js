import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form, InputGroup, Spinner } from "react-bootstrap";
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
        className="d-flex flex-column"
        style={{ height: "400px", overflowY: "auto", backgroundColor: "#f5f5f5", padding: "20px" }}
      >
        {isLoading && (
          <div className="text-center text-muted my-auto">
            <Spinner animation="border" size="sm" /> Cargando mensajes...
          </div>
        )}

        {!isLoading && localMessages.length === 0 && (
          <div className="text-center text-muted my-auto">
            Esto va a ser el inicio de una bonita historia
          </div>
        )}

        {!isLoading && localMessages.map((msg, i) => {
          const isSender = msg.senderName === currentUser;
          return (
            <div
              key={i}
              className={`d-flex mb-2 justify-content-${isSender ? "end" : "start"}`}
            >
              <div
                className={`p-3 rounded-3 text-break`}
                style={{
                  maxWidth: "75%",
                  backgroundColor: isSender ? "#e1bee7" : "#c5a7e2",
                  color: "black",
                }}
              >
                <div className="fw-bold mb-1">
                  {isSender ? currentName : receiverName}
                </div>
                <div>{msg.message}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </Modal.Body>
      <Modal.Footer>
        <InputGroup>
          <Form.Control
            type="text"
            value={input}
            placeholder="Escribe tu mensaje..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{ minWidth: "250px" }}
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

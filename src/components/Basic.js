// Подключаем стили и необходимые библиотеки React и иконки
import "./chatBot.css";
import React, { useState, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import { BiBot, BiUser } from "react-icons/bi";

function Basic() {
  // Состояние для хранения истории чата
  const [chat, setChat] = useState([]);
  // Состояние для хранения введенного пользователем сообщения
  const [inputMessage, setInputMessage] = useState("");
  // Состояние для отображения состояния набора сообщения ботом
  const [botTyping, setbotTyping] = useState(false);

  // Хук useEffect, который прокручивает область чата вниз при изменении чата
  useEffect(() => {
    console.log("called");
    const objDiv = document.getElementById("messageArea");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [chat]); // Вызов срабатывает при каждом изменении массива chat

  // Обработчик отправки сообщения
  const handleSubmit = (evt) => {
    evt.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы
    const name = "PractikumStudent"; // Имя пользователя
    const request_temp = { sender: "user", sender_id: name, msg: inputMessage };

    if (inputMessage !== "") {
      // Добавляем сообщение пользователя в историю чата
      setChat((chat) => [...chat, request_temp]);
      setbotTyping(true); // Устанавливаем состояние "бот печатает"
      setInputMessage(""); // Очищаем поле ввода
      rasaAPI(name, inputMessage); // Вызываем функцию для отправки сообщения на сервер Rasa
    } else {
      window.alert("Please enter valid message"); // Предупреждение, если сообщение пустое
    }
  };

  // Функция для отправки сообщения на сервер Rasa и получения ответа
  const rasaAPI = async function handleClick(name, msg) {
    await fetch("http://192.168.0.198:5005/webhooks/rest/webhook", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        charset: "UTF-8",
      },
      credentials: "same-origin",
      body: JSON.stringify({ sender: name, message: msg }),
    })
      .then((response) => response.json()) // Преобразуем ответ в JSON
      .then((response) => {
        if (response) {
          // Получаем текстовое сообщение от бота
          const temp = response[0];
          const recipient_id = temp["recipient_id"];
          const recipient_msg = temp["text"];

          // Создаем объект ответа бота
          const response_temp = {
            sender: "bot",
            recipient_id: recipient_id,
            msg: recipient_msg,
          };
          setbotTyping(false); // Останавливаем индикацию "бот печатает"

          // Добавляем сообщение бота в историю чата
          setChat((chat) => [...chat, response_temp]);
        }
      });
  };

  console.log(chat); // Для отладки, выводим текущее состояние чата в консоль

  // Стили для карточки чата, заголовка, тела и нижней части
  const stylecard = {
    maxWidth: "35rem",
    border: "1px solid black",
    paddingLeft: "0px",
    paddingRight: "0px",
    borderRadius: "30px",
    boxShadow: "0 16px 20px 0 rgba(0,0,0,0.4)",
  };
  const styleHeader = {
    height: "4.5rem",
    borderBottom: "1px solid black",
    borderRadius: "30px 30px 0px 0px",
    backgroundColor: "#1C57CD",
  };
  const styleFooter = {
    borderTop: "1px solid black",
    borderRadius: "0px 0px 30px 30px",
    backgroundColor: "#1C57CD",
  };
  const styleBody = {
    paddingTop: "10px",
    height: "28rem",
    overflowY: "auto",
    overflowX: "hidden",
  };

  return (
    <div>
      {/* Основная разметка страницы с компонентом чата */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="card" style={stylecard}>
            {/* Заголовок чата */}
            <div className="cardHeader text-white" style={styleHeader}>
              <h1 style={{ marginBottom: "0px" }}>AI-Архитектор</h1>
              {botTyping ? <h6>AI-ассистент печатает....</h6> : null}{" "}
              {/* Отображение индикации "ассистент печатает" */}
            </div>
            {/* Тело чата, где отображаются сообщения */}
            <div className="cardBody" id="messageArea" style={styleBody}>
              <div className="row msgarea">
                {chat.map((user, key) => (
                  <div key={key}>
                    {user.sender === "bot" ? (
                      <div className="msgalignstart">
                        <BiBot className="botIcon" />
                        <h5 className="botmsg">{user.msg}</h5>
                      </div>
                    ) : (
                      <div className="msgalignend">
                        <h5 className="usermsg">{user.msg}</h5>
                        <BiUser className="userIcon" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Форма ввода для отправки сообщений */}
            <div className="cardFooter text-white" style={styleFooter}>
              <div className="row">
                <form style={{ display: "flex" }} onSubmit={handleSubmit}>
                  <div className="col-10" style={{ paddingRight: "0px" }}>
                    <input
                      onChange={(e) => setInputMessage(e.target.value)}
                      value={inputMessage}
                      type="text"
                      className="msginp"
                    ></input>
                  </div>
                  <div className="col-2 cola">
                    <button type="submit" className="circleBtn">
                      <IoMdSend className="sendBtn" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Basic;

import React, { useState, useEffect } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { BiBold } from 'react-icons/bi'
import { FiItalic } from 'react-icons/fi'
import { IoIosSave } from 'react-icons/io'
import { IoMdArrowRoundForward } from 'react-icons/io'
import { useAuth } from '../context/authContext';
import { Dropdown } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InputBox(props) {

    const [rows, setRows] = useState(0);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [phoneListTitle, setPhoneListTitle] = useState("");
    const [showNewMessageBox, setShowNewMessageBox] = useState(false);
    const [showNewPhonesBox, setShowNewPhonesBox] = useState(false);
    const [preProcessedPhones, setPreProcessedPhones] = useState("");
    const [processedPhones, setProcessedPhones] = useState([]);

    const { user, myMessages, myPhoneLists, getMessages, getPhoneLists, serverBaseUrl } = useAuth()

    /* MANEJA EL "LIMPIAR" LAS CAJAS DE TEXTO */
    function handleDelete(inputBox) {
        if (inputBox === "messageBox") {
            setMessage(() => "");
            props.setWhatsappLinks(() => [])
        } else if (inputBox === "phoneBox") {
            setProcessedPhones(() => [])
            setPreProcessedPhones(() => "")
            props.setWhatsappLinks(() => [])
        }
    }
    /* MANEJA EL CAMBIO A NEGRITAS Y CURSIVA DEL TEXTO SELECCIONADO */
    function handleTextModification(type) {
        let textArea = document.getElementById('messageTextArea');
        let indexBeginningSelection = textArea.selectionStart;
        let indexEndingSelection = textArea.selectionEnd;
        let selectedText = message.substring(indexBeginningSelection, indexEndingSelection)
        let textBeforeSelection = message.substring(0, indexBeginningSelection)
        let textAfterSelection = message.substring(indexEndingSelection)
        if (type === 'bold') {
            let boldedText = "*" + selectedText + "*"
            setMessage(textBeforeSelection + boldedText + textAfterSelection);
        } else if (type === 'italic') {
            let italickedTExt = "_" + selectedText + "_"
            setMessage(textBeforeSelection + italickedTExt + textAfterSelection);
        }
    }
    /* MANEJA EL MOSTRAR Y OCULTAR EL INPUT PARA GUARDAR UN MENSAJE  */
    const handleShowSaveContent = () => {
        if (props.type === "messageBox") {
            setShowNewMessageBox((prevState) => !prevState)
        } else if (props.type === "phoneBox") {
            setShowNewPhonesBox((prevState) => !prevState)
        }
    }
    /* MUESTRA EL MENSAJE SELECCIONADO EN LA CAJA DE MENSAJES */
    const handleSetMessage = (id) => {
        let receivedMessage = myMessages.find(o => o._id === id)
        setMessage(receivedMessage.message)
    }
    /* DA FORMATO A LOS TELÉFONOS Y VERIFICA QUE NO HAYA TEXTO */
    function handlePhones(phonesAsText) {
        const regExp = /[a-zA-Z]/g;
        let phonesSeparatedByLine = phonesAsText.split('\n');
        setProcessedPhones(() => [])
        props.setWhatsappLinks(() => [])
        let phonesWithNoSpaces = [];
        phonesSeparatedByLine.forEach(phone => {
            if (regExp.test(phone)) {
                return
            } else {
                let numbers = phone.split(' ');
                phonesWithNoSpaces = [...phonesWithNoSpaces, numbers[0]];
            }
        })
        phonesWithNoSpaces.forEach(phone => {
            if (phone.charAt(0) === "+") { /*+593989803423*/
                setProcessedPhones(oldArray => [...oldArray, phone.substring(1)])
            } else if (phone.charAt(0) === "0" && phone.charAt(1) === "0") { /*00593984505619*/
                setProcessedPhones(oldArray => [...oldArray, phone.substring(2, phone.length)])
            } else if (phone.charAt(0) === "5") {
                setProcessedPhones(oldArray => [...oldArray, phone])
            }
            else if (phone === "") {
                return;
            }
        });
    }
    useEffect(() => {
        if (processedPhones.length !== 0) {
            createLinks();
        }
    }, [processedPhones])
    /* CREA LOS LINKS PARA LOS NUEVOS MENSAJES DE WHATSAPP */
    function createLinks() {
        processedPhones.forEach(phone => {
            props.setWhatsappLinks(oldArray => [...oldArray, { "telefono": phone, "enlace": "https://api.whatsapp.com/send?phone=" + phone + "&text=" + encodeURIComponent(message) }]);

        })
    }
    /* MUESTRA LA LISTA DE TELÉFONOS SELECCIONADA EN LA CAJA DE TELÉFONOS */
    const handleSetPhoneLists = (id) => {
        let receivedPhoneList = myPhoneLists.find(o => o._id === id)
        setPreProcessedPhones(receivedPhoneList.phoneList)
    }
    /* MANEJA EL CAMBIO DEL VALOR DEL INPUT DEL TITULO DEL NUEVO MENSAJE */
    const handleTitleChange = (newTitle) => {
        setTitle((prevTitle) => newTitle)
    }
    /* MANEJA EL CAMBIO DEL VALOR DEL INPUT DEL TITULO DE LOS NUEVOS TELÉFONOS */
    const handlePhoneTitleChange = (newTitle) => {
        setPhoneListTitle((prevTitle) => newTitle)
    }
    /* PETICIÓN A LA API PARA CREAR UN NUEVO MENSAJE EN LA BBDD */
    const handleSaveMessage = async () => {
        await fetch(serverBaseUrl + 'newMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    title: title,
                    message: message,
                    email: user.email
                }
            )
        })
            .then(
                data => {
                    toast.success('Mensaje guardado', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            )
        getMessages();
        handleShowSaveContent()
    }
    const handleSavePhoneList = async () => {
        await fetch(serverBaseUrl + 'newPhoneList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    title: phoneListTitle,
                    phoneList: preProcessedPhones,
                    email: user.email
                }
            )
        })
            .then(
                data => {
                    toast.success('Teléfonos guardados', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            )
        getPhoneLists();
        handleShowSaveContent()
    }

    useEffect(() => {
        if (props.type === "messageBox") {
            setRows(10)
        } else if (props.type === "phoneBox") {
            setRows(5)
        }
    }, [props.type])

    useEffect(() => {
        if (preProcessedPhones !== "") {
            props.setRawPhones(preProcessedPhones)
        }
    }, [preProcessedPhones])

    return (
        <div>
            <ToastContainer />
            <div className='border border-dark border-2 textAreaBox mt-4'>
                <div className='row'>
                    <div className="input-group input-group-lg px-3 py-1">
                        <textarea id='messageTextArea' placeholder={props.type === "messageBox" ? "Pon tu mensaje aquí" : props.type === "phoneBox" ? "Números telefónicos" : ""} style={{ border: "none", outline: "none", width: "100%" }} className="p-2 textAreaBox" rows={rows} value={props.type === "messageBox" ? message : props.type === "phoneBox" ? preProcessedPhones : ""} onChange={(event) => props.type === "messageBox" ? setMessage(event.target.value) : props.type === "phoneBox" ? setPreProcessedPhones(event.target.value) : ""} spellCheck="true"></textarea>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-1 ms-2'>
                        <FiTrash2 onClick={() => handleDelete(props.type)} className='mb-3' style={{ cursor: "pointer" }} size={30} />
                    </div>
                    {props.type === "messageBox" ? (
                        <>
                            <div className='col-1 '>
                                <BiBold onMouseDown={() => handleTextModification('bold')} className='mb-3' style={{ cursor: "pointer" }} size={30} />
                            </div>
                            <div className='col-1'>
                                <FiItalic onMouseDown={() => handleTextModification('italic')} className='mb-3' style={{ cursor: "pointer" }} size={30} />
                            </div></>) : ""}
                    {user &&
                        <div className='col-1'>
                            <IoIosSave onMouseDown={handleShowSaveContent} className='mb-3' style={{ cursor: "pointer" }} size={30} />
                        </div>
                    }
                    {user &&
                        <div className='col-1'>
                            {props.type === "messageBox" ? (
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                                        Mis mensajes guardados
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {myMessages.map(fetchedMessage => {
                                            return <Dropdown.Item key={fetchedMessage._id} onClick={(e) => handleSetMessage(fetchedMessage._id)}>{fetchedMessage.title}</Dropdown.Item>
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : props.type === "phoneBox" ? (
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                                        Mis teléfonos guardados
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {myPhoneLists.map(fetchedPhoneList => {
                                            return <Dropdown.Item key={fetchedPhoneList._id} onClick={(e) => handleSetPhoneLists(fetchedPhoneList._id)}>{fetchedPhoneList.title}</Dropdown.Item>
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : ""}
                        </div>}
                    {props.type === "messageBox" ? (
                        <div className='col text-end me-2'>
                            <IoMdArrowRoundForward onMouseDown={() => handlePhones(props.rawPhones)} className='mb-3' style={{ cursor: "pointer", color: '#147DF5' }} size={30} />
                        </div>
                    ) : ""}
                </div>
            </div>
            {showNewMessageBox ?
                <div>
                    <div className="row g-3 align-items-center mt-2">
                        <div className="col-auto">
                            <label htmlFor="inputPassword6" className="col-form-label">Nuevo mensaje guardado</label>
                        </div>
                        <div className="col-auto input-group mb-3">
                            <input type="text" className="form-control" aria-label="New message" id="newMessage" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder='Titulo del mensaje' />
                            <button type="button" className="btn btn-outline-success" onClick={handleSaveMessage}>Guardar</button>
                        </div>
                    </div>
                </div>
                : ''}
            {showNewPhonesBox ?
                <div>
                    <div className="row g-3 align-items-center mt-2">
                        <div className="col-auto">
                            <label htmlFor="inputPassword6" className="col-form-label">Nueva lista de teléfonos</label>
                        </div>
                        <div className="col-auto input-group mb-3">
                            <input type="text" className="form-control" aria-label="New message" id="newMessage" value={phoneListTitle} onChange={(e) => handlePhoneTitleChange(e.target.value)} placeholder='Título de la lista' />
                            <button type="button" className="btn btn-outline-success" onClick={handleSavePhoneList}>Guardar</button>
                        </div>
                    </div>
                </div>
                : ''}
        </div>
    )
}

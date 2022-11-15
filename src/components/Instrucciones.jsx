import React from 'react'
import { IoMdArrowRoundForward } from 'react-icons/io'

export default function Instrucciones(props) {

    return (
        <>
            {
                props.type === "message" ? (
                    <div className='col mt-4' style={{ color: 'gray' }}>
                        <h2>Instrucciones</h2>
                        <p>En la primera caja deberás escribir el mensaje que quieras enviar a tus contactos.</p>
                        <p>Puedes usar el botón de <b>B</b> para que el texto seleccionado se envíe en formato de negrita en whatsapp.</p>
                        <p>También puedes usar el botón de <b><i>I</i></b> para que el texto que selecciones se envíe en formato de cursiva en whatsapp.</p>
                        <br />
                        <p>Una vez que hayas escrito tu mensaje e ingresado los teléfonos, podrás dar click en el botón de <b><IoMdArrowRoundForward></IoMdArrowRoundForward></b> para generar los enlaces de whatsapp.</p>
                    </div>
                ) : props.type === "phones" ? (
                    <div className='col mt-4' style={{ color: 'gray' }}>
                        <p>En la segunda caja deberás escribir, en forma de lista, los teléfonos a donde quieres enviar tu mensaje y deberán estar en los siguientes formatos: </p>
                        <p>Código del país (+34, +593, +52, etc.) <b>+</b> teléfono. Por ejemplo: +59322505660 ó +525536017599</p>
                        <p>2 ceros (00) <b>+</b> código del país (34, 593, 52, etc.) <b>+</b> teléfono. Por ejemplo: 0059322505660 ó 00525536017599</p>
                        <p>Código del país (34, 593, 52, etc.) <b>+</b> teléfono. Por ejemplo: 59322505660 ó 525536017599</p>
                    </div>
                ) : ""
            }
        </>
    )
}

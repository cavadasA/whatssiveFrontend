import React, { useState } from 'react'
import Row from './Row';
import InputBox from './InputBox';
import Instrucciones from './Instrucciones';

export default function Main() {

    const [rawPhones, setRawPhones] = useState([]);
    const [whatsappLinks, setWhatsappLinks] = useState([]);

    return (
        <div className='row' >
            <div className='col px-4 py-2'>
                <div className='row sticky-top' style={{top: 50}}>
                    <div className={whatsappLinks.length === 0 ? "col-6" : "col-12"}>
                        <InputBox type="messageBox" rawPhones={rawPhones} setWhatsappLinks={setWhatsappLinks} />
                    </div>
                    {whatsappLinks.length === 0 ? (
                            <Instrucciones type="message" />
                        ) : ''}
                    <div className={whatsappLinks.length === 0 ? "col-6" : "col-12"}>
                        <InputBox type="phoneBox" setRawPhones={setRawPhones} setWhatsappLinks={setWhatsappLinks} />
                    </div>
                    {whatsappLinks.length === 0 ? (
                        <Instrucciones type="phones" />
                    ) : ''}
                </div>
            </div>
            {whatsappLinks.length !== 0 ? (
                <div className='col px-4 py-4'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Enlace</th>
                                <th scope="col">Enviado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {whatsappLinks.map((link, index) => {
                                return (
                                    <Row index={index} link={link} key={index}></Row>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : ''}
        </div>
    )
}

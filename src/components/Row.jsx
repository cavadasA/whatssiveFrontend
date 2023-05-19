import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FiSend } from 'react-icons/fi'
import { BiWindows } from 'react-icons/bi'


export default function Row(props) {

    const [checked, setChecked] = useState(false)
    function handleChecked(index) {
        if (checked === false) {
            return setChecked(() => true);
        } else {
            return setChecked(() => false);
        }
    }

    return (
        <tr className={checked ? "table-success" : ""}>
            <th scope="row">{props.index + 1}</th>
            <td>+{props.link.telefono}</td>
            <td><a href="#" ><FiSend size={30} style={{ color: "pink" }} onClick={() => {
                handleChecked(props.index); 
                window.open(props.link.enlace, "Test1")
                setTimeout(() => {
                    window.open(props.link.enlace, "Horror")

                }, 500)
            }} /></a></td>
            <td className='text-center'>
                <div className="form-check d-flex justify-content-center align-items-center">
                    <input className="form-check-input text-end" type="checkbox" checked={checked} id={"prueba" + props.index} onChange={() => handleChecked(props.index)} />
                </div>
            </td>
        </tr>
    )
}

Row.propTypes = {
    index: PropTypes.number,
    link: PropTypes.object
}
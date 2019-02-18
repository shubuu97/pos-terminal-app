import React from 'react';
import Dropzone from 'react-dropzone';

let dropzoneButton = (props) => {
  const dropzoneRef = React.createRef();

  return (
    <div className='dropzone-button'>
      <Dropzone
        style={{}}
        ref={dropzoneRef}
        onDrop={(accept, reject) => props.onDrop(accept, reject, props.fieldName)}>
      </Dropzone>

      <button type="button" className="btnsecondary" onClick={() => { dropzoneRef.current.open() }}>
        {props.name}
      </button>
    </div>)
}
export default dropzoneButton;
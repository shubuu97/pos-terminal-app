import React from 'react';
import Input from 'material-ui/Input/Input';
import FormControl from 'material-ui/Form/FormControl';
import FormHelperText from 'material-ui/Form/FormHelperText';

export function GenericInput({ ariaDescribedBy,htmlFor,displayName,inputName,defaultValue,disabled,onChange,
    onBlur, errorMessage, error, errorValue, className, touched, touchedValue, errorCheck=true, type='text'}) {
    return (
        <FormControl className="custom-input" style={{width: "100%", fontSize: "14px" }}>
            {/* <InputLabel htmlFor={htmlFor}>{displayName}</InputLabel> */}
            <Input name={inputName} value={defaultValue} type={type}
            disabled={disabled}
            placeholder={displayName}
            onChange={onChange}
            onBlur={onBlur} />
            {errorCheck && error && errorValue && touched && touchedValue && (
            <div className={className}><FormHelperText >
            {errorMessage}
            </FormHelperText></div> 
            )}              
        </FormControl>
    )
    
   
    
  }
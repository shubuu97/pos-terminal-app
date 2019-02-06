import React from 'react';
import Button from "react-bootstrap/lib/Button";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import AddIcon from 'material-ui-icons/Add';
import MuiButton from 'material-ui/Button';
import Icon from 'material-ui/Icon';

export default function SaveButton(props={ title:'',disabled:false, buttonDisplayText:'',ButtonType: '',Class_Name: '',Span_Class_Name: '', handlerSearch: function(){} }){
  
  return(<Button type={props.ButtonType} disabled={props.disabled} title={props.title} className={props.Class_Name}  onClick={props.handlerSearch}>
    <span className={props.Span_Class_Name}/>&nbsp;{props.buttonDisplayText}
  </Button>)
}

function GenericButton({ btnType, btnText, btnClassName, insertSpaceAfterIcon, children, onClickHandler, disabled=false }) {
  return (
    <Button type={btnType} className={btnClassName} onClick={onClickHandler} disabled={disabled}>
      {children}{insertSpaceAfterIcon ? ' ':''}
      {btnText}
    </Button>
  )
}

export function EditButton({ btnText, btnClassName, insertSpaceAfterIcon, children, onClickHandler, disabled=false }) {
  return (
    <GenericButton btnText={btnText} disabled={disabled} insertSpaceAfterIcon={insertSpaceAfterIcon} btnType="button" btnClassName={btnClassName || 'btn btn-info'} onClickHandler ={onClickHandler || function(){ alert('no action on click')}}>
      {children || <span className="glyphicon glyphicon-edit"></span>}
    </GenericButton>
  )
}

export function AddNewButton({ btnText, btnClassName,insertSpaceAfterIcon, btnSpace='', children, onClickHandler, disabled=false }) {
  return (
    <GenericButton btnText={btnText} insertSpaceAfterIcon={insertSpaceAfterIcon} disabled={disabled} btnType="button" btnClassName={btnClassName || 'btn btn-info'} onClickHandler ={onClickHandler || function(){ alert('no action on click')}}>
      {children || <span className="glyphicon glyphicon-plus-sign"></span>}
    </GenericButton>
  )
}

export function SaveButtonV1({ btnText, btnClassName, insertSpaceAfterIcon, children, onClickHandler, disabled=false }) {
  return (
    <GenericButton btnText={btnText} insertSpaceAfterIcon={insertSpaceAfterIcon} btnType="button" 
    btnClassName={btnClassName || 'btn btn-info'} disabled={disabled}
    onClickHandler ={onClickHandler || function(){ alert('no action on click')}}>
      {children || <span className=""></span>}
    </GenericButton>
  )
}


export function SearchButton({ btnText, btnClassName, insertSpaceAfterIcon, children, onClickHandler, disabled=false }) {
  return (
    <GenericButton btnText={btnText} insertSpaceAfterIcon = {insertSpaceAfterIcon} btnType="button" btnClassName={btnClassName || 'btn btn-default'} onClickHandler ={onClickHandler || function(){ alert('no action on click')}}>
      {children || <span className="glyphicon glyphicon-search"></span>}
    </GenericButton>
  )
}

export function CancelButton({ btnText, btnClassName, insertSpaceAfterIcon, children, onClickHandler }) {
  return (
    <GenericButton btnText={btnText} insertSpaceAfterIcon = {insertSpaceAfterIcon} btnType="button" btnClassName={btnClassName || 'btn btn-default'} onClickHandler ={onClickHandler || function(){ alert('no action on click')}}>
      {children || <span className=""></span>}
    </GenericButton>
  )
}

export function ResetButton({ btnText, btnClassName, insertSpaceAfterIcon, children, onClickHandler }) {
  return (
    <GenericButton btnText={btnText} insertSpaceAfterIcon={insertSpaceAfterIcon} btnType="button" btnClassName={btnClassName || 'btn btn-warning col-xs-12 btn btn-default'} onClickHandler ={onClickHandler || function(){ alert('no action on click')}}>
      {children || <span className="glyphicon glyphicon-refresh"></span>}
    </GenericButton>
  )
}

export function AddNewButtonMaterialUi({ 
  btnText, children, onClickHandler }) {
  const style = {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .30)',
  };
  return (
  
    <MuiButton variant="fab" color="primary" aria-label="add" style={style} onClick ={onClickHandler || function(){ alert('no action on click')}}>
        <AddIcon />
      </MuiButton>
  )
}

export function EditButtonMaterialUi({ btnText, btnClassName,insertSpaceAfterIcon, btnSpace='', children, onClickHandler }) {
  // const style = {
  //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  //   border: 0,
  //   boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .30)',
  // };
  return (
    
    <div onClick ={onClickHandler || function(){ alert('no action on click')}}>
    <MuiButton variant="fab" color="secondary" aria-label="edit">
      <Icon>edit_icon</Icon>
      </MuiButton>
      </div>
  )
}


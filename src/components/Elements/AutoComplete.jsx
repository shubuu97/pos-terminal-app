// /* eslint-disable react/prop-types */

// import React from 'react';
// import PropTypes from 'prop-types';
// import withStyles from 'material-ui/styles/withStyles';
// import Typography from 'material-ui/Typography';
// import Input from 'material-ui/Input';
// import MenuItem from 'material-ui/Menu/MenuItem';
// import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown';
// import CancelIcon from 'material-ui-icons/Cancel';
// import ArrowDropUpIcon from 'material-ui-icons/ArrowDropUp';
// import ClearIcon from 'material-ui-icons/Clear';
// import Chip from 'material-ui/Chip';
// import Select from 'react-select';
// import 'react-select/dist/react-select.css';
// import FormControl from 'material-ui/Form/FormControl';
// import FormHelperText from 'material-ui/Form/FormHelperText';


// class Option extends React.Component {
//   handleClick = event => {
//     this.props.onSelect(this.props.option, event);
//   };

//   render() {
//     const { children, isFocused, isSelected, onFocus } = this.props;

//     return (
//       <MenuItem
//         onFocus={onFocus}
//         selected={isFocused}
//         onClick={this.handleClick}
//         component="div"
//         style={{
//           fontWeight: isSelected ? 500 : 400,
//         }}
//       >
//         {children}
//       </MenuItem>
//     );
//   }
// }

// function SelectWrapped(props) {
//   const { classes, noResultFoundText, ...other } = props;

//   return (
//     <Select
//       optionComponent={Option}      
//       noResultsText={<Typography>No Result Found</Typography>}
//       arrowRenderer={arrowProps => {
//         return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
//       }}
//       //clearRenderer={() => <ClearIcon />}
//       valueComponent={valueProps => {
//         const { value, children, onRemove } = valueProps;

//         const onDelete = event => {
//           event.preventDefault();
//           event.stopPropagation();
//           onRemove(value);
//         };

//         if (onRemove) {
//           return (
//             <Chip
//               tabIndex={-1}
//               label={children}
//               className={classes.chip}
//               deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
//               onDelete={onDelete}
//             />
//           );
//         }

//         return <div className="Select-value">{children}</div>;
//       }}
//       {...other}
//     />
//   );
// }

// const ITEM_HEIGHT = 48;

// const styles = theme => ({
//   root: {
//     flexGrow: 1,
//     height: 'auto',
//     width: 'auto',
//   },
//   chip: {
//     margin: theme.spacing.unit / 4,
//   },
//   // We had to use a lot of global selectors in order to style react-select.
//   // We are waiting on https://github.com/JedWatson/react-select/issues/1679
//   // to provide a better implementation.
//   // Also, we had to reset the default style injected by the library.
//   '@global': {
//     '.Select-control': {
//       display: 'flex',
//       alignItems: 'center',
//       border: 0,
//       height: 'auto',
//       background: 'transparent',
//       '&:hover': {
//         boxShadow: 'none',
//       },
//     },
//     '.Select-multi-value-wrapper': {
//       flexGrow: 1,
//       display: 'flex',
//       flexWrap: 'wrap',
//     },
//     '.Select--multi .Select-input': {
//       margin: 0,
//     },
//     '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
//       padding: 0,
//     },
//     '.Select-noresults': {
//       padding: theme.spacing.unit * 2,
//     },
//     '.Select-input': {
//       display: 'inline-flex !important',
//       padding: 0,
//       height: 'auto',
//     },
//     '.Select-input input': {
//       background: 'transparent',
//       border: 0,
//       padding: 0,
//       cursor: 'default',
//       display: 'inline-block',
//       fontFamily: 'inherit',
//       fontSize: 'inherit',
//       margin: 0,
//       outline: 0,
//     },
//     '.Select-placeholder, .Select--single .Select-value': {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       display: 'flex',
//       alignItems: 'center',
//       fontFamily: theme.typography.fontFamily,
//       fontSize: theme.typography.pxToRem(16),
//       padding: 0,
//     },
//     '.Select-placeholder': {
//       opacity: 0.42,
//       color: theme.palette.common.black,
//     },
//     '.Select-menu-outer': {
//       backgroundColor: theme.palette.background.paper,
//       boxShadow: theme.shadows[2],
//       position: 'absolute',
//       left: 0,
//       fontSize: 20,
//       top: `calc(100% + ${theme.spacing.unit}px)`,
//       width: '100%',
//       zIndex: 2,
//       maxHeight: ITEM_HEIGHT * 4.5,
//     },
//     '.Select.is-focused:not(.is-open) > .Select-control': {
//       boxShadow: 'none',
//     },
//     '.Select-menu': {
//       maxHeight: ITEM_HEIGHT * 4.5,
//       overflowY: 'auto',
//     },
//     '.Select-menu div': {
//       boxSizing: 'content-box',
//       fontSize: 14,
//     },
//     '.Select-arrow-zone, .Select-clear-zone': {
//       color: theme.palette.action.active,
//       cursor: 'pointer',
//       height: 21,
//       width: 21,
//       zIndex: 1,
//     },
//     // Only for screen readers. We can't use display none.
//     '.Select-aria-only': {
//       position: 'absolute',
//       overflow: 'hidden',
//       clip: 'rect(0 0 0 0)',
//       height: 1,
//       width: 1,
//       margin: -1,
//     },
//   },
// });



// class IntegrationReactSelect extends React.Component {
//   state = {
//     single: null,
//     multi: null,
//   };

//   handleChangeSingle = single => {
//     this.setState({
//       single,
//     }, () => {
//         this.props.changeHandler(single);
//     });
//   };

//   handleChangeMulti = multi => {
//     this.setState({
//       multi,
//     },() => {
//       this.props.changeHandler(multi);
//   });
//   };
//   handleBlur = single => {
//     if(this.props.error){
//       this.props.blurHandler(single);
//     }    
//   }

//   render() {
//     const { classes, 
//             noResultFoundText = 'No Results' , 
//             id, 
//             instanceId, 
//             name, 
//             placeholder, 
//             type, 
//             data, 
//             value, 
//             changeHandler, 
//             disabled,
//             blurHandler,
//             valueKey='value', 
//             labelKey='displayText',
//             error,
//             className,
//             errorCheck = false,
//             errorValue,
//             errorMessage,
//             touched,
//             touchedValue,
//           } = this.props;
          
//     const { single, multi } = this.state;
//     const newData = data.map(suggestion => ({
//         value: suggestion[valueKey],
//         label: suggestion[labelKey],
//       }));
//     return (
//       <div className={classes.root}>
//       {
//          (() =>{ switch(type){
//               case 'single':
//                 return (
//                   <FormControl className="custom-input" style={{width: "100%", fontSize: "14px" }}>
//                     <Input
//                         fullWidth
//                         inputComponent={
//                             SelectWrapped
//                         }
//                         inputProps={{
//                             classes,
//                             value,
//                             disabled: disabled,
//                             onChange: this.handleChangeSingle,
//                             onBlur: this.handleBlur,
//                             placeholder,
//                             instanceId: instanceId || 'react-select-single',
//                             id: id || 'react-select-single',
//                             name: name || 'react-select-single',
//                             simpleValue: true,
//                             options: newData,
//                         }}
//                     />
//                     {errorCheck && error && errorValue && touched && touchedValue && (
//             <div className={className}><FormHelperText >
//             {errorMessage}
//             </FormHelperText></div> 
//             )}              
//         </FormControl>
//                 );
//             case 'multi':
//                 return(
//                   <FormControl className="custom-input" style={{width: "100%", fontSize: "14px" }}>
//                     <Input
//                         fullWidth
//                         inputComponent={SelectWrapped}
//                         inputProps={{
//                             classes,
//                             value,
//                             onBlur: this.handleBlur,
//                             multi: true,
//                             onChange: this.handleChangeMulti,
//                             placeholder,
//                             instanceId: 'react-select-chip',
//                             id: 'react-select-chip',
//                             name: 'react-select-chip',
//                             simpleValue: true,
//                             options: newData,
//                         }}
//                     />
//                     {errorCheck && error && errorValue && touched && touchedValue && (
//             <div className={className}><FormHelperText >
//             {errorMessage}
//             </FormHelperText></div> 
//             )}              
//         </FormControl>
//                 );
//           }
//         })()
//       }
//       </div>
//     );
//   }
// }

// IntegrationReactSelect.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// export default withStyles(styles)(IntegrationReactSelect);

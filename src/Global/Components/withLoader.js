import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
const matLoader = () => (
    <div>
       
     <CircularProgress />
     </div>
 );
 
 
 const withLoader = (WrappedComponent) => {
     return class Enhancer extends React.Component {
 
         render() {
             console.log(this.props,'props is here')
 
             if (this.props.isFetching) {
                 return matLoader();
             }
             
             return <WrappedComponent {...this.props}/>
         }
 
     };
 };
 
 export default withLoader;
 
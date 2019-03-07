import React from 'react';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import logo from '../../assets/images/aobLogodark.png';

import '../../assets/stylesheets/print.css'

const HandlePrint = (props) => {

    const saleTransaction = _get(props, 'itemList', []).map(item => {
        return (
            <div style={{display:'flex', flex:'1', paddingTop:"10px",  paddingBottom:"10px", borderBottom:'dotted 1px #9e9e9e' }}>
                <div style={{width:"35%"}}>{_get(item,'doc.product.name')}</div>
                <div  style={{width:"10%", textAlign:"center"}}>{_get(item,'qty', '')}</div>
                <div  style={{width:"30%", textAlign:"right"}}>{_get(item,'doc.product.salePrice.price','0')}</div>
                {/* <td>{_get(item,'itemTotalDiscountAmount.amount','0')}</td>
                <td>{_get(item,'itemTaxAmount.amount','0')}</td> */}
                <div  style={{width:"25%", textAlign:"right"}}>{_get(item,'itemEffectiveTotal.amount','0')}</div>
            </div>
        )}) 
        
        const orderHistory = _get(props, 'itemList', []).map(item => {
            return (
                <div style={{display:'flex', flex:'1', paddingTop:"10px",  paddingBottom:"10px", borderBottom:'dotted 1px #9e9e9e' }}>
                    <div style={{width:"35%", paddingRight:'10px'}}>{_get(item,'product.name')}</div>
                    <div style={{width:"10%", textAlign:"center"}}>{_get(item,'saleItem.qty', '')}</div>
                    <div style={{width:"30%", textAlign:"right"}}>{_get(item,'product.salePrice.price','0')}<br/>
                        <div style={{fontSize:"9px"}}>
                        (Item Disc.: $23)<br/>
                        (Emp Disc.: $27)
                        </div>
                    </div>
                    {/* <td>{_get(item,'saleItem.itemTotalDiscountAmount.amount','0')}</td>
                    <td>0
                        {_get(item,'saleItem.itemTaxAmount.amount','0')}
                    </td> */}
                   <div style={{width:"25%", textAlign:"right"}}>{_get(item,'saleItem.itemEffectiveTotal.amount','0')}</div>
                </div>
            )}) 
    
    return (
        <div style={{fontSize:"12px", fontFamily:"arial, sans-serif"}} >
            <div style={{textAlign:"center"}}>

                    <div className="store-logo"> <img src={logo}  /></div>
                    <div style={{marginTop:'15px'}}>#3453546465675678</div>   
                    <div>{_get(props,'orderDate','')}</div>
                    
               
                    <div style={{marginTop:'10px'}}><span style={{color:'#9e9e9e', fontSize:'11px', fontWeight:'bold'}}>STORE:</span> {_get(props,'storeName','')}</div>  
                    <div><span style={{color:'#9e9e9e', fontSize:'11px', fontWeight:'bold'}}>ADDRESS:</span> {_get(props,'storeAddress','')}</div>

                    <div style={{marginTop:'10px'}}><span style={{color:'#9e9e9e', fontSize:'11px', fontWeight:'bold'}}>CASHIER:</span> {_get(props,'storeName','')}</div>                 
                    <div><span style={{color:'#9e9e9e', fontSize:'11px', fontWeight:'bold'}}>EMPLOYEE ID:</span> #0001</div> 
                    <div><span style={{color:'#9e9e9e', fontSize:'11px', fontWeight:'bold'}}>TERMINAL:</span> {_get(props,'terminalName','')}</div>  

               
                    <div style={{marginTop:'10px'}}><span style={{color:'#9e9e9e', fontSize:'11px', fontWeight:'bold'}}>CUSTOMER:</span> {_get(props,'customerName','')}</div>
                   
                    <div style={{ padding:'10px 0 10px 0', fontSize:"15px"}}><strong style={{color:'#9e9e9e', fontSize:'14px', fontWeight:'bold'}}>INVOICE:</strong></div>
            </div>
            <div >
                    <div style={{display:'flex', flex:'1',  borderTop:'solid 1px #9e9e9e', borderBottom:'solid 1px #9e9e9e', paddingTop:"10px",  paddingBottom:"10px"}} >   
                        <div style={{fontSize:"11px", width:"35%"}}><strong>ITEM</strong></div>
                        <div style={{fontSize:"11px", width:"10%",  textAlign:"right"}}><strong>QTY</strong></div>
                        <div style={{fontSize:"11px", width:"30%",  textAlign:"right"}}><strong>PRICE</strong></div>
                        <div style={{fontSize:"11px", width:"25%",  textAlign:"right"}}><strong>SUBTOTAL</strong></div>
                    </div>
                    
                        {props.type == 'Sale Transaction' ? saleTransaction : orderHistory}
                    
            </div>
           
            <div style={{display:'flex', flex:'1', flexDirection:'column', borderBottom:'solid 1px #9e9e9e', paddingTop:"10px",  paddingBottom:"5px"}} >
                 <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                     SUB TOTAL: <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'itemsDiscount','0')}</span>
                </div>
                <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                     ITEMS DISCOUNT: <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'itemsDiscount','0')}</span>
                </div>
                <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                    CART DISCOUNT: <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'cartDiscount','0')}</span>
                </div>
                <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                    EMPLOYEE DISCOUNT:   <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'employeeDiscount','0')}</span>
                </div>
                <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                        TOTAL TAX: <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'totalTax','0')}</span> 
                </div>
            </div>
            <div style={{display:'flex', flex:'1', flexDirection:'column', borderBottom:'solid 1px #9e9e9e', paddingTop:"5px",  paddingBottom:"5px", marginBottom:"15px"}} >
                {props.regularTotal &&
                     <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                        REGULAR TOTAL: <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'regularTotal','0')}</span>
                     </div>
                }
                {props.totalDiscount &&
                     <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                        TOTAL DISCOUNT: <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'totalDiscount','0')}</span>
                     </div>
                }
                {props.netTotal &&
                     <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                        NET TOTAL: <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'netTotal','0')}</span>
                     </div>
                }
                   
                    <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                        GRAND TOTAL: <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'totalAmount','0')}</span>
                    </div>
                {props.totalAmountPaid &&
                     <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                        TOTAL PAID: <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'totalAmountPaid','0')}</span>
                     </div>
                }
                {props.changeDue &&
                     <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                        TOTAL DUE:  <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'changeDue','0')}</span>
                     </div>
                }

                {props.saleComment && 
                    <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                        SALE COMMENT: <span style={{fontWeight:'bold'}}>{_get(props,'saleComment', '---------')}</span>
                    </div>
                }

                {props.paymentMethods &&
                     <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                     PAYMENT METHOD: 
                    {_get(props,'paymentMethods',[]).map(payment => {
                        return (
                            <div style={{display: 'flex'}}>
                                 <span style={{fontWeight:'bold',  textAlign:"right"}}>{_get(payment,'paymentAmount.currency','') + _get(payment,'paymentAmount.amount',0)}<br/>
                                 by {_get(payment,'paymentMethod','')}</span>
                            </div>
                        )
                    })}
                     </div>
                }
            </div>
                    <div style={{display:'flex',  justifyContent:'center', paddingBottom:"4px", fontSize:'15px', marginBottom:'40px'}}>
                        Customer Copy
                    </div>

                    <div style={{display:'flex',  justifyContent:'start', paddingBottom:"4px", fontSize:'12px', borderBottom:'dotted 1px #9e9e9e'}}>
                        Customer Signature
                    </div>
        </div>
    )
}

export default HandlePrint;
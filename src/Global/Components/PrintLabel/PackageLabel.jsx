import React, { Component } from 'react';
import { } from 'react-router-dom';

var Barcode = require('react-barcode');
const queryString = require('query-string');

class PackageLabel extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }



  componentDidMount() {
    var content = document.getElementById('printarea');
    var pri = document.getElementById('ifmcontentstoprint').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
    this.props.history.goBack();

  }

  render() {
    const parsed = queryString.parse(this.props.location.search);
    return (
      <React.Fragment>
        <div id="printarea" syle={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', fontWeight: 'bold', width: '100%' }}>
            <div>
              <div style={{ fontSize: '30px', width: '70%' }}><div>{parsed.name}</div></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '60%', marginTop: '5px' }}>
                <div style={{ WebkitPrintColorAdjust: 'exact', height: 'max-content', padding: '7px 50px 7px 15px', backgroundColor: 'black', color: 'white', fontSize: '20px' }}>
                  <div>{'Sativa'}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>THC: ND</div>
                  <div>CBD: ND</div>
                  <div>CBN: ND</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5px' }}>
                <div>My Comapny,123 Street</div>
                <div>Portland, OR, 97999(09)</div>
                <div>999-9998</div>
              </div>
              <div style={{
                backgroundColor: 'black',
                WebkitPrintColorAdjust: 'exact',
                color: 'white',
                padding: '10px',
                marginTop: '5px'
              }}>
                WARNING-MEDICAL PRODUCT KEEP OUT OF REACT OF CHILDREN
          </div>
            </div>
            <div style={{ transform: 'rotate(270deg)', width: '30%', display: 'flex' }}>
              <Barcode value={parsed.label} />
            </div>
          </div>
        </div>


        <iframe id="ifmcontentstoprint" style={{  
          height: '0px',
          width: '0px',
          position: 'absolute'
        }}></iframe>
      </React.Fragment>

    );
  }
}

export default PackageLabel
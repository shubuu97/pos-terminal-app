import React from 'react';
import './styles/mdcStyles.css'

class MDC extends React.Component {

    render() {
        return (
            <div >
                <div className="mdc-layout-grid">
                    <div className="mdc-layout-grid__inner">
                        <div className="mdc-layout-grid__cell highlight">
                            <button className="mdc-button">
                                Button
                            </button>

                            <button className="mdc-button mdc-button--raised">
                                Button
                            </button>

                            <button className="mdc-button mdc-button--outlined">
                                Button
                            </button>
                        </div>
                        <div className="mdc-layout-grid__cell highlight">

                        </div>
                        <div className="mdc-layout-grid__cell highlight">

                        </div>

                        <div className="mdc-layout-grid__cell highlight">
                            
                        </div>
                        
                    </div>
                </div>
            </div>

        );
    }
}

export default MDC;

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import _get from 'lodash/get';
import Button from "@material-ui/core/Button";
import ReactToPrint from 'react-to-print';
import RefundPrintView from './RefundPrintView';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class RefundHistory extends React.Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  showItemList = () => {
    let saleItems = _get(this.props.data, "returnItems", []);
    let saleItemResp = saleItems.map((saleItem, index) => {
      return (<tr>
        <td>{_get(saleItem, "returnProduct.name", '')}</td>
        <td>{_get(saleItem, "qty", 0)}</td>
        <td>{_get(saleItem, "itemRefundEffectiveTotal.amount", 0)}</td>

      </tr>)
    })
    return (
      <React.Fragment>
        {saleItemResp}
      </React.Fragment>
    )
  }

  populatePanels = () => {
    const { classes, data } = this.props;
    const { expanded } = this.state;
    let expansionPanel = []
    console.log(data, 'fyfyfy')
    return (
      <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.secondaryHeading}>Refund Date:</Typography>
          <Typography className={classes.heading}>{moment.utc(_get(data, 'timestamp.seconds', 0) * 1000).format('DD/MM/YYYY hh:mm:ss')}</Typography>
          <Typography className={classes.secondaryHeading}>   Refund Amount:</Typography>
          <Typography className={classes.heading}>{_get(data, 'refundTotal.amount', 0).toFixed(2)}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            <div className="mui-row" style={{ paddingLeft: '5%', paddingRight: '6%' }}>
              <table className="mui-table mui-table--bordered">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {this.showItemList()}
                </tbody>
              </table>
            </div>
            <div>
              <ReactToPrint
                trigger={() => <Button variant="contained" color="primary">Print Refund Receipt</Button>}
                content={() => this.printElementRef}
              />
            </div>
            <div style={{ display: "none" }}>
              <RefundPrintView
                ref={el => this.printElementRef = el}
                store={this.props.store}
                selectedOrder={this.props.selectedOrder}
                logo={this.props.logo}
                data={this.props.data}
              />
            </div>
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel >
    )
  }

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div className='flex-column'>
        <span className='title'> Refund History</span>
        <div className={classes.root}>
          {this.populatePanels()}
        </div>
      </div>

    );
  }
}

RefundHistory.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RefundHistory);
import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
/* Material Imports */
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
/* Component Imports */
import OrdersTab from './Tabs/OrdersTab'

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};



function FullWidthTabs(props) {
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }

  function toggleViewPayment() {
    props.toggleViewPayment()
  }

  function toggleViewProduct() {
    props.toggleViewProduct()
  }

  return (
    <div className=''>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Orders" onClick={toggleViewProduct} />
          <Tab label="Customer" onClick={toggleViewProduct} />
          <Tab label="Payment" onClick={toggleViewPayment} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        //axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabContainer >
          <OrdersTab
            checkoutMainPart={props.checkoutMainPart}
            checkoutcalcArea={props.checkoutcalcArea}
            checkoutactionArea={props.checkoutactionArea}
            checkoutcartArea={props.checkoutcartArea}
          />
        </TabContainer>

        <TabContainer >Item Two</TabContainer>
        <TabContainer >Item Three</TabContainer>
      </SwipeableViews>
    </div>
  );
}

export default FullWidthTabs;
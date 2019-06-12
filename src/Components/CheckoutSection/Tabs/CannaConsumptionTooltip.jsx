import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import _get from 'lodash/get';


const useStyles = makeStyles(theme => ({
    card: {
        width: "270px"
    },
    property: {
        fontWeight: "bold",
        marginRight: "10px",
    },
    row: {
        display: 'flex',
        alignItems: 'center',
    }
}));

const CannaConsumptionTooltip = (props) => {
    const classes = useStyles();
    
    return (
        <div>
        <Card className={classes.card}>
            <CardContent>
                <div className={classes.row}>
                    <Typography className={classes.property}>Concentrate Limit -</Typography>
                    <Typography className={classes.value}>
                        {_get(props.cart, 'cannabisCartContent.concentrateLimit', 0)}/{_get(props.cart, 'cannabisCartLimits.concentrateLimit', 0)} gm
                    </Typography>
                </div>
                <div className={classes.row}>
                    <Typography className={classes.property}>Plant Count Limit -</Typography>
                    <Typography className={classes.value}>
                        {_get(props.cart, 'cannabisCartContent.plantCountLimit', 0)}/{_get(props.cart, 'cannabisCartLimits.plantCountLimit', 0)} plants
                    </Typography>
                </div>
                <div className={classes.row}>
                    <Typography className={classes.property}>Weight Limit -</Typography>
                    <Typography className={classes.value}>
                        {_get(props.cart, 'cannabisCartContent.weightLimit', 0)}/{_get(props.cart, 'cannabisCartLimits.weightLimit', 0)} gm
                    </Typography>
                </div>
            </CardContent>
        </Card>
        </div>
    )
}

export default CannaConsumptionTooltip
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import WaiterDialog from './waitersDialog';

function Order(props){
    const [open, setOpen] = React.useState(false);    
    
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = (value) => {
        setOpen(false);
      };

    const order = props.order
    return(
    <Card sx={{ minWidth: 275 }} variant="outlined" >
    <CardContent>
      <Typography variant="h5" component="div" align='center'>
        {order.name}
        <IconButton color="primary" aria-label="upload picture" component="span" size="large" align='center' onClick={handleClickOpen}>
          <RoomServiceIcon />
        </IconButton>
      </Typography>
    </CardContent>
    <WaiterDialog
        open={open}
        onClose={handleClose}
        order={order.name}
        />
    </Card>
    );
}

export default function Orders(){
    const orders = [{name: "Order 1"}, {name: "Order 2"}, {name: "Order 3"}]; // TODO get orders call 

    return (
        orders.map((order) => <Order order={order}/>)
      );
}
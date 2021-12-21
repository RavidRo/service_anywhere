import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import WaiterDialog from './waitersDialog';
import {assignWaiter, getWaiterByOrder, getOrders} from "../api";

function Order(props){
    const [open, setOpen] = React.useState(false);    
    const [assignedWaiter, setAssignedWaiter] = React.useState("");
    const order = props.order

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = (waiter) => {
        val !== "" ? assignWaiter(order.id, waiter.id) :"";
        setOpen(false);
      };

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
    const [orders, setOrders] = React.useState([]);
    // [{name: "Order 1"}, {name: "Order 2"}, {name: "Order 3"}]; // TODO get orders call 
    useEffect(() => {
      let mounted = true;
      getOrders()
        .then(orders => {
          if(mounted) {
            setOrders(orders)
          }
        })
      return () => mounted = false;
    }, [])
    return (
        orders.map((order) => <Order order={order}/>)
      );
}
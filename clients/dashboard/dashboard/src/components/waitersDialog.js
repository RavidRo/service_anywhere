import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { getWaiters } from "../network/api";

const dialogTitle = "Choose Waiter";

// const waiters = ["Waiter 1", "Waiter 2", "Waiter 3"]

export default function WaiterDialog(props) {
  const { onClose, open } = props;
  const [waiters, setWaiters] = React.useState([]);
  React.useEffect(() => {
    let mounted = true;
    getWaiters().then((waiters) => {
      if (mounted) {
        setWaiters(waiters);
      }
    });
    return () => (mounted = false);
  }, []);

  const handleClose = () => {
    onClose("");
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {waiters.map((waiter) => (
          <ListItem
            button
            onClick={() => handleListItemClick(waiter)}
            key={waiter}
          >
            <ListItemText primary={waiter} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

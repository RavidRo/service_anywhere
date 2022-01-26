import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import RoomServiceIcon from "@mui/icons-material/RoomService";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "fit-content",
    color: theme.palette.text.secondary,
    "& svg": {
      margin: theme.spacing(2),
    },
    "& hr": {
      margin: theme.spacing(0, 0.5),
    },
  },
}));

export default function OrderView(props) {
  const { assignedWaiter, order, handleClickOpen, handleClose } = props;
  return (
    <Card sx={{ minWidth: 275 }} variant="outlined">
      <CardContent>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            component="p"
            align="left"
            style={{ width: "80%" }}
          >
            {`order id: ${order.id}`}
            <br />
            items - {order.items.join(", ")}
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            style={{ marginleft: "1%", marginLeft: "1%" }}
          />
          <div style={{ width: "30%", marginLeft: "5%" }}>
            <Typography variant="h6" component="p">
              {assignedWaiter.length === 0 ? (
                <IconButton
                  color="primary"
                  aria-label="service"
                  component="span"
                  size="large"
                  onClick={handleClickOpen}
                >
                  <RoomServiceIcon />
                </IconButton>
              ) : (
                `Assigned waiter: ${assignedWaiter}`
              )}
              <br />
              {`status: ${order.status}`}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

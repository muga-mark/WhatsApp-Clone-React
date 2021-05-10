import React from "react";
//importing material-ui
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
//importing styles
import "./DrawerRight.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawerPaper: {
    [theme.breakpoints.only("xs")]: {
      width: "100vw",
    },
    [theme.breakpoints.up("sm")]: {
      position: "absolute",
    },
  },
}));

function DrawerRight({ content, drawerRight }) {
  const classes = useStyles();

  return (
    <div>
      <Drawer
        anchor="right"
        variant="persistent"
        open={drawerRight}
        classes={{ paper: classes.drawerPaper }}
      >
        {content}
      </Drawer>
    </div>
  );
}

export default DrawerRight;

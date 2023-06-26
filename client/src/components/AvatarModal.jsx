import React from "react";
import { Modal, Typography } from "@mui/material";

const AvatarModal = ({ avatar, onClose }) => {
  return (
    <Modal open={Boolean(avatar)} onClose={onClose}>
      <div>
        <Typography variant="h6">
          {avatar?.firstname} {avatar?.lastname}
        </Typography>
        <Typography variant="body1">Email: {avatar?.email}</Typography>
        {/* Add other avatar information here */}
      </div>
    </Modal>
  );
};

export default AvatarModal;

/* eslint-disable react/prop-types */
import React from "react";
import { Modal, Typography, styled, Chip, Box, Divider } from "@mui/material";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "& .MuiBackdrop-root": {
    backgroundColor: "transparent",
  },
});

const AvatarModal = ({
  avatar,
  onClose,
  selectedTab,
  //modalPosition
}) => {
  return (
    <StyledModal
      open={Boolean(avatar)}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableAutoFocus
      //disableScrollLock
      //style={{ top: modalPosition.top, left: modalPosition.left }}
    >
      <Box
        width={250}
        display="flex"
        bgcolor="background.paper"
        borderRadius="0.75rem"
        gap="0.1rem"
        flexDirection="column"
        overflow="hidden"
        sx={{
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.75)",
        }}
      >
        <Box
          width={1}
          height={250}
          sx={{
            margin: "0 auto",
          }}
        >
          <img
            src={`http://localhost:3001/assets/${avatar?.picture}`}
            alt=""
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }}
          />
        </Box>
        <Box
          flexDirection="column"
          display="flex"
          paddingX={1}
          paddingBottom={0.5}
        >
          <Typography variant="h6">
            {avatar?.firstName} {avatar?.lastName}
          </Typography>
          <Typography variant="body2">{avatar?.role}</Typography>
          <Typography variant="body2">Email: {avatar?.email}</Typography>
          <Typography variant="subtitle2">
            {selectedTab === "Work" ? "Skills:" : "Interests:"}
          </Typography>
          <Divider />
          <Box display="flex" flexWrap="wrap" gap={0.5} marginTop={0.5}>
            {selectedTab === "Work" &&
              avatar?.skills.map((skill) => (
                <Chip
                  key={skill.skill.id}
                  variant="filled"
                  label={skill.skill.name}
                  color="primary"
                />
              ))}
            {selectedTab === "Social" &&
              avatar?.interests.map((interest) => (
                <Chip
                  key={interest.id}
                  variant="filled"
                  label={interest.name}
                  color="secondary"
                />
              ))}
          </Box>
        </Box>
        {/* Add other avatar information here */}
      </Box>
    </StyledModal>
  );
};

export default AvatarModal;

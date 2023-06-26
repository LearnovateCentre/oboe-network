/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import { useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Typography,
  Card,
  Tabs,
  Tab,
  Modal,
  styled,
  Divider,
  Chip,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { createRoot } from "react-dom/client";
import Wrapper from "./Wrapper";
import { useTheme } from "@mui/material/styles";

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

const fetchMatchingProfiles = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3001/employees/matchingEmployees/${id}`,
      {
        method: "GET",
      }
    );
    const matchingProfiles = await response.json();
    return matchingProfiles;
  } catch (error) {
    console.log(error);
  }
};

const fetchEmployee = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/employees/${id}`, {
      method: "GET",
    });
    const employee = await response.json();
    return employee;
  } catch (error) {
    console.log(error);
  }
};

const createNetwork = (
  containerRef,
  matchingProfiles,
  employee,
  selectedTeams,
  highlightedProfiles,
  navigate,
  theme,
  selectedTab,
  setSelectedAvatar
  //setModalPosition
) => {
  // Remove the previous network
  d3.select(containerRef.current).selectAll("svg").remove();

  // Sort the matching profiles based on the score in descending order
  const width = containerRef.current.offsetWidth;
  const height = containerRef.current.offsetHeight;

  const svg = d3
    .select(containerRef.current)
    .selectAll("svg")
    .data([null])
    .join("svg")
    .attr("width", width)
    .attr("height", height);

  // Calculate the coordinates of the nodes
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;

  let filteredProfiles = matchingProfiles;
  if (selectedTeams.length > 0) {
    filteredProfiles = matchingProfiles.filter((profile) =>
      selectedTeams.includes(profile.matchingEmployee.team)
    );
  }
  //console.log(filteredProfiles);

  const numProfiles = filteredProfiles.length;
  const maxScore = Math.max(
    ...filteredProfiles.map((profile) => profile.score)
  );

  const angleStep = (2 * Math.PI) / numProfiles;

  // Add the center avatar
  const centerAvatar = svg
    .append("foreignObject")
    .attr("x", centerX - 35)
    .attr("y", centerY - 35)
    .attr("width", 70)
    .attr("height", 70)
    .on("click", () => {
      navigate(`/employee/${employee.id}`);
    });

  centerAvatar
    .append("xhtml:div")
    .style("display", "flex")
    .style("align-items", "center")
    .style("justify-content", "center")
    .style("width", "100%")
    .style("height", "100%")
    .append(() => {
      const avatar = document.createElement("div");
      createRoot(avatar).render(
        <Avatar
          src={`http://localhost:3001/assets/${employee.picture}`}
          alt="Avatar"
          sx={{
            width: 70,
            height: 70,
            border: `4px solid ${
              selectedTab === "Work"
                ? theme.palette.primary.light
                : theme.palette.secondary.light
            }`,
            "&:hover": {
              cursor: "pointer",
              border: `4px solid ${
                selectedTab === "Work"
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main
              }`,
            },
          }}
        />
      );
      return avatar;
    });

  filteredProfiles.forEach((profile, index) => {
    const scoreRatio = profile.score / maxScore;
    const angle = index * angleStep;
    const distance = radius * scoreRatio;
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    //console.log(profile);

    // Add the Avatar as a node
    const matchingAvatar = svg
      .append("foreignObject")
      .attr("x", x - 35)
      .attr("y", y - 35)
      .attr("width", 70)
      .attr("height", 70)
      .on("click", () => {
        setSelectedAvatar(profile.matchingEmployee);
        //Pass the x and y coordinates of the matchingAvatar to the setModalPosition
        //setModalPosition({ top: y - 35, left: x - 35 });
      });

    matchingAvatar
      .append("xhtml:div")
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("width", "100%")
      .style("height", "100%")
      .append(() => {
        const avatar = document.createElement("div");
        createRoot(avatar).render(
          <Avatar
            src={`http://localhost:3001/assets/${profile.matchingEmployee.picture}`}
            alt="Avatar"
            sx={{
              width: 70,
              height: 70,
              border: highlightedProfiles.find(
                //
                (highlightedProfile) => highlightedProfile.id === profile.id
              )
                ? `4px solid ${
                    selectedTab === "Work"
                      ? theme.palette.primary.light
                      : theme.palette.secondary.light
                  }`
                : "none",
              "&:hover": {
                cursor: "pointer",
                border: highlightedProfiles.find(
                  (highlightedProfile) => highlightedProfile.id === profile.id
                )
                  ? `4px solid ${
                      selectedTab === "Work"
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main
                    }`
                  : "none",
              },
            }}
          />
        );
        return avatar;
      });
    // Add the link between employee and matching profile
    // Calculate the offset for the line's start and end points
    const startOffsetX = 35 * Math.cos(angle);
    const startOffsetY = 35 * Math.sin(angle);
    const endOffsetX = 35 * Math.cos(angle + Math.PI);
    const endOffsetY = 35 * Math.sin(angle + Math.PI);

    // Add the link between employee and matching profile
    const line = svg
      .append("line")
      .attr("x1", centerX + startOffsetX)
      .attr("y1", centerY + startOffsetY)
      .attr("x2", x + endOffsetX)
      .attr("y2", y + endOffsetY)
      .attr("stroke", "#aaa")
      .attr("stroke-width", 1);

    // Highlight the line if it connects with a highlighted profile
    const highlightedProfile = highlightedProfiles.find(
      (highlightedProfile) => highlightedProfile.id === profile.id
    );
    if (highlightedProfile) {
      line
        .attr(
          "stroke",
          `${
            selectedTab === "Work"
              ? theme.palette.primary.light
              : theme.palette.secondary.light
          }`
        )
        .attr("stroke-width", 4);
    }
  });
};

const extractHighlightedProfiles = (
  matchingProfiles,
  employee,
  selectedTab
) => {
  if (selectedTab === "Work") {
    return matchingProfiles.filter((profile) =>
      profile.matchingEmployee.skills.some((skill) =>
        employee.skills.some((empSkill) => empSkill.skill.id === skill.skill.id)
      )
    );
  } else if (selectedTab === "Social") {
    return matchingProfiles.filter(
      (profile) =>
        profile.matchingEmployee.interests.some((interest) =>
          employee.interests.some(
            (empInterest) => empInterest.id === interest.id
          )
        ) ||
        profile.matchingEmployee.groups.some((group) =>
          employee.groups.some((empGroup) => empGroup.id === group.id)
        )
    );
  }
  return [];
};

const Network = () => {
  const { id } = useParams();
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [uniqueTeams, setUniqueTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Work");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  //const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const theme = useTheme();

  //console.log(selectedAvatar);
  //console.log(selectedTab);

  useEffect(() => {
    Promise.all([fetchMatchingProfiles(id), fetchEmployee(id)])
      .then(([matchingProfiles, employee]) => {
        //console.log(matchingProfiles);
        //console.log(employee);
        const highlightedProfiles = extractHighlightedProfiles(
          matchingProfiles,
          employee,
          selectedTab
        );

        createNetwork(
          containerRef,
          matchingProfiles,
          employee,
          selectedTeams,
          highlightedProfiles,
          navigate,
          theme,
          selectedTab,
          setSelectedAvatar
          //setModalPosition
        );
        extractUniqueTeams(matchingProfiles);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, selectedTeams, selectedTab]);

  //console.log(highlightedProfiles);

  const extractUniqueTeams = (matchingProfiles) => {
    const teams = matchingProfiles.map(
      (profile) => profile.matchingEmployee.team
    );
    const uniqueTeams = [...new Set(teams)];
    setUniqueTeams(uniqueTeams);
  };

  const handleTabChange = useCallback(
    (event, newValue) => {
      setSelectedTab(newValue);
    },
    [setSelectedTab]
  );

  const handleTeamClick = useCallback(
    (team) => {
      if (selectedTeams.includes(team)) {
        // Remove the team from the selected teams if it is already selected
        const teams = selectedTeams.filter((t) => t !== team);
        setSelectedTeams(teams);
      } else {
        // Add the team to the selected teams if it is not already selected
        const teams = [...selectedTeams, team];
        setSelectedTeams(teams);
      }
    },
    [selectedTeams, setSelectedTeams]
  );
  //console.log(selectedTeams);

  return (
    <Box width="100%" padding="2rem 6%">
      <Box width="100%" maxWidth="1200px" margin="0 auto">
        <Wrapper>
          <Typography variant="h5" align="center">
            Meet your Team
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="basic tabs example"
              indicatorColor="primary"
              textColor="primary"
              sx={{ marginBottom: "1rem" }}
            >
              <Tab label="Work" value="Work" />
              <Tab label="Social" value="Social" />
            </Tabs>
          </Box>
          <Box
            display="grid"
            gridTemplateColumns="repeat(6, minmax(0, 1fr))"
            columnGap={1}
          >
            {uniqueTeams.map((team) => (
              <Card
                key={team}
                onClick={() => handleTeamClick(team)}
                sx={{
                  backgroundColor: selectedTeams.includes(team)
                    ? "primary.light"
                    : "white",
                  "&:hover": {
                    backgroundColor: "primary.light",
                    cursor: "pointer",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "1rem",
                  }}
                >
                  <GroupIcon sx={{ fontSize: 40 }} />
                  <Typography variant="subtitle1" align="center">
                    {team}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
          <Typography variant="h5" align="center" marginTop={2} gutterBottom>
            Your Buddies
          </Typography>
          <Box ref={containerRef} width="100%" height="600px">
            <AvatarModal
              avatar={selectedAvatar}
              onClose={() => setSelectedAvatar(null)}
              selectedTab={selectedTab}
              //modalPosition={modalPosition}
            />
          </Box>
        </Wrapper>
      </Box>
    </Box>
  );
};

export default Network;

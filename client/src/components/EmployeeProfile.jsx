import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  Typography,
  Card,
  CardContent,
  Rating,
  Button,
  Badge,
  styled,
  Chip,
} from "@mui/material";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CircleIcon from "@mui/icons-material/Circle";
import Add from "@mui/icons-material/Add";
import Wrapper from "./Wrapper";
import FlexBetween from "./FlexBetween";

const getStatusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return { backgroundColor: "green", color: "green" };
    case "INACTIVE":
      return { backgroundColor: "white", color: "none" };
    case "AWAY":
      return { backgroundColor: "yellow", color: "none" };
    case "BUSY":
      return { backgroundColor: "red", color: "none" };
    default:
      return { backgroundColor: "white", color: "none" };
  }
};

const StyledBadge = styled(Badge)(({ status }) => ({
  "& .MuiBadge-badge": {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    ...getStatusColor(status),
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation:
        status === "ACTIVE" ? "ripple 1.2s infinite ease-in-out" : "none",
      border:
        status === "ACTIVE"
          ? "1px solid currentColor"
          : status === "INACTIVE"
          ? "1px solid grey"
          : "none",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [matchingProfiles, setMatchingProfiles] = useState([]);
  const API_BASE_URL = "http://localhost:3001/employees";

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "GET",
      });
      const employee = await response.json();
      setEmployee(employee);

      // Fetch matching profiles
      fetchMatchingProfiles(employee);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMatchingProfiles = async (employee) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "GET",
      });
      const employees = await response.json();
      const matchingProfiles = employees
        .filter((e) => e.id !== employee.id) // Exclude current employee
        .map((e) => ({
          ...e,
          score: calculateMatchingScore(employee, e),
        }))
        .filter((e) => e.score > 0.6);

      setMatchingProfiles(matchingProfiles);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateMatchingScore = (employeeA, employeeB) => {
    let score = 0;

    // Calculate score based on skills
    const skillsA = employeeA.skills.map((skill) => skill.skillId);
    const skillsB = employeeB.skills.map((skill) => skill.skillId);
    const skillsInCommon = skillsA.filter((skillId) =>
      skillsB.includes(skillId)
    );

    score += skillsInCommon.length * 0.5; // Assign 50% weight to skills

    // Calculate score based on interests
    const interestsA = employeeA.interests.map((interest) => interest.id);
    const interestsB = employeeB.interests.map((interest) => interest.id);
    const interestsInCommon = interestsA.filter((interestId) =>
      interestsB.includes(interestId)
    );

    score += interestsInCommon.length * 0.3; // Assign 30% weight to interests

    // Calculate score based on groups
    const groupsA = employeeA.groups.map((group) => group.id);
    const groupsB = employeeB.groups.map((group) => group.id);
    const groupsInCommon = groupsA.filter((groupId) =>
      groupsB.includes(groupId)
    );
    score += groupsInCommon.length * 0.2; // Assign 20% weight to groups
    //console.log(score);

    return score;
  };

  console.log(matchingProfiles);

  const addGroupToEmployee = async (groupId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: groupId,
        }),
      });

      if (response.ok) {
        // Refresh the employee data after successfully adding the group
        fetchEmployee();
      } else {
        console.log("Failed to add group to employee.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveMatchingProfiles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/matchingEmployees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: id,
          matchingProfiles: matchingProfiles,
        }),
      });

      if (response.ok) {
        console.log("Successfully saved matching profiles.");
        //setMatchingProfiles([]);
      } else {
        console.log("Failed to save matching profiles.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!employee) return null;

  const {
    firstName,
    lastName,
    email,
    onboardee,
    team,
    role,
    level,
    picture,
    skills,
    interests,
    recommendedGroups,
  } = employee;

  return (
    <Box width="100%" padding="2rem 6%">
      <Box width="100%" maxWidth="1200px" margin="0 auto">
        <Typography variant="h5" align="center">
          {firstName}&apos;s Profile
        </Typography>
        <Wrapper
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
          width="100%"
        >
          <Box
            justifyContent="space-between"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Avatar
              alt={firstName}
              src={`http://localhost:3001/assets/${picture}`}
              sx={{ width: 56, height: 56 }}
            />
            <Box>
              <Typography variant="h6">
                {firstName} {lastName}
              </Typography>
              <Typography variant="subtitle1">Email: {email}</Typography>
              <Typography variant="subtitle1">
                {" "}
                {onboardee && "Onboardee"}
              </Typography>
            </Box>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="subtitle1">Team: {team}</Typography>
            <Typography variant="subtitle1">Job Title: {role}</Typography>
            <Typography variant="subtitle1">Level: {level}</Typography>
          </Box>
        </Wrapper>

        <Box
          maxWidth="1200px"
          mx="auto"
          mt={4}
          display="flex"
          justifyContent="space-between"
          flexDirection="row"
          gap={4}
        >
          <Wrapper flex={1}>
            <Typography variant="h6" align="center" gutterBottom>
              SKILLS
            </Typography>
            <Divider />
            {skills.map((skill) => (
              <Box key={skill.id}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  my={0.5}
                >
                  <Typography variant="subtitle1">
                    {skill.skill.name}
                  </Typography>
                  <Rating
                    name="read-only"
                    value={skill.rating}
                    readOnly
                    icon={<CircleIcon fontSize="inherit" />}
                    emptyIcon={<PanoramaFishEyeIcon fontSize="inherit" />}
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "primary.main",
                      },
                    }}
                  />
                </Box>
                <Divider />
              </Box>
            ))}
            <Typography variant="h6" align="center" gutterBottom mt="3rem">
              MATCHES
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Employees who match {firstName}&apos;s profile
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns="repeat(5, minmax(0, 1fr))"
              gap={2}
              width="100%"
              maxWidth="400px"
              justifyItems="center"
              marginBottom={1}
            >
              {matchingProfiles.map((profile) => (
                <Box key={profile.id} textAlign="center">
                  <StyledBadge
                    status={profile.status}
                    overlap="circular"
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      alt={profile.firstName}
                      src={`http://localhost:3001/assets/${profile.picture}`}
                      sx={{ width: 56, height: 56 }}
                    />
                  </StyledBadge>
                  <Typography variant="subtitle1">
                    {profile.firstName}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Divider />
            <FlexBetween marginY={0.5}>
              <Typography variant="subtitle1">
                Add People to {firstName}&apos;s Network
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: "50%",
                  minWidth: "0",
                  width: "40px",
                  height: "40px",
                  "&:hover": {
                    pointer: "cursor",
                  },
                }}
                onClick={saveMatchingProfiles}
              >
                <Add />
              </Button>
            </FlexBetween>

            <Divider />
          </Wrapper>
          <Wrapper flex={1}>
            <Typography variant="h6" align="center" gutterBottom>
              INTERESTS
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns="repeat(3, minmax(0, 1fr))"
              rowGap="20px"
              columnGap="1.33%"
            >
              {interests.map((interest) => (
                <Card
                  key={interest.id}
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "130px",
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1">{interest.name}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Typography variant="h6" align="center" gutterBottom mt="3rem">
              GROUPS
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Groups {firstName} is a member of:
            </Typography>
            <Box
              display="flex"
              justifyContent="flex-start"
              flexWrap="wrap"
              gap={1}
              my={1}
            >
              {employee.groups.map((group) => (
                <Chip key={group.id} label={group.name} />
              ))}
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Groups & activities that match {firstName}&apos;s personal Profile
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns="repeat(3, minmax(0, 1fr))"
              rowGap="20px"
              columnGap="1.33%"
            >
              {/* Fetch and display recommended groups based on employee interests */}
              {recommendedGroups.map((group) => (
                <Box
                  key={group.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Card
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1">{group.name}</Typography>
                    </CardContent>
                  </Card>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addGroupToEmployee(group.id)}
                    sx={{
                      marginTop: "0.5rem",
                      width: "100%",
                      "&:hover": {
                        pointer: "cursor",
                      },
                    }}
                  >
                    <Add /> Add
                  </Button>
                </Box>
              ))}
            </Box>
          </Wrapper>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeProfile;

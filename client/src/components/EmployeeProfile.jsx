import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Typography,
  Card,
  CardContent,
  Rating,
  Button,
} from "@mui/material";
import Wrapper from "./Wrapper";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CircleIcon from "@mui/icons-material/Circle";

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [matchingProfiles, setMatchingProfiles] = useState([]);

  useEffect(() => {
    fetchEmployee();
    fetchMatchingProfiles();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await fetch(`http://localhost:3001/employees/${id}`, {
        method: "GET",
      });
      const employee = await response.json();
      setEmployee(employee);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMatchingProfiles = async () => {
    try {
      const response = await fetch(`http://localhost:3001/employees`, {
        method: "GET",
      });
      const employees = await response.json();

      const matchingProfiles = employees
        .filter((e) => e.id !== employee?.id) // Exclude current employee
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
    const skillsA = employeeA?.skills.map((skill) => skill.skillId);
    const skillsB = employeeB?.skills.map((skill) => skill.skillId);
    console.log(skillsB);
    const skillsInCommon = skillsA?.filter((skillId) =>
      skillsB.includes(skillId)
    );
    score += skillsInCommon?.length * 0.5; // Assign 50% weight to skills
    console.log(score);

    return score;
  };

  console.log(matchingProfiles);

  const addGroupToEmployee = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:3001/employees/${id}`, {
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

  if (!employee) return null;

  const recommendedGroups = employee.recommendedGroups || [];

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
              alt={employee.firstName}
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
            <Typography variant="subtitle1">
              Employees who match {firstName}&apos;s profile
            </Typography>
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
              MATCHES
            </Typography>
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
                <Card
                  key={group.id}
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "130px",
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1">{group.name}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => addGroupToEmployee(group.id)}
                      sx={{
                        marginTop: "1rem",
                      }}
                    >
                      Add
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Wrapper>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeProfile;

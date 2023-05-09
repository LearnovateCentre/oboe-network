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
} from "@mui/material";
import Wrapper from "./Wrapper";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CircleIcon from "@mui/icons-material/Circle";

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    async function fetchEmployee() {
      const employee = await fetch(`http://localhost:3001/employees/${id}`, {
        method: "GET",
      });
      const data = await employee.json();
      setEmployee(data);
    }
    fetchEmployee();
  }, [id]);

  return (
    <Box width="100%" padding="2rem 6%">
      {employee && (
        <Box
          width="100%"
          maxWidth="1200px"
          margin="0 auto"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Typography variant="h5" align="center">
            {employee.firstName}&apos;s Profile
          </Typography>
          <Wrapper
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <Avatar
              alt={employee.firstName}
              src={`http://localhost:3001/assets/${employee.picture}`}
              sx={{ width: 56, height: 56 }}
            />
            <Box mx={4}>
              <Typography variant="h6">
                {employee.firstName} {employee.lastName}
              </Typography>
              <Typography variant="subtitle1">
                Email: {employee.email}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box mx={4} display="flex" flexDirection="column">
              <Typography variant="subtitle1">Team: {employee.team}</Typography>
              <Typography variant="subtitle1">
                Job Title: {employee.role}
              </Typography>
              <Typography variant="subtitle1">
                Level: {employee.level}
              </Typography>
            </Box>
          </Wrapper>

          <Box
            width="100%"
            maxWidth="1200px"
            margin="0 auto"
            display="flex"
            justifyContent="space-between"
            flexDirection="row"
            gap={4}
            mt={4}
          >
            <Wrapper
              display="flex"
              alignItems="center"
              flexDirection="column"
              width="100%"
            >
              <Typography variant="h6" align="center" gutterBottom>
                SKILLS
              </Typography>
              <Divider flexItem />
              {console.log(employee.skills)}
              {employee.skills.map((skill) => (
                <Box
                  key={skill.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  mt={1}
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
              ))}
            </Wrapper>
            <Wrapper
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              width="100%"
            >
              <Typography variant="h6" align="center" gutterBottom>
                INTERESTS
              </Typography>
              <Box
                mt="1x"
                display="grid"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                justifyContent="space-between"
                rowGap="20px"
                columnGap="1.33%"
              >
                {employee.interests.map((interest) => (
                  <Card key={interest.id}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        {interest.name}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Wrapper>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EmployeeProfile;

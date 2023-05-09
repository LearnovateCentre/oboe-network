import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, Box, Divider, Typography } from "@mui/material";
import Wrapper from "./Wrapper";

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
        </Box>
      )}
    </Box>
  );
};

export default EmployeeProfile;

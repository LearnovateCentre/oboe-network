import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

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
    <Box>
      <h1>Employee Profile</h1>
      {employee && (
        <Box>
          <h2>{employee.firstName}</h2>
          <h3>{employee.email}</h3>
          <h3>{employee.role}</h3>
        </Box>
      )}
    </Box>
  );
};

export default EmployeeProfile;

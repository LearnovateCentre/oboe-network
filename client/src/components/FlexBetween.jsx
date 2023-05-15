import { Box } from "@mui/material";
import { styled } from "@mui/system"; // styled is a function that takes a component and returns a new component

// Not use too often but this is very good if you're reusing CSS as a component, you can use style component
// to create a component that has the CSS you want to reuse
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;

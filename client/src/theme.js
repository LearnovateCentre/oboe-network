// represents the color palette of the design system
export const colorTokens = {
  grey: {
    0: "#FFFFFF", // white
    10: "#F6F6F6", // lightest grey
    50: "#F0F0F0", //  light grey
    100: "#E0E0E0", // light grey
    200: "#C2C2C2", // medium grey
    300: "#A3A3A3", // medium grey
    400: "#858585", // medium grey
    500: "#666666", // medium grey
    600: "#4D4D4D", // medium grey
    700: "#333333", // dark grey
    800: "#1A1A1A", // black
    900: "#0A0A0A", // black
    1000: "#000000", // black
  },
  primary: {
    50: "#E6FBFF", // lightest blue
    100: "#CCF7FE", // light blue
    200: "#99EEFD", // light blue
    300: "#66E6FC", // light blue
    400: "#33DDFB", // light blue
    500: "#00D5FA", // main blue
    600: "#00A0BC", // main blue
    700: "#006B7D", // dark blue
    800: "#00353F", // dark blue
    900: "#001519", // dark blue
  },
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    // return the themeSettings object
    palette: {
      mode: mode,
      ...(mode === "dark" // The ... operator will spread different values to the palette object based on the mode
        ? {
            // pallete values for dark mode
            primary: {
              // primary represents the primary color of the design system
              dark: colorTokens.primary[200], // dark represents the darkest color of the primary color
              main: colorTokens.primary[500], // main represents the main color of the primary color
              light: colorTokens.primary[800], // light represents the lightest color of the primary color
            },
            neutral: {
              // neutral represents the neutral color of the design system
              dark: colorTokens.grey[100],
              main: colorTokens.grey[200],
              mediumMain: colorTokens.grey[300],
              medium: colorTokens.grey[400],
              light: colorTokens.grey[700],
            }, // background represents the background color of the design system
            background: {
              default: colorTokens.grey[900],
              alt: colorTokens.grey[800], // alt represents the alternative background color of the design system
            },
          }
        : {
            // pallete for light mode
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500],
              light: colorTokens.primary[50],
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[50],
            },
            background: {
              default: colorTokens.grey[10],
              alt: colorTokens.grey[0],
            },
          }),
    },
    typography: {
      fontFamily: ["Roboto", "sans-serif"].join(","),
      fontsize: 12,
      h1: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

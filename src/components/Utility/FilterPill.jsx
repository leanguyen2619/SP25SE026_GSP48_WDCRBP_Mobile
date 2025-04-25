import { Box } from "@chakra-ui/react";
import { appColorTheme } from "../../config/appconfig";

export default function FilterPill({ label, isActive, onClick }) {
  return (
    <Box
      px={3}
      py={1}
      borderRadius="full"
      cursor="pointer"
      fontSize="sm"
      bgColor={
        isActive ? `${appColorTheme.brown_2}` : `${appColorTheme.grey_1}`
      }
      color={isActive ? "white" : "black"}
      onClick={onClick}
    >
      {label}
    </Box>
  );
}

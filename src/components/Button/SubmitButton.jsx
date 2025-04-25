import { Button } from "@chakra-ui/react";

export default function SubmitButton({
  text,
  bgColor = "app_brown.2",
  textColor = "white",
  hoverBgColor = "app_brown.1",
  hoverTextColor = "white",
}) {
  return (
    <Button
      _hover={{
        backgroundColor: hoverBgColor,
        color: hoverTextColor,
      }}
      px="30px"
      py="20px"
      bgColor={bgColor}
      color={textColor}
      borderRadius="40px"
      mt="40px"
      zIndex="1"
      type="submit"
      my="20px"
    >
      {text}
    </Button>
  );
}

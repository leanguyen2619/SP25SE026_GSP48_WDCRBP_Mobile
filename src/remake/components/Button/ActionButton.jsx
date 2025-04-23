import { Button } from "@chakra-ui/react";

export default function ActionButton({
  text,
  onClickExeFn,
  bgColor = "app_brown.0",
  textColor = "black",
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
      onClick={onClickExeFn}
      my="20px"
    >
      {text}
    </Button>
  );
}

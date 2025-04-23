import { useRef } from "react";
import { Textarea } from "@chakra-ui/react";

const AutoResizeTextarea = ({ name, value, onChange }) => {
  const textareaRef = useRef(null);

  const handleInputChange = (event) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to recalculate
      textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
    }
    onChange(event); // Call parent onChange handler
  };

  return (
    <Textarea
      ref={textareaRef}
      name={name}
      value={value}
      onChange={handleInputChange}
      style={{
        width: "100%",
      }}
    />
  );
};

export default AutoResizeTextarea;

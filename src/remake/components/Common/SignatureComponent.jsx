import { useRef, useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
  Badge,
} from "@chakra-ui/react";
import SignatureCanvas from "react-signature-canvas";
import { FiSave, FiTrash2 } from "react-icons/fi";

export default function SignatureComponent({
  initialSignature,
  onSaveSignature,
  savedSignature,
  isEditable = true,
  title = "Chữ ký",
  showSizeControls = true,
}) {
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 200 });
  const signaturePad = useRef(null);

  // Update signature data whenever the user finishes drawing
  useEffect(() => {
    if (isEditable && signaturePad.current) {
      const updateSignatureData = () => {
        if (!signaturePad.current.isEmpty()) {
          // Just updating, not saving yet
        }
      };

      // Add event listeners
      const canvas = signaturePad.current._canvas;
      canvas.addEventListener("mouseup", updateSignatureData);
      canvas.addEventListener("touchend", updateSignatureData);

      // Clean up
      return () => {
        if (canvas) {
          canvas.removeEventListener("mouseup", updateSignatureData);
          canvas.removeEventListener("touchend", updateSignatureData);
        }
      };
    }
  }, [isEditable, canvasSize]);

  // Handle signature actions
  const clearSignature = () => {
    if (signaturePad.current) {
      signaturePad.current.clear();
    }
  };

  const saveSignature = () => {
    if (signaturePad.current && !signaturePad.current.isEmpty()) {
      const dataURL = signaturePad.current.toDataURL("image/png");

      // Convert to blob for storage
      fetch(dataURL)
        .then((res) => res.blob())
        .then((blob) => {
          onSaveSignature(blob, dataURL);
        });
    }
  };

  // Handle canvas size changes
  const handleSizeChange = (field, value) => {
    if (signaturePad.current) {
      signaturePad.current.clear();
    }
    setCanvasSize((prev) => ({
      ...prev,
      [field]: parseInt(value),
    }));
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" mb={2}>
          {title}{" "}
          {savedSignature && (
            <Badge colorScheme="green" ml={2}>
              Đã lưu
            </Badge>
          )}
        </Text>

        {/* Only show size controls when editable and enabled */}
        {isEditable && showSizeControls && (
          <HStack spacing={4}>
            <HStack>
              <Text fontWeight="bold" mb={2}>
                Chiều rộng (px):
              </Text>
              <NumberInput
                value={canvasSize.width}
                onChange={(value) => handleSizeChange("width", value)}
                min={200}
                max={1000}
                border="1px solid black"
                borderRadius="8px"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>

            <HStack>
              <Text fontWeight="bold" mb={2}>
                Chiều cao (px):
              </Text>
              <NumberInput
                value={canvasSize.height}
                onChange={(value) => handleSizeChange("height", value)}
                min={100}
                max={500}
                border="1px solid black"
                borderRadius="8px"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
          </HStack>
        )}

        {/* Show signature canvas if editable, otherwise show static image */}
        {isEditable ? (
          <>
            <Text fontSize="sm" color="gray.600">
              Vui lòng ký tên vào khu vực bên dưới
            </Text>

            <VStack>
              <SignatureCanvas
                backgroundColor="white"
                ref={signaturePad}
                canvasProps={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  className: "signature-canvas",
                  style: {
                    border: "2px solid black",
                    borderRadius: "0.375rem",
                  },
                }}
              />
            </VStack>

            <HStack justifyContent="flex-end" mt={2} spacing={3}>
              <Button
                onClick={saveSignature}
                colorScheme="green"
                leftIcon={<FiSave />}
                isDisabled={savedSignature}
              >
                Lưu
              </Button>
              <Button
                onClick={clearSignature}
                variant="outline"
                colorScheme="red"
                leftIcon={<FiTrash2 />}
              >
                Xóa
              </Button>
            </HStack>
          </>
        ) : initialSignature ? (
          <Image
            src={initialSignature}
            alt="Chữ ký"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            maxH="200px"
            mx="auto"
          />
        ) : (
          <Text>Chưa có chữ ký</Text>
        )}
      </VStack>
    </Box>
  );
}

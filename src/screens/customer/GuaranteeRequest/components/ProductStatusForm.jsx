import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Textarea,
  Text,
  Flex,
  Badge,
  Button,
} from "@chakra-ui/react";
import ImageUpdateUploader from "../../../../components/Utility/ImageUpdateUploader.jsx";
import ImageListSelector from "../../../../components/Utility/ImageListSelector.jsx";
import GuaranteeErrorSelection from "./GuaranteeErrorSelection.jsx";

export default function ProductStatusForm({
  currentProductStatus,
  setCurrentProductStatus,
  currentProductImages,
  handleUploadComplete,
  isWarrantyValid,
  guaranteeError,
  setGuaranteeError,
  isGuarantee,
  setIsGuarantee,
  woodworkerId,
}) {
  // Toggle between guarantee and repair
  const toggleGuaranteeMode = () => {
    setIsGuarantee(!isGuarantee);
  };

  return (
    <Box bg="white" p={5} borderRadius="10px" boxShadow="sm">
      <Heading size="md" mb={4}>
        Tình trạng sản phẩm hiện tại
      </Heading>

      {isWarrantyValid && (
        <Flex mb={4} direction="column" gap={3}>
          <Flex alignItems="center">
            <Text fontWeight="medium" mr={2}>
              Hình thức yêu cầu:
            </Text>
            <Badge
              colorScheme={isGuarantee ? "green" : "blue"}
              fontSize="0.9em"
              px={2}
              py={1}
            >
              {isGuarantee ? "Bảo hành" : "Sửa chữa"}
            </Badge>
          </Flex>

          <Button
            size="sm"
            colorScheme={isGuarantee ? "blue" : "green"}
            variant="outline"
            onClick={toggleGuaranteeMode}
            alignSelf="flex-start"
          >
            {isGuarantee
              ? "Không tìm thấy lỗi của bạn, chuyển sang sửa chữa"
              : "Chuyển về bảo hành"}
          </Button>
        </Flex>
      )}

      {isWarrantyValid && isGuarantee && (
        <GuaranteeErrorSelection
          woodworkerId={woodworkerId}
          guaranteeError={guaranteeError}
          setGuaranteeError={setGuaranteeError}
        />
      )}

      <FormControl isRequired mb={4}>
        <FormLabel>Mô tả tình trạng hiện tại:</FormLabel>
        <Textarea
          value={currentProductStatus}
          onChange={(e) => setCurrentProductStatus(e.target.value)}
          placeholder="Mô tả chi tiết tình trạng sản phẩm và nêu rõ vấn đề bạn gặp phải..."
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Hình ảnh tình trạng hiện tại:</FormLabel>
        <ImageUpdateUploader
          imgUrls=""
          maxFiles={3}
          onUploadComplete={handleUploadComplete}
        />
        {currentProductImages.length > 0 && (
          <Box mt={4}>
            <Text fontWeight="medium" mb={2}>
              Hình ảnh đã tải lên:
            </Text>
            <ImageListSelector imgUrls={currentProductImages} imgH={100} />
          </Box>
        )}
      </FormControl>
    </Box>
  );
}

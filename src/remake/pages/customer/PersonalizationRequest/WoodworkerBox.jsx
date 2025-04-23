import React from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Spacer,
  Stack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import PackageFrame from "../../../components/Utility/PackageFrame";
import StarReview from "../../../components/Utility/StarReview";
import { appColorTheme, getPackTypeLabel } from "../../../config/appconfig";

export default function WoodworkerBox({ woodworkerProfile, mt = 6 }) {
  if (!woodworkerProfile) {
    return null;
  }

  return (
    <Box mt={mt}>
      <PackageFrame packageType={woodworkerProfile?.servicePack?.name}>
        <Flex
          flexDirection={{
            base: "column",
            xl: "row",
          }}
          borderRadius="10px"
          p={5}
          bgColor="white"
          boxShadow="md"
          gap={5}
        >
          {woodworkerProfile?.imgUrl && (
            <Box>
              <Image
                src={woodworkerProfile?.imgUrl}
                width="150px"
                height="150px"
                objectFit="cover"
                objectPosition="center"
                borderRadius="50%"
              />
            </Box>
          )}

          <Stack flex={1}>
            <Stack spacing={4}>
              <Flex justifyContent="space-between" alignContent="center">
                <Heading fontWeight="bold" fontSize="20px">
                  {woodworkerProfile?.brandName || "Xưởng mộc"}
                </Heading>

                <StarReview
                  totalReviews={woodworkerProfile?.totalReviews}
                  totalStar={woodworkerProfile?.totalStar}
                />
              </Flex>

              <Text>
                <b>Địa chỉ xưởng:</b>{" "}
                {woodworkerProfile?.address || "Chưa cập nhật"}
              </Text>

              {woodworkerProfile?.businessType && (
                <Text>
                  <b>Loại hình kinh doanh:</b>{" "}
                  {woodworkerProfile?.businessType || "Chưa cập nhật"}
                </Text>
              )}

              {woodworkerProfile?.servicePack?.name && (
                <HStack>
                  <Text fontWeight="bold">Loại xưởng:</Text>
                  <Text>
                    {getPackTypeLabel(woodworkerProfile?.servicePack?.name) ||
                      "Chưa cập nhật"}
                  </Text>
                </HStack>
              )}

              <HStack>
                <Spacer />
                <Text>
                  <ChakraLink
                    href={`/woodworker/${woodworkerProfile?.woodworkerId}`}
                    target="_blank"
                    textDecoration="underline"
                    color={appColorTheme.brown_2}
                  >
                    Xem xưởng
                  </ChakraLink>
                </Text>
              </HStack>
            </Stack>
          </Stack>
        </Flex>
      </PackageFrame>
    </Box>
  );
}

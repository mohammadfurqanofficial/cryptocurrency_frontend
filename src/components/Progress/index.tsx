import { CircularProgress, Flex } from "@chakra-ui/react";

export function Progress() {
  return (
    <Flex w="100%" h="100vh" align="center" justify="center">
      <CircularProgress isIndeterminate color="blue.200" size={"25rem"} />
    </Flex>
  );
}

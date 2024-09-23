import {
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { FiPlusCircle } from "react-icons/fi";

export function ButtonFloating() {
  return (
    <Flex position={"fixed"} top="90vh" left="90vw">
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FiPlusCircle fontSize={"40px"} />}
          variant="outline"
          border="0"
          outline={"none"}
        />
        <MenuList>
          <Button w="full">Alert</Button>
        </MenuList>
      </Menu>
    </Flex>
  );
}

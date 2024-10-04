import {
  CircularProgress,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  IconButton,
  Button, // Import Button from Chakra UI
} from "@chakra-ui/react";
import axios from "axios";
import Router from "next/router";
import { destroyCookie } from "nookies";
import { Dispatch, SetStateAction, useState } from "react";
import { DiAptana } from "react-icons/di";
import { AiOutlineLogout } from "react-icons/ai";
import { Toaster } from "react-hot-toast";

interface HeaderProps {
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

export function Header({ page, setPage }: HeaderProps) {
  const router = Router;
  const { toggleColorMode, colorMode } = useColorMode();
  const [progress, setProgress] = useState(false);
  const [allCoinsCsvData, setAllCoinsCsvData] = useState<any[]>([]);

  // Fetch all coins data for CSV download
  // async function handleDownloadAllCoins() {
  //   setProgress(true);
  //   try {
  //     const { data } = await axios.get(
  //       `${process.env.NEXT_PUBLIC_URL_BACKEND}/coins`
  //     );
  //     setAllCoinsCsvData(data); // Save the data for CSV download
  //   } catch (error) {
  //     console.error("Error fetching coins", error);
  //   }
  //   setProgress(false);
  // }

  function handleLogOut() {
    destroyCookie(null, "cripto.auth");
    Router.push("/login");
  }

  return (
    <Flex justify="space-between" w="full" px="30px" mt="20px" mb="20px">
      <Toaster />
      <Text fontSize={"40"}>CriptoLab</Text>
      <Flex alignItems="center" justify="flex-end">
        {progress && <CircularProgress isIndeterminate color="blue.200" />}
        
        {/* Back Button */}
        <Button
          onClick={() => router.push("/dashboard")} // Adjust the path to your dashboard route
          mb={4}
          colorScheme="blue" // Optional: Add color scheme
          mr={4} // Optional: Add margin to the right for spacing
        >
          Back to Dashboard
        </Button>
        
        <Menu>
          <MenuButton as={IconButton} icon={<DiAptana fontSize={"25px"} />} />
          <MenuList>
            <MenuItem onClick={() => router.push("/all-coins")}> {/* Link to All Coins page */}
              <Text>All Coins</Text>
            </MenuItem>
            <MenuItem onClick={handleLogOut}>
              <Text>Logout</Text>
              <Icon as={AiOutlineLogout} />
            </MenuItem>
            <MenuItem onClick={toggleColorMode}>
              Change theme to {colorMode === "light" ? "Dark" : "Light"}
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}

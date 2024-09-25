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
  useDisclosure
} from "@chakra-ui/react";
import axios from "axios";
import Router from "next/router";
import { destroyCookie } from "nookies";
import { Dispatch, SetStateAction, useState } from "react";
import { CriptoResponse } from "../../type/cripto";
import { DiAptana } from "react-icons/di";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineLogout,
} from "react-icons/ai";
import { Toaster } from "react-hot-toast";
import { CSVLink } from "react-csv";
import { FiDownload } from "react-icons/fi";
import { headersAll } from "../../csv";
import { BsHeartFill,BsFillExclamationCircleFill } from "react-icons/bs";
import Link from "next/link";
import  AlertPopup  from "../Header/alertPopup";

interface HeaderProps {
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

export function Header({ page, setPage }: HeaderProps) {
  const { toggleColorMode, colorMode } = useColorMode();
  const [progress, setProgress] = useState(false);
  const [allcoins, setAllcoins] = useState<CriptoResponse[]>([]);
  const [download, setDownload] = useState(false);
 
  const dataCSV = {
    headers: headersAll,
    data: allcoins,
  };

  function handleLogOut() {
    destroyCookie(null, "cripto.auth");
    Router.push("/login");
  }

  async function handlePrevPage() {
    if (page - 1 <= 0) {
      return;
    }
    setPage(page - 1);
  }

  async function handleNextPage() {
    if (page == 19) {
      return;
    }
    setPage(page + 1);
  }

  async function handleDownload() {
    setProgress(true);

    if (allcoins.length > 0) {
      setDownload(true);
      setProgress(false);
      return;
    }

    let number = 0;

    while (number < 36) {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/coin/take/all/?start=${number}`
      );
      setAllcoins((c) => [...c, ...data]);
      number++;
    }

    setDownload(true);
    setProgress(false);
  }
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex justify="space-between" w="full" px="30px" mt="20px" mb="20px">
      <Toaster />
      <Text fontSize={"40"}>CriptoLab</Text>
      <Flex
        w="full"
        alignItems={"right"}
        justify="end"
        mr="20px"
        align="center"
      > 
        {/* <Link passHref href="/favorite">
          <Icon
            as={BsHeartFill}
            cursor="pointer"
            fontSize="25px"
            mt="10px"
            mr="30px"
            _hover={{ opacity: "0.8" }}
            _active={{ opacity: "1" }}
          />
        </Link> */}
        {download && (
          <CSVLink
            {...dataCSV}
            style={{
              marginTop: "5px",
              marginRight: "15px",
              border: "1px solid #ddd",
              display: "inline",
              height: "30px",
              padding: "3px",
              borderRadius: "5px",
            }}
          >
            Download Now
          </CSVLink>
        )}
        {progress && (
          <Text fontSize="20px" mt="5px" mr="10px">
            {allcoins.length}
          </Text>
        )}
        {progress ? (
          <CircularProgress
            isIndeterminate
            color="blue.200"
            size={"2rem"}
            mt="4px"
            mr="4px"
          />
        ) : (
          !download && (
            <Icon
              as={FiDownload}
              fontSize={"30px"}
              borderRadius="10px"
              mt="6px"
              mr="10px"
              cursor="pointer"
              onClick={handleDownload}
            />
          )
        )}
        <Flex mt="4px" ml="20px">
          <Icon
            as={AiOutlineArrowLeft}
            fontSize={30}
            cursor={"pointer"}
            onClick={handlePrevPage}
          />
          <Flex px="7px" fontSize="20px">
            {page}
          </Flex>
          <Icon
            as={AiOutlineArrowRight}
            fontSize={30}
            cursor="pointer"
            onClick={handleNextPage}
          />
        </Flex>
      </Flex>
      <Menu>
        <MenuButton as={IconButton} icon={<DiAptana fontSize={"25px"} />} />
        <MenuList>
          <MenuItem onClick={handleLogOut}>
            <Text mr="10px" ml="10px">
              Logout
            </Text>
            <Icon as={AiOutlineLogout} mr="5px" />
          </MenuItem>
          <MenuItem onClick={() => toggleColorMode()}>
            <Text mr="10px" ml="10px">
              Change for theme {colorMode === "light" ? "Dark" : "Light"}
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

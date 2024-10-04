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
import { Dispatch, SetStateAction, useState, useEffect } from "react";
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
import Link from "next/link";

interface HeaderProps {
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

export function Header({ page, setPage }: HeaderProps) {
  const { toggleColorMode, colorMode } = useColorMode();
  const [progress, setProgress] = useState(false);
  const [allcoins, setAllcoins] = useState<CriptoResponse[]>([]);
  const [coinCsvData, setCoinCsvData] = useState<any[]>([]);

  function handleLogOut() {
    destroyCookie(null, "cripto.auth");
    Router.push("/login");
  }

  useEffect(() => {
    // Fetch all coins initially, replace with your real API call
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/coins`);
        setAllcoins(data);
      } catch (error) {
        console.error("Error fetching coins", error);
      }
    };
    fetchCoins();
  }, []);

  async function handlePrevPage() {
    if (page - 1 <= 0) {
      return;
    }
    setPage(page - 1);
  }

  async function handleNextPage() {
    if (page === 19) {
      return;
    }
    setPage(page + 1);
  }

  // Download specific coin CSV
  async function handleDownloadCoin(coinId: number) {
    setProgress(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/coins/coin-history/download/${coinId}?date=2024-10-04`
      );
      setCoinCsvData(data); // Set the coin data for CSV download
    } catch (error) {
      console.error("Error downloading coin history", error);
    }
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
        {progress && (
          <CircularProgress
            isIndeterminate
            color="blue.200"
            size={"2rem"}
            mt="4px"
            mr="4px"
          />
        )}

        {/* Coin-specific download buttons */}
        {allcoins.map((coin) => (
          <Flex key={coin.id} align="center" m="0 10px">
            <CSVLink
              data={coinCsvData}
              filename={`coin_${coin.id}_history.csv`}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <IconButton
                aria-label="Download CSV"
                icon={<FiDownload />}
                size="sm"
                onClick={() => handleDownloadCoin(Number(coin.id))} // Convert to number
              />
              <Text fontSize="12px">{coin.name}</Text>
            </CSVLink>
          </Flex>
        ))}

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
          <MenuItem>
            <Link href={`/allcoins`} passHref>
              <Text mr="10px" ml="10px">
                All Coins
              </Text>
            </Link>
          </MenuItem>
          <MenuItem onClick={handleLogOut}>
            <Text mr="10px" ml="10px">
              Logout
            </Text>
            <Icon as={AiOutlineLogout} mr="5px" />
          </MenuItem>
          <MenuItem onClick={() => toggleColorMode()}>
            <Text mr="10px" ml="10px">
              Change theme to {colorMode === "light" ? "Dark" : "Light"}
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

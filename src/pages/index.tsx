/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Table, Text, Button, Icon, Thead, Tbody, Tr, Th, Td, useColorMode, useDisclosure, Link as LinkChakra } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../services/apiClient";
import { SEO } from "../SEO/index";
import { Header } from "../components/Header";
import AlertPopup from "../components/Header/alertPopup";
import Link from 'next/link';
import { AiFillStar } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import { BsFillExclamationCircleFill } from "react-icons/bs";

interface CoinHistory {
  price: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_60d: number;
  percent_change_90d: number;
  market_cap: number;
  fully_diluted_market_cap: number;
  lastUpdated: string; // If you need it
}

interface FavoriteCoin {
  coinId: number;
  name: string;
  symbol: string;
  rank: number;
  coinHistoryId: CoinHistory[]; // Indicate that this is an array
}

export default function FavoriteCoins() {
  const [favorites, setFavorites] = useState<FavoriteCoin[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  // const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Add page state management
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get("/auth/profile");
        setUser(data); // Assuming the API returns { name: string, email: string }
      } catch (e: any) {
        if (e.response && e.response.status === 401) {
          router.push("/login"); // Redirect to login page if not authenticated
        } else {
          console.log(e.message);
        }
      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    async function fetchFavoriteCoins() {
      try {
        const { data } = await api.get("/favorites/all-favorites");
        // console.log("API Response:", data); // Log the entire response
        setFavorites(data.favorites); // Assuming the API returns the favorites in this structure
      } catch (e: any) {
        console.log(e.message);
      }
    }
  
    fetchFavoriteCoins();
  }, []);

  return (
    <Flex w="100%" justify="center" flexDir={"column"}>
      <SEO />
      <Header page={page} setPage={setPage} />

      {user && (
        <Flex
          p={4}
          bg="gray.100"
          borderRadius="md"
          mb={4}
          justify="space-between"
        >
          <Text fontSize="lg" color="gray.600">{user.name}</Text>
          <Text fontSize="md" color="gray.600">{user.email}</Text>
        </Flex>
      )}

      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Rank</Th>
            <Th>Name</Th>
            <Th>Symbol</Th>
            <Th>Price</Th>
            <Th>Volume (24h)</Th>
            <Th>Change (1hr)</Th>
            <Th>Change (24hr)</Th>
            <Th>Change (7d)</Th>
            <Th>Change (30d)</Th>
            <Th>Change (60d)</Th>
            <Th>Change (90d)</Th>
            <Th>Market Cap</Th>
            <Th>Market Cap Dominance</Th>
            <Th>Last Updated</Th>
            {/* <Th>Alert</Th> */}
          </Tr>
        </Thead>
        <Tbody style={{ textAlign: "center" }}>
          {favorites.map((coin) => {
            // console.log("Coin Data:", coin); // Log each coin's data
            const coinHistory = coin.coinHistoryId[0];
            // console.log("Coin Data History:", coinHistory); // Log each coin's data

            return (
              <Tr key={coin.coinId} style={{ height: "50px" }}>
                  <Td>{coin.coinId}</Td>
                  <Td>{coin.rank}</Td>
                  <Td>
                    <Link href={`/coin/${coin.coinId}`} passHref>
                      <Button size="sm" variant="link">
                        {coin.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td>{coin.symbol}</Td>
                  <Td>${coinHistory?.price !== undefined ? coinHistory.price.toFixed(8) : "N/A"}</Td>
                  <Td>${coinHistory?.volume_24h !== undefined ? coinHistory.volume_24h.toLocaleString() : "N/A"}</Td>
                  <Td>{coinHistory?.percent_change_1h !== undefined ? coinHistory.percent_change_1h.toFixed(8) + "%" : "N/A"}</Td>
                  <Td>{coinHistory?.percent_change_24h !== undefined ? coinHistory.percent_change_24h.toFixed(8) + "%" : "N/A"}</Td>
                  <Td>{coinHistory?.percent_change_7d !== undefined ? coinHistory.percent_change_7d.toFixed(8) + "%" : "N/A"}</Td>
                  <Td>{coinHistory?.percent_change_30d !== undefined ? coinHistory.percent_change_30d.toFixed(8) + "%" : "N/A"}</Td>
                  <Td>{coinHistory?.percent_change_60d !== undefined ? coinHistory.percent_change_60d.toFixed(8) + "%" : "N/A"}</Td>
                  <Td>{coinHistory?.percent_change_90d !== undefined ? coinHistory.percent_change_90d.toFixed(8) + "%" : "N/A"}</Td>
                  <Td>${coinHistory?.market_cap !== undefined ? coinHistory.market_cap.toLocaleString() : "N/A"}</Td>
                  <Td>${coinHistory?.fully_diluted_market_cap !== undefined ? coinHistory.fully_diluted_market_cap.toLocaleString() : "N/A"}</Td>
                  <Td>{coinHistory?.lastUpdated !== undefined ? coinHistory.lastUpdated.toLocaleString() : "N/A"}</Td>
                  {/* <Td><div><Icon
                  as={BsFillExclamationCircleFill}
                  cursor="pointer"
                  fontSize="25px"
                  mt="10px"
                  mr="30px"
                  _hover={{ opacity: "0.8" }}
                  _active={{ opacity: "1" }}
                /></div>
                </Td> */}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Flex>
  );
}

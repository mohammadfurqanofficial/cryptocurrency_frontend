/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Table, Text, Button, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../services/apiClient";
import { parseCookies } from "nookies";
import toast from "react-hot-toast";
import { SEO } from "../SEO/index";
import { Header } from "../components/Header";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import AlertPopup from "../components/Header/alertPopup";
import Link from 'next/link'; // Import Link from Next.js

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
        const { data } = await api.get("/favorites");
        console.log("API Response:", data); // Log the entire response
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
        <thead>
          <tr>
            <th>ID</th>
            <th>Rank</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Volume (24h)</th>
            <th>Change (1hr)</th>
            <th>Change (24hr)</th>
            <th>Change (7d)</th>
            <th>Change (30d)</th>
            <th>Change (60d)</th>
            <th>Change (90d)</th>
            <th>Market Cap</th>
            <th>Market Cap Dominance</th>
            <th>Alert</th>
            {/* <th>Last Updated</th> */}
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {favorites.map((coin) => {
            // console.log("Coin Data:", coin); // Log each coin's data
            const coinHistory = coin.coinHistoryId[0]; // Access the first element of the array
            // console.log("Coin Data History:", coinHistory); // Log each coin's data
            
            return (
              <tr key={coin.coinId} style={{ height: "50px" }}>
                <td>{coin.coinId}</td>
                <td>{coin.rank}</td>
                <td>
                  <Link href={`/coin/${coin.coinId}`} passHref>
                    <Button size="sm" variant="link">
                      {coin.name}
                    </Button>
                  </Link>
                </td>
                <td>{coin.symbol}</td>
                <td>${coinHistory?.price !== undefined ? coinHistory.price.toFixed(3) : "N/A"}</td>
                <td>${coinHistory?.volume_24h !== undefined ? coinHistory.volume_24h.toLocaleString() : "N/A"}</td>
                <td>{coinHistory?.percent_change_1h !== undefined ? coinHistory.percent_change_1h.toFixed(3) + "%" : "N/A"}</td>
                <td>{coinHistory?.percent_change_24h !== undefined ? coinHistory.percent_change_24h.toFixed(3) + "%" : "N/A"}</td>
                <td>{coinHistory?.percent_change_7d !== undefined ? coinHistory.percent_change_7d.toFixed(3) + "%" : "N/A"}</td>
                <td>{coinHistory?.percent_change_30d !== undefined ? coinHistory.percent_change_30d.toFixed(3) + "%" : "N/A"}</td>
                <td>{coinHistory?.percent_change_60d !== undefined ? coinHistory.percent_change_60d.toFixed(3) + "%" : "N/A"}</td>
                <td>{coinHistory?.percent_change_90d !== undefined ? coinHistory.percent_change_90d.toFixed(3) + "%" : "N/A"}</td>
                <td>${coinHistory?.market_cap !== undefined ? coinHistory.market_cap.toLocaleString() : "N/A"}</td>
                <td>${coinHistory?.fully_diluted_market_cap !== undefined ? coinHistory.fully_diluted_market_cap.toLocaleString() : "N/A"}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Flex>
  );
}

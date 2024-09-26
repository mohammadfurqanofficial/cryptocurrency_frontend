/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Table, Text, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../services/apiClient";
import { parseCookies } from "nookies";
import toast from "react-hot-toast";
import { SEO } from "../SEO/index";
import { Header } from "../components/Header";

interface FavoriteCoin {
  coinId: number;
  name: string;
  symbol: string;
  rank: number;
  coinHistoryId: {
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
    lastUpdated: string;
  };
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
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {favorites.map((coin) => (
            <tr key={coin.coinId} style={{ height: "50px" }}>
              <td>{coin.coinId}</td>
              <td>{coin.rank}</td>
              <td>{coin.name}</td>
              <td>{coin.symbol}</td>
              <td>${coin.coinHistoryId.price.toFixed(2)}</td>
              <td>${coin.coinHistoryId.volume_24h.toLocaleString()}</td>
              <td>{coin.coinHistoryId.percent_change_1h.toFixed(2)}%</td>
              <td>{coin.coinHistoryId.percent_change_24h.toFixed(2)}%</td>
              <td>{coin.coinHistoryId.percent_change_7d.toFixed(2)}%</td>
              <td>{coin.coinHistoryId.percent_change_30d.toFixed(2)}%</td>
              <td>{coin.coinHistoryId.percent_change_60d.toFixed(2)}%</td>
              <td>{coin.coinHistoryId.percent_change_90d.toFixed(2)}%</td>
              <td>${coin.coinHistoryId.market_cap.toLocaleString()}</td>
              <td>${coin.coinHistoryId.fully_diluted_market_cap.toLocaleString()}</td>
              <td>{new Date(coin.coinHistoryId.lastUpdated).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Flex>
  );
}

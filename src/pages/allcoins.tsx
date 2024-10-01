/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Table, Text, Button, Thead, Tbody, Tr, Th, Td  } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../services/apiClient";
import { parseCookies } from "nookies"; // If you're using cookies for authentication
import toast from "react-hot-toast";
import { SEO } from "../SEO/index";
import { Header } from "../components/Header";

interface CoinData {
  coinId: any;
  id: number;
  rank: number;
  name: string;
  symbol: string;
  is_active: number;
  last_historical_data: string;
}

export default function AllCoins() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]); // State to track favorite coins
  const [page, setPage] = useState(1); // Add page state management
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get("/auth/profile");
        setUser(data); // Assuming the API returns { name: string, email: string }
      } catch (e: any) {
        if (e.response && e.response.status === 401) {
          router.push("/login"); // Redirect to login page
        } else {
          console.log(e.message);
        }
      }
    }

    fetchProfile();
  }, []);


  useEffect(() => {
    async function fetchFavorites() {
      try {
        const { data } = await api.get("/favorites/all-favorites");
        setFavorites(data.favorites.map((coin: CoinData) => coin.coinId)); // Access the 'favorites' key
      } catch (error) {
        console.error("Failed to fetch favorite coins:", error);
      }
    }
  
    fetchFavorites();
  }, []);
  


  useEffect(() => {
    async function fetchAllCoins() {
      try {
        const { data } = await api.get("/allcoins", {
          params: {
            start: 1,
            limit: 3000,
          },
          headers: {
            "X-CMC_PRO_API_KEY": process.env.NEXT_PUBLIC_CMC_API_KEY, // API Key from .env.local
          },
        });
        setCoins(data.data); // Assuming the API returns data in this structure
      } catch (e: any) {
        console.log(e.message);
      }
    }

    fetchAllCoins();
  }, []);

  // Function to save coin history
  const saveCoinHistory = async (coinId: number) => {
    try {
      const response = await api.post("/coins/save-history", { coinId });
      toast.success("Coin history saved successfully."); // Show success message
    } catch (error) {
      toast.error("Failed to save coin history."); // Show error message
    }
  };

  

  // Function to handle adding a coin to favorites
  const handleAddToFavorites = async (coinId: number, name: string, symbol: string, rank: number) => {
    try {
      const cookies = parseCookies();
      const token = cookies["cripto.auth"]; // Get the auth token from cookies
  
      if (!token) {
        toast.error("You need to be logged in to add favorites.");
        return;
      }
  
      const response = await api.post(
        "/favorites/add",
        { coinId, name, symbol, rank },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Save coin history when the coin is successfully added to favorites
      await saveCoinHistory(coinId);
  
      toast.success(response.data.message); // Show success message
      setFavorites((prev) => [...prev, coinId]); // Update favorites state
    } catch (error) {
      toast.error("Failed to add coin to favorites."); // Show error message
    }
  };

  // Function to handle removing a coin from favorites
  const handleRemoveFromFavorites = async (coinId: number) => {
    try {
      const cookies = parseCookies();
      const token = cookies["cripto.auth"]; // Get the auth token from cookies
  
      if (!token) {
        toast.error("You need to be logged in to remove favorites.");
        return;
      }
  
      const response = await api.post(
        "/favorites/remove",
        { coinId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success(response.data.message); // Show success message
      setFavorites((prev) => prev.filter((id) => id !== coinId)); // Update favorites state
    } catch (error) {
      toast.error("Failed to remove coin from favorites."); // Show error message
    }
  };

  const toggleFavorite = async (coinId: number, name: string, symbol: string, rank: number) => {
    if (favorites.includes(coinId)) {
      await handleRemoveFromFavorites(coinId);
      setFavorites(favorites.filter(id => id !== coinId));
    } else {
      await handleAddToFavorites(coinId, name, symbol, rank);
      setFavorites([...favorites, coinId]);
    }
  };

  return (
    <Flex w="100%" justify="center" flexDir={"column"}>
      <SEO />
      <Header page={page} setPage={setPage} /> {/* Pass page and setPage here */}

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
            <Th>Last Update</Th>
            <Th>Favorite</Th>
          </Tr>
        </Thead>
        <Tbody style={{ textAlign: "center" }}>
          {coins.map((coin) => (
            <Tr key={coin.id} style={{ height: "50px" }}>
              <Td>{coin.id}</Td>
              <Td>{coin.rank}</Td>
              <Td>{coin.name}</Td>
              <Td>{coin.symbol}</Td>
              <Td>{new Date(coin.last_historical_data).toLocaleString()}</Td>
              <Td>
                <Button
                  size="sm"
                  onClick={() => toggleFavorite(coin.id, coin.name, coin.symbol, coin.rank)}
                >
                  {favorites.includes(coin.id) ? "Remove from Favorite" : "Add to Favorite"}
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
}

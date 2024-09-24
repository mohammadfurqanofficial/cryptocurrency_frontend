/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Table, Text, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../services/apiClient";
import { parseCookies } from "nookies"; // If you're using cookies for authentication
import toast from "react-hot-toast";
import { SEO } from "../SEO/index";

interface CoinData {
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

  const handleAddToFavorites = async (coinId: number) => {
    try {
      // Parse cookies
      const cookies = parseCookies();
      const token = cookies["cripto.auth"]; // Get the auth token from cookies
  
      if (!token) {
        toast.error("You need to be logged in to add favorites.");
        return;
      }
  
      const response = await api.post(
        "/api/favorites/add",
        { coinId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success(response.data.message); // Show success message
    } catch (error) {
      toast.error("Failed to add coin to favorites."); // Show error message
    }
  };
  
  

  return (
    <Flex w="100%" justify="center" flexDir={"column"}>
      <SEO />
      {user && (
        <Flex
          p={4}
          bg="gray.100"
          borderRadius="md"
          mb={4}
          justify="space-between"
        >
          <Text fontSize="lg">{user.name}</Text>
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
            {/* <th>Active</th> */}
            <th>Last Update</th>
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id}>
              <td>{coin.id}</td>
              <td>{coin.rank}</td>
              <td>{coin.name}</td>
              <td>{coin.symbol}</td>
              {/* <td>{#coin.is_active ? "Yes" : "No"}</td> */}
              <td>{new Date(coin.last_historical_data).toLocaleString()}</td>
              <td>
                <Button
                  size="sm"
                  onClick={() => handleAddToFavorites(coin.id)}
                >
                  Add to Favorite
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Flex>
  );
}

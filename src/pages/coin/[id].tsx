import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  CircularProgress,
  Input,
} from "@chakra-ui/react";
import { api } from "../../services/apiClient";
import { SEO } from "../../SEO/index";
import { Header } from "../../components/Header";
import { FiDownload } from "react-icons/fi";
import { Parser } from 'json2csv'; // Import the json2csv library

interface CoinHistory {
  _id: string;
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
}

interface CoinData {
  _id: string;
  coinId: string;
  name: string;
  symbol: string;
  rank: number;
  coinHistory: CoinHistory[];
}

const CoinDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [csvData, setCsvData] = useState<CoinHistory[]>([]); // Data for CSV download
  const [csvLoading, setCsvLoading] = useState(false); // Loading state for date-specific download
  const [csvAllLoading, setCsvAllLoading] = useState(false); // Loading state for all history download
  const [selectedDate, setSelectedDate] = useState(""); // State for the selected date
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (id) {
      const fetchCoinHistory = async () => {
        try {
          const { data } = await api.get(`/coins/coin-history/${id}`);
          setCoinData(data.coin[0]); // Assuming `data.coin` array
          setLoading(false);
        } catch (error: any) {
          console.error("Failed to fetch coin history:", error.message);
          setLoading(false);
        }
      };
      fetchCoinHistory();
    }
  }, [id]);

  // Function to download CSV
  const downloadCSV = (data: any[], filename: string): void => {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch all data for CSV download without a selected date (all history)
  const handleDownloadAllCoinHistory = async () => {
    if (!coinData) {
      console.error("coinData is not available.");
      return; // Early return if coinData is not set
    }
  
    setCsvAllLoading(true); // Use separate loading state for "All history" button
    try {
      const response = await api.get(`/coins/coin-history/${id}`);
      const respone_data = response.data.coin[0].coinHistory;
      console.log("Data formated response", response.data.coin[0]);
      const initial_data = response.data.coin[0];
      // console.log("Coin history data", response.data.coinHistory);
      // Validate the response format
      if (response.status === 200 && response.data && Array.isArray(respone_data)) {
        const allHistoryData = respone_data.map((history: CoinHistory) => ({
          name: initial_data.name,
          symbol: initial_data.symbol,
          price: history.price,
          volume_24h: history.volume_24h,
          percent_change_1h: history.percent_change_1h,
          percent_change_24h: history.percent_change_24h,
          percent_change_7d: history.percent_change_7d,
          percent_change_30d: history.percent_change_30d,
          percent_change_60d: history.percent_change_60d,
          percent_change_90d: history.percent_change_90d,
          market_cap: history.market_cap,
          fully_diluted_market_cap: history.fully_diluted_market_cap,
          lastUpdated: history.lastUpdated,
        }));
        downloadCSV(allHistoryData, `${coinData.name}_all_history.csv`);
      } else {
        console.warn("Unexpected data format or empty response", response.data.coin[0]);
      }
    } catch (error: any) {
      console.error("Error downloading all coin history", error);
    } finally {
      setCsvAllLoading(false); // Ensure the loading state is reset
    }
  };

  // Fetch data for CSV download with the selected date
  const handleDownloadCoinHistory = async () => {
    if (!selectedDate) {
        console.warn("No date selected for CSV download");
        return; // Early return if no date is selected
    }

    if (!coinData) {
        console.error("coinData is not available.");
        return;
    }

    setCsvLoading(true);
    try {
        const response = await api.get(`/coins/coin-history/download/${id}?date=${selectedDate}`);

        if (response.status === 200 && Array.isArray(response.data)) {
            setCsvData(response.data);

            downloadCSV(response.data, `${coinData.name}_history_${selectedDate}.csv`);
        } else {
            console.warn("Unexpected data format", response.data);
            setCsvData([]);
        }
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            alert(error.response.data.message || "No data found for the selected date.");
        } else {
            console.error("Error downloading coin history", error);
        }
    }
    setCsvLoading(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!coinData) {
    return <p>No data found for this coin.</p>;
  }

  return (
    <Flex w="100%" justify="center" flexDir={"column"}>
      <SEO title={`${coinData.name} Details`} />
      <Header page={page} setPage={setPage} />
      <Text fontSize="2xl" mb={4}>
        {coinData.name} ({coinData.symbol}) - Coin Details
      </Text>

      {/* Date Input and Download CSV Button */}
      <Flex mb={4} justify="flex-end" align="center">
        {/* Date Picker */}
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          placeholder="Select a date"
          mr={4}
          maxW="200px"
        />

        {csvLoading ? (
          <CircularProgress isIndeterminate color="blue.200" />
        ) : (
          <IconButton
            aria-label="Download Coin History"
            icon={<FiDownload />}
            onClick={handleDownloadCoinHistory}
            isDisabled={!selectedDate || csvLoading}
          />
        )}

        {csvAllLoading ? (
          <CircularProgress isIndeterminate color="blue.200" />
        ) : (
          <IconButton
            aria-label="Download All History"
            icon={<FiDownload />}
            onClick={handleDownloadAllCoinHistory}
            isDisabled={csvAllLoading}
          />
        )}
      </Flex>

      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
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
          </Tr>
        </Thead>
        <Tbody>
          {coinData.coinHistory.map((history) => (
            <Tr key={history._id}>
              <Td>{coinData.symbol}</Td>
              <Td>${history?.price !== undefined ? history.price.toFixed(8) : "N/A"}</Td>
              <Td>${history?.volume_24h !== undefined ? history.volume_24h.toLocaleString() : "N/A"}</Td>
              <Td>{history?.percent_change_1h !== undefined ? history.percent_change_1h.toFixed(8) + "%" : "N/A"}</Td>
              <Td>{history?.percent_change_24h !== undefined ? history.percent_change_24h.toFixed(8) + "%" : "N/A"}</Td>
              <Td>{history?.percent_change_7d !== undefined ? history.percent_change_7d.toFixed(8) + "%" : "N/A"}</Td>
              <Td>{history?.percent_change_30d !== undefined ? history.percent_change_30d.toFixed(8) + "%" : "N/A"}</Td>
              <Td>{history?.percent_change_60d !== undefined ? history.percent_change_60d.toFixed(8) + "%" : "N/A"}</Td>
              <Td>{history?.percent_change_90d !== undefined ? history.percent_change_90d.toFixed(8) + "%" : "N/A"}</Td>
              <Td>${history?.market_cap !== undefined ? history.market_cap.toLocaleString() : "N/A"}</Td>
              <Td>${history?.fully_diluted_market_cap !== undefined ? history.fully_diluted_market_cap.toLocaleString() : "N/A"}</Td>
              <Td>{history?.lastUpdated !== undefined ? history.lastUpdated.toLocaleString() : "N/A"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};

export default CoinDetails;

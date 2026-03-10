import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import mike from "../../Asset/Mike.png";
import search from "../../Asset/searchIcon.svg";
import { debounce } from "lodash";
import useProductStore from "@/app/storeContext/store";
import Link from "next/link";

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hideSuggestions, setHideSuggestionsg] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [enterClicked, setEnterClicked] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [keyword, setKeyword] = useState("");

  const router = useRouter();
  const { fetchSearchProductData, searchProducts } = useProductStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const keywordParam = decodeURIComponent(searchParams.get("keyword") || "");
      setKeyword(keywordParam);
      setSearchQuery(keywordParam);
    }
  }, []);
  let timer = null
  const handleSearchChange = (event) => {
    setHideSuggestionsg(false);
    setSearchQuery(event.target.value);
    clearTimeout(timer)
    timer = setTimeout(() => {
      handleKeyPress();
    }, 500);
  }
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "en-US";

      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };

      speechRecognition.onerror = () => {
        setIsListening(false);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    }
  }, []);

  useEffect(() => {
    const debouncedFetchSearchProducts = debounce(async () => {
      await fetchSearchProductData(searchQuery);
    }, 500);

    if (searchQuery !== "") {
      debouncedFetchSearchProducts();
    } else {
      fetchSearchProductData(searchQuery);
    }

    return () => {
      debouncedFetchSearchProducts.cancel();
    };
  }, [searchQuery]);

  const handleKeyPress = (e) => {
    console.log('Searchbar.jsx @ Line 79:', e);
    setEnterClicked(false);
    setHideSuggestionsg(false);
    if (searchQuery.trim() !== "") {
      if (e.key === 'Enter') {
        setEnterClicked(true);
        setHideSuggestionsg(true);
        router.push(`/searchlist?keyword=${encodeURIComponent(searchQuery)}`);
        setSearchQuery(""); 
        setTimeout(() => {
          if (window.location.href.includes('searchlist')) {
  
            window.location.reload();
          }
          
        }, 500);
      }
    }
  };

  return (
    <div className="relative flex flex-1 bg-white rounded-3xl justify-between items-center px-5 py-2">
      <div className="flex items-center gap-4">
        <Image src={search} alt="Search" className="w-5 h-5" />
        <input
          type="text"
          placeholder="Search"
          className="lg:text-lg outline-none w-32 md:w-60"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e)}
          onKeyPress={handleKeyPress}
        />
      </div>

      <Image
        src={mike}
        alt="Mic"
        className={`w-5 h-5 cursor-pointer ${isListening ? "text-red-500" : ""}`}
        onClick={() => recognition?.start()}
      />
{/* searchQuery !== "" && !hideSuggestions && */}
      { searchQuery !== "" && !hideSuggestions && (
        searchProducts.length > 0 ? (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 z-[99] max-h-[400px] overflow-y-auto">
            <div className="p-2 bg-gray-100 border-b border-gray-300 font-semibold text-[12px]">
              Search Results
            </div>
            {searchProducts.map((result, index) => (
              <Link href={`/ProductDetails/name/${encodeURIComponent(result.product_name.replaceAll('/', '-SPLIT-'))}`} key={index}>
                <div className="p-2 border-b border-gray-200 text-[12px] hover:bg-[#45B348] hover:text-white transition duration-300 cursor-pointer">
                  {result.product_name}
                </div>
              </Link>
            ))}
            <div className="p-2 bg-gray-100 text-center text-[11px] sticky bottom-0">
              Powered by online king
            </div>
          </div>
        ) : (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 z-[99]">
            <div className="p-2 bg-gray-100 border-b border-gray-300 font-semibold text-[12px]">
              No Results
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Searchbar;

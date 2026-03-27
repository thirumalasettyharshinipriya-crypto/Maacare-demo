import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LangContext";

interface Hospital {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
  distanceKm?: number;
}

interface OfflineHospital {
  district: string;
  state: string;
  name: string;
  phone: string;
  address: string;
}

const OFFLINE_HOSPITALS: OfflineHospital[] = [
  {
    district: "Hyderabad",
    state: "Telangana",
    name: "Osmania General Hospital",
    phone: "040-24600000",
    address: "Afzalgunj, Hyderabad, Telangana 500012",
  },
  {
    district: "Hyderabad",
    state: "Telangana",
    name: "Niloufer Hospital (Govt. Women & Children)",
    phone: "040-23300191",
    address: "Red Hills, Lakdikapul, Hyderabad 500004",
  },
  {
    district: "Warangal",
    state: "Telangana",
    name: "MGM Government Hospital Warangal",
    phone: "0870-2444455",
    address: "Lashkar Bazar, Warangal, Telangana 506002",
  },
  {
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    name: "King George Hospital (KGH)",
    phone: "0891-2564891",
    address: "Maharani Peta, Visakhapatnam, AP 530002",
  },
  {
    district: "Vijayawada",
    state: "Andhra Pradesh",
    name: "Government General Hospital Vijayawada",
    phone: "0866-2576131",
    address: "Governorpet, Vijayawada, AP 520002",
  },
  {
    district: "Tirupati",
    state: "Andhra Pradesh",
    name: "SVIMS Government Hospital",
    phone: "0877-2287777",
    address: "Alipiri Road, Tirupati, AP 517507",
  },
  {
    district: "Chennai",
    state: "Tamil Nadu",
    name: "Rajiv Gandhi Government General Hospital",
    phone: "044-25305000",
    address: "Park Town, Chennai, Tamil Nadu 600003",
  },
  {
    district: "Madurai",
    state: "Tamil Nadu",
    name: "Government Rajaji Hospital",
    phone: "0452-2532535",
    address: "Panagal Road, Madurai, Tamil Nadu 625020",
  },
  {
    district: "Coimbatore",
    state: "Tamil Nadu",
    name: "Coimbatore Medical College Hospital",
    phone: "0422-2301945",
    address: "Avinashi Road, Coimbatore, Tamil Nadu 641014",
  },
  {
    district: "Bengaluru",
    state: "Karnataka",
    name: "Bowring & Lady Curzon Hospital",
    phone: "080-25540673",
    address: "Shivaji Nagar, Bengaluru, Karnataka 560001",
  },
  {
    district: "Bengaluru",
    state: "Karnataka",
    name: "Victoria Hospital (Bangalore Medical College)",
    phone: "080-26701150",
    address: "Fort Road, Bengaluru, Karnataka 560002",
  },
  {
    district: "Mysuru",
    state: "Karnataka",
    name: "K.R. Hospital (Mysore Medical College)",
    phone: "0821-2521026",
    address: "Irwin Road, Mysuru, Karnataka 570021",
  },
  {
    district: "Mumbai",
    state: "Maharashtra",
    name: "KEM Hospital (King Edward Memorial)",
    phone: "022-24107000",
    address: "Acharya Donde Marg, Parel, Mumbai 400012",
  },
  {
    district: "Pune",
    state: "Maharashtra",
    name: "Sassoon General Hospital",
    phone: "020-26128000",
    address: "Near Railway Station, Pune, Maharashtra 411001",
  },
  {
    district: "Nagpur",
    state: "Maharashtra",
    name: "Government Medical College & Hospital Nagpur",
    phone: "0712-2728900",
    address: "Medical Square, Nagpur, Maharashtra 440003",
  },
  {
    district: "Kolkata",
    state: "West Bengal",
    name: "SSKM (PG Hospital) Kolkata",
    phone: "033-22041738",
    address: "244 AJC Bose Road, Kolkata, WB 700020",
  },
  {
    district: "Kolkata",
    state: "West Bengal",
    name: "NRS Medical College & Hospital",
    phone: "033-22654600",
    address: "138 AJC Bose Road, Kolkata, WB 700014",
  },
  {
    district: "New Delhi",
    state: "Delhi",
    name: "AIIMS New Delhi",
    phone: "011-26588500",
    address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029",
  },
  {
    district: "New Delhi",
    state: "Delhi",
    name: "Lok Nayak Hospital",
    phone: "011-23232400",
    address: "Jawaharlal Nehru Marg, New Delhi 110002",
  },
  {
    district: "Patna",
    state: "Bihar",
    name: "PMCH (Patna Medical College)",
    phone: "0612-2300100",
    address: "Ashok Rajpath, Patna, Bihar 800004",
  },
  {
    district: "Bhopal",
    state: "Madhya Pradesh",
    name: "AIIMS Bhopal",
    phone: "0755-2672345",
    address: "Saket Nagar, Bhopal, MP 462020",
  },
  {
    district: "Jaipur",
    state: "Rajasthan",
    name: "SMS Hospital Jaipur",
    phone: "0141-2560291",
    address: "JLN Marg, Jaipur, Rajasthan 302004",
  },
];

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type PageState = "idle" | "locating" | "fetching" | "done" | "error";

function OfflineHospitalsSection({ prominent }: { prominent?: boolean }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? OFFLINE_HOSPITALS.filter(
        (h) =>
          h.district.toLowerCase().includes(query.toLowerCase()) ||
          h.state.toLowerCase().includes(query.toLowerCase()) ||
          h.name.toLowerCase().includes(query.toLowerCase()),
      )
    : OFFLINE_HOSPITALS;

  return (
    <section
      data-ocid="hospitals.panel"
      className={`space-y-3 ${
        prominent
          ? "bg-rose-50 border-2 border-rose-300 rounded-2xl p-4"
          : "mt-6 border-t-2 border-dashed border-rose-200 pt-6"
      }`}
    >
      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">📵</span>
        <div>
          <h3 className="font-bold text-rose-700 text-lg leading-tight">
            Offline Hospital Contacts
          </h3>
          <p className="text-xs text-rose-500 font-medium">
            ऑफलाइन अस्पताल संपर्क • ఆఫ్‌లైన్ ఆసుపత్రి సంప్రదింపులు
          </p>
        </div>
        <span className="ml-auto bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-full">
          Pre-saved
        </span>
      </div>

      <p className="text-sm text-gray-600">
        These contacts work without internet. Search your district or state.
      </p>

      {/* Search box */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">
          🔍
        </span>
        <input
          data-ocid="hospitals.search_input"
          type="text"
          placeholder="Search district or state (e.g. Hyderabad, Tamil Nadu)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-2 border-rose-200 focus:border-rose-400 rounded-xl pl-9 pr-3 py-2.5 text-base outline-none bg-white"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500">
        Showing {filtered.length} of {OFFLINE_HOSPITALS.length} hospitals
      </p>

      {/* Hospital cards */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div
            data-ocid="hospitals.empty_state"
            className="text-center py-6 text-gray-500 bg-white rounded-xl border border-rose-100"
          >
            <p className="text-2xl mb-1">🏥</p>
            <p className="font-medium">No hospitals match your search.</p>
            <p className="text-sm mt-1">
              Try a different district or state name.
            </p>
          </div>
        ) : (
          filtered.map((h, idx) => (
            <div
              key={`${h.district}-${h.name}`}
              data-ocid={`hospitals.item.${idx + 1}`}
              className="bg-white rounded-2xl border border-rose-100 shadow-sm p-4 space-y-2"
            >
              <div className="flex items-start gap-2">
                <span className="text-xl mt-0.5">🏥</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm leading-tight">
                    {h.name}
                  </p>
                  <p className="text-xs text-rose-600 font-semibold mt-0.5">
                    📍 {h.district}, {h.state}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{h.address}</p>
                </div>
              </div>
              <a
                data-ocid={`hospitals.link.${idx + 1}`}
                href={`tel:${h.phone}`}
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
              >
                📞 {h.phone} — Call Now
              </a>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default function HospitalsPage() {
  const { t } = useLang();
  const [state, setState] = useState<PageState>("idle");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [manualQuery, setManualQuery] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    locate();
  }, []);

  function locate() {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation not supported by your browser.");
      setState("error");
      return;
    }
    setState("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserPos({ lat, lon });
        fetchHospitals(lat, lon);
      },
      (err) => {
        setErrorMsg(
          err.code === 1
            ? "Location access denied. Please allow location or search manually."
            : "Could not get your location. Please search manually.",
        );
        setState("error");
      },
      { timeout: 12000, maximumAge: 60000 },
    );
  }

  async function fetchHospitals(
    lat: number,
    lon: number,
    amenity = "hospital",
  ) {
    setState("fetching");
    try {
      const query = `[out:json][timeout:25];(node["amenity"="${amenity}"](around:10000,${lat},${lon});way["amenity"="${amenity}"](around:10000,${lat},${lon}););out body;>;out skel qt;`;
      const res = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
      );
      const json = await res.json();
      let elements: Hospital[] = (json.elements ?? []).filter(
        (el: Hospital) => el.lat && el.lon,
      );
      if (elements.length === 0 && amenity === "hospital") {
        // fallback to clinics
        return fetchHospitals(lat, lon, "clinic");
      }
      elements = elements
        .map((el) => ({
          ...el,
          distanceKm: haversine(lat, lon, el.lat, el.lon),
        }))
        .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
        .slice(0, 20);
      setHospitals(elements);
      setState("done");
    } catch {
      setErrorMsg("Failed to fetch hospitals. Check your connection.");
      setState("error");
    }
  }

  function openManualSearch() {
    if (!manualQuery.trim()) return;
    window.open(
      `https://www.openstreetmap.org/search?query=hospital+near+${encodeURIComponent(manualQuery)}`,
      "_blank",
    );
  }

  const isLoading = state === "locating" || state === "fetching";

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Header */}
      <h2 className="text-2xl font-bold text-rose-700">
        🏥 {t.nearbyHospitals}
      </h2>

      {/* Emergency Banner */}
      <div className="bg-red-600 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg">
        <span className="text-3xl">🆘</span>
        <div>
          <p className="font-bold text-lg leading-tight">
            Emergency? Tap a hospital below for directions
          </p>
          <p className="text-sm opacity-90">
            आपातकाल? नीचे अस्पताल चुनें • అత్యవసరమా? దిగువ ఆసుపత్రిని నొక్కండి
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          data-ocid="hospitals.loading_state"
          className="flex flex-col items-center justify-center py-12 gap-4"
        >
          <div className="w-12 h-12 border-4 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
          <p className="text-rose-700 font-semibold text-lg">
            {state === "locating"
              ? t.findingLocation
              : "Fetching nearby hospitals..."}
          </p>
        </div>
      )}

      {/* Error / Denied */}
      {state === "error" && (
        <div
          data-ocid="hospitals.error_state"
          className="bg-orange-50 border border-orange-200 rounded-2xl p-4 space-y-3"
        >
          <p className="text-orange-700 font-semibold">⚠️ {errorMsg}</p>
          <button
            type="button"
            data-ocid="hospitals.primary_button"
            onClick={locate}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            🔄 Try Again / फिर कोशिश करें
          </button>
          <div className="border-t border-orange-200 pt-3">
            <p className="text-sm text-gray-600 mb-2 font-semibold">
              Or search manually / या मैन्युअल खोजें
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="City / Area name..."
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && openManualSearch()}
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-base"
              />
              <button
                type="button"
                data-ocid="hospitals.secondary_button"
                onClick={openManualSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition-colors"
              >
                🔍
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline fallback — prominent when GPS is denied/error */}
      {state === "error" && <OfflineHospitalsSection prominent />}

      {/* Map + results */}
      {state === "done" && userPos && (
        <>
          {/* Map */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-500">
              📍 Your Location / आपकी लोकेशन / మీ స్థానం
            </p>
            <iframe
              title="Your location map"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${userPos.lon - 0.1},${userPos.lat - 0.1},${userPos.lon + 0.1},${userPos.lat + 0.1}&layer=mapnik&marker=${userPos.lat},${userPos.lon}`}
              className="w-full rounded-2xl border border-rose-100 shadow-md"
              style={{ height: 250 }}
              loading="lazy"
            />
            <p className="text-xs text-gray-400 text-center">
              Map shows hospitals within 10 km radius
            </p>
          </div>

          {/* No results */}
          {hospitals.length === 0 && (
            <div
              data-ocid="hospitals.empty_state"
              className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center"
            >
              <p className="text-yellow-700 font-semibold">
                No hospitals found within 10 km.
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Try searching manually below.
              </p>
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  placeholder="City / Area name..."
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-base"
                />
                <button
                  type="button"
                  onClick={openManualSearch}
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl"
                >
                  🔍
                </button>
              </div>
            </div>
          )}

          {/* Hospital list */}
          {hospitals.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-rose-700 text-lg">
                {hospitals.length} hospitals found nearby
              </h3>
              {hospitals.map((h, idx) => {
                const name = h.tags.name || h.tags["name:en"] || "Hospital";
                const phone = h.tags.phone || h.tags["contact:phone"];
                const address = h.tags["addr:street"];
                const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userPos.lat},${userPos.lon}&destination=${h.lat},${h.lon}&travelmode=driving`;
                return (
                  <div
                    key={h.id}
                    data-ocid={`hospitals.item.${idx + 1}`}
                    className="bg-white rounded-2xl shadow-md p-4 border border-rose-100 space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl mt-0.5">🏥</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-base leading-tight">
                          {name}
                        </p>
                        <p className="text-sm text-rose-600 font-semibold">
                          📍 {h.distanceKm?.toFixed(1)} km away
                        </p>
                        {address && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {address}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <a
                        data-ocid={`hospitals.button.${idx + 1}`}
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-0 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-3 rounded-xl text-center text-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        🗺️ {t.getDirections}
                      </a>
                      {phone && (
                        <a
                          data-ocid={`hospitals.link.${idx + 1}`}
                          href={`tel:${phone}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors flex items-center gap-1.5"
                        >
                          📞 Call
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Retry button */}
      {state === "done" && (
        <button
          type="button"
          data-ocid="hospitals.secondary_button"
          onClick={() => {
            setHospitals([]);
            hasFetched.current = false;
            locate();
          }}
          className="w-full border-2 border-rose-300 text-rose-600 font-bold py-3 rounded-xl hover:bg-rose-50 transition-colors"
        >
          🔄 Refresh Location
        </button>
      )}

      {/* Offline fallback — always shown at bottom as backup */}
      {(state === "done" || state === "idle") && <OfflineHospitalsSection />}

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 pt-4">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose-400 underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

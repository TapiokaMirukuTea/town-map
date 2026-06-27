import { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import { spots } from "./data/spots";

function App() {
  const [loading, setLoading] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("すべて");

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [selectedSpot, setSelectedSpot] = useState<
    (typeof spots)[number] | null
  >(null);

  const [viewState, setViewState] = useState({
    longitude: 132.505,
    latitude: 34.392,
    zoom: 13,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  const filteredSpots = spots.filter((spot) => {
    const matchesSearch = spot.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "すべて" || spot.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            color: "#111827",
            marginBottom: "10px",
          }}
        >
          府中町デジタルマップ
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "18px",
          }}
        >
          β Ver 0.5
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <Map
        longitude={viewState.longitude}
        latitude={viewState.latitude}
        zoom={viewState.zoom}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{
          width: "100%",
          height: "100%",
        }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        attributionControl={false}
      >
        {/* 現在地 */}
        {userLocation && (
          <Marker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "#007AFF",
                border: "3px solid white",
                boxShadow: "0 0 10px rgba(0,0,0,0.4)",
              }}
            />
          </Marker>
        )}

        {/* スポット */}
        {filteredSpots.map((spot) => (
          <Marker key={spot.id} longitude={spot.lng} latitude={spot.lat}>
            <div
              onClick={() => {
                setViewState({
                  longitude: spot.lng,
                  latitude: spot.lat,
                  zoom: 16,
                });

                setSelectedSpot(spot);
              }}
              style={{
                fontSize: "32px",
                cursor: "pointer",
              }}
            >
              {spot.icon}
            </div>
          </Marker>
        ))}
      </Map>

      {userLocation && (
        <button
          onClick={() => {
            setViewState({
              longitude: userLocation.longitude,
              latitude: userLocation.latitude,
              zoom: 16,
            });
          }}
          style={{
            position: "absolute",
            right: "20px",
            bottom: selectedSpot ? "320px" : "20px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontSize: "24px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          📍
        </button>
      )}

      {/* メニューボタン */}
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "50px",
          height: "50px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          fontSize: "24px",
          color: "#111827",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        ☰
      </div>

      {/* サイドメニュー */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "320px",
            maxWidth: "85%",
            height: "100%",
            backgroundColor: "#ffffff",
            zIndex: 999,
            padding: "20px",
            overflowY: "auto",
            boxShadow: "4px 0 15px rgba(0,0,0,0.2)",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              color: "#111827",
              marginTop: "60px",
            }}
          >
            府中町デジタルマップ
          </h2>

          <input
            type="text"
            placeholder="スポット検索..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              marginBottom: "20px",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            {[
              "すべて",
              "神社",
              "公園",
              "商業施設",
              "公共施設",
              "観光",
              "歴史",
            ].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor:
                    selectedCategory === category ? "#111827" : "#f3f4f6",
                  color: selectedCategory === category ? "#ffffff" : "#111827",
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => {
                setViewState({
                  longitude: spot.lng,
                  latitude: spot.lat,
                  zoom: 16,
                });

                setSelectedSpot(spot);
                setMenuOpen(false);
              }}
              style={{
                padding: "12px",
                marginBottom: "10px",
                backgroundColor: "#f9fafb",
                borderRadius: "10px",
                cursor: "pointer",
                color: "#111827",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                }}
              >
                {spot.icon} {spot.name}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                {spot.category}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 詳細カード */}
      {selectedSpot && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#ffffff",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.25)",
            maxHeight: "70vh",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "5px",
              backgroundColor: "#d1d5db",
              borderRadius: "999px",
              margin: "12px auto",
            }}
          />

          <img
            src={selectedSpot.image}
            alt={selectedSpot.name}
            style={{
              width: "100%",
              height: "220px",
              objectFit: "cover",
            }}
          />

          <div
            style={{
              padding: "20px",
              color: "#111827",
            }}
          >
            <h2
              style={{
                color: "#111827",
                marginTop: 0,
                marginBottom: "10px",
              }}
            >
              {selectedSpot.icon} {selectedSpot.name}
            </h2>

            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                backgroundColor: "#f3f4f6",
                borderRadius: "999px",
                marginBottom: "12px",
              }}
            >
              {selectedSpot.category}
            </div>

            <p
              style={{
                lineHeight: "1.8",
              }}
            >
              {selectedSpot.description}
            </p>

            {selectedSpot.address && (
              <p
                style={{
                  color: "#6b7280",
                  marginTop: "16px",
                  marginBottom: "20px",
                  lineHeight: "1.6",
                }}
              >
                📍 {selectedSpot.address}
              </p>
            )}

            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.lat},${selectedSpot.lng}`,
                  "_blank",
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "#06B6D4",
                color: "#fff",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              🧭 経路案内
            </button>

            {selectedSpot.website && (
              <button
                onClick={() => window.open(selectedSpot.website, "_blank")}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "12px",
                  backgroundColor: "#14B8A6",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                🌐 公式サイト
              </button>
            )}

            <button
              onClick={() => setSelectedSpot(null)}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "15px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "#111827",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

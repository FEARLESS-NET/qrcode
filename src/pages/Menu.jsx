import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = async () => {
    try {
      const res = await axiosInstance.get("/menus");
      setMenus(Array.isArray(res.data.menus) ? res.data.menus : []);
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedMenus = menus.reduce((acc, menu) => {
    const category = menu.category || "Boshqa";
    if (!acc[category]) acc[category] = [];
    acc[category].push(menu);
    return acc;
  }, {});

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

    
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 animate-slowZoom"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')",
        }}
      ></div>

      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,200,100,0.15),transparent_40%)]"></div>

      
      <div className="relative z-10 px-10 py-10">

        <h2 className="text-4xl font-bold mb-10 text-center text-white tracking-wide">
          🍽️ Restaurant Menu
        </h2>

        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : menus.length === 0 ? (
          <p className="text-center text-white">No data</p>
        ) : (
          Object.keys(groupedMenus).map((category) => (
            <div key={category} className="mb-12">
              
              <h3 className="text-2xl font-semibold mb-6 text-white border-l-4 border-yellow-400 pl-4">
                {category}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {groupedMenus[category].map((menu) => (
                  <div
                    key={menu.id}
                    className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 hover:-rotate-1 transition duration-500 group"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={menu.image}
                        alt={menu.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>

                    <div className="p-4 text-white">
                      <h3 className="text-xl font-semibold mb-2">
                        {menu.name}
                      </h3>

                      <p className="text-sm opacity-80 mb-2">
                        {menu.descr}
                      </p>

                      <p className="text-sm mb-3">
                        🍴 {menu.retsept}
                      </p>

                      <span className="inline-block bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-semibold">
                        {menu.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Menu;
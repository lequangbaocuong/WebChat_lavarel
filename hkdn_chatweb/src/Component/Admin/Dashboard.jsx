import React from "react";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-purple-700 mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Thống Kê Người Dùng */}
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold text-purple-600">
            Tổng Người Dùng
          </h2>
          <p className="mt-2 text-2xl">1234</p>
        </div>
        {/* Card Thống Kê Phòng Chat */}
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold text-purple-600">
            Tổng Phòng Chat
          </h2>
          <p className="mt-2 text-2xl">56</p>
        </div>
        {/* Card Thống Kê Tin Nhắn */}
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold text-purple-600">
            Tổng Tin Nhắn
          </h2>
          <p className="mt-2 text-2xl">7890</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

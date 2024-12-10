import React, { useState } from "react";
import { FaUsers, FaComments, FaDoorOpen } from "react-icons/fa";

const Dashboard = () => {
  const [stats] = useState({
    totalMessages: 15789,
    totalUsers: 2456,
    totalRooms: 185
  });

  const StatCard = ({ title, value, icon: Icon, bgColor, hoverColor }) => (
    <div
      className={`p-6 rounded-xl shadow-lg ${bgColor} hover:${hoverColor} transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-100 text-lg font-medium mb-2">{title}</h3>
          <p className="text-white text-3xl font-bold">
            {value.toLocaleString()}
          </p>
        </div>
        <div className="text-white/50 text-5xl">
          <Icon />
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Thống kê</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Tổng số tin nhắn"
            value={stats.totalMessages}
            icon={FaComments}
            bgColor="bg-blue-500"
            hoverColor="bg-blue-600"
          />

          <StatCard
            title="Tổng user"
            value={stats.totalUsers}
            icon={FaUsers}
            bgColor="bg-green-500"
            hoverColor="bg-green-600"
          />

          <StatCard
            title="Tổng phòng chat"
            value={stats.totalRooms}
            icon={FaDoorOpen}
            bgColor="bg-purple-500"
            hoverColor="bg-purple-600"
          />
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Số tin nhắn trung bình mỗi phòng</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(stats.totalMessages / stats.totalRooms)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Số tin nhắn trung bình mỗi user</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(stats.totalMessages / stats.totalUsers)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Số user trung bình mỗi room</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(stats.totalUsers / stats.totalRooms)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { useAppStore } from '../../store';
import { formatCurrency } from '../../lib/utils';
import { ShoppingBag, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { orders, products, categories } = useAppStore();

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending order').length;
  
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-2 text-gold-500">{formatCurrency(totalRevenue)}</h3>
            </div>
            <div className="w-12 h-12 bg-gold-50 dark:bg-gold-500/10 rounded-full flex items-center justify-center text-gold-600 dark:text-gold-500">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold mt-2">{totalOrders}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-500">
              <ShoppingBag size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <h3 className="text-2xl font-bold mt-2">{pendingOrders}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-500">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold mt-2">{products.length}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-500">
              <Users size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-medium">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-luxury-gray">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-luxury-gray/50">
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${!order.isViewed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                        <span>{order.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{order.customerInfo.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'Pending order' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                        order.status === 'Confirmed order' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

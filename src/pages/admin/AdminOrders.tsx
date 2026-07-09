import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { formatCurrency } from '../../lib/utils';
import { Eye, ChevronDown, Search } from 'lucide-react';

export default function AdminOrders() {
  const { orders, products, updateOrderStatus, updateOrderPaymentStatus, markOrderAsViewed, updateAllPendingToConfirmed, markAllOrdersAsViewed } = useAppStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const statuses = ['Pending order', 'Confirmed order'] as const;
  const paymentStatuses = ['Pending', 'Pending Verification', 'Verified', 'Rejected'] as const;

  const filteredOrders = orders.filter(o => {
    const matchesTab = activeTab === 'All' || o.status === activeTab;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      o.id.toLowerCase().includes(searchLower) ||
      o.customerInfo.fullName.toLowerCase().includes(searchLower) ||
      o.customerInfo.mobileNumber.toLowerCase().includes(searchLower);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track customer orders.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <button onClick={markAllOrdersAsViewed} className="px-3 py-2 text-xs font-medium border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors whitespace-nowrap">Mark All Viewed</button>
            <button onClick={updateAllPendingToConfirmed} className="px-3 py-2 text-xs font-medium bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-black transition-colors whitespace-nowrap">Confirm All Pending</button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID, Name or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 w-full md:w-72 transition-colors"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-800 hide-scrollbar space-x-6">
        <button
          onClick={() => setActiveTab('All')}
          className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'All' ? 'border-b-2 border-black dark:border-white text-black dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
        >
          All Orders
        </button>
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === status ? 'border-b-2 border-black dark:border-white text-black dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-luxury-gray">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Order Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr 
                    onClick={() => {
                      setSelectedOrder(selectedOrder === order.id ? null : order.id);
                      if (!order.isViewed) markOrderAsViewed(order.id);
                    }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-luxury-gray/50 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${!order.isViewed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                        <span>{order.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.customerInfo.fullName}</p>
                      <p className="text-xs text-gray-500">{order.customerInfo.mobileNumber}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.paymentInfo.method}</p>
                      <div className="mt-1">
                        <select 
                          value={order.paymentInfo.status || 'Pending'}
                          onChange={(e) => updateOrderPaymentStatus(order.id, e.target.value as any)}
                          className="text-xs font-medium border border-gray-200 dark:border-gray-700 bg-transparent px-2 py-1 rounded focus:outline-none"
                        >
                          {paymentStatuses.map(s => <option key={s} value={s} className="dark:bg-black">{s}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gold-600 dark:text-gold-400">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="text-xs font-medium border border-gray-200 dark:border-gray-700 bg-transparent px-2 py-1 rounded focus:outline-none"
                      >
                        {statuses.map(s => <option key={s} value={s} className="dark:bg-black">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(selectedOrder === order.id ? null : order.id);
                          if (!order.isViewed) markOrderAsViewed(order.id);
                        }}
                        className="text-gray-500 hover:text-gold-500"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                  {selectedOrder === order.id && (
                    <tr className="bg-gray-50 dark:bg-luxury-gray/30">
                      <td colSpan={7} className="px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Order Items</h4>
                            <div className="space-y-3">
                              {order.items.map((item, idx) => {
                                const product = products.find(p => p.id === item.productId);
                                return (
                                <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-200 dark:border-gray-800 pb-2 last:border-0">
                                  <div className="flex items-center space-x-3">
                                    {product?.images?.[0] && (
                                      <img src={product.images[0]} alt={item.productName} className="w-10 h-10 object-cover rounded" />
                                    )}
                                    <div>
                                      <p className="font-medium">{item.productName}</p>
                                      <p className="text-xs text-gray-500">Qty: {item.quantity} {item.size && `| Size: ${item.size}`} {item.color && `| Color: ${item.color}`}</p>
                                    </div>
                                  </div>
                                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                                );
                              })}
                              <div className="flex justify-between items-center pt-2 font-bold text-gold-600 dark:text-gold-400">
                                <span>Total Amount:</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Customer & Shipping</h4>
                            <div className="text-sm space-y-2">
                              <div>
                                <span className="text-gray-500 text-xs block">Name:</span>
                                <span className="font-medium">{order.customerInfo.fullName}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block">Mobile:</span>
                                <span className="font-medium">{order.customerInfo.mobileNumber}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block">Address:</span>
                                <span className="whitespace-pre-line text-gray-800 dark:text-gray-300">{order.customerInfo.fullAddress}</span>
                              </div>
                              {order.customerInfo.notes && (
                                <div>
                                  <span className="text-gray-500 text-xs block">Order Notes:</span>
                                  <span className="italic">{order.customerInfo.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Payment Details</h4>
                            <div className="text-sm space-y-2 bg-white dark:bg-black p-4 rounded border border-gray-200 dark:border-gray-800">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Method:</span>
                                <span className="font-bold">{order.paymentInfo.method}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Status:</span>
                                <span className="font-medium">{order.paymentInfo.status || 'Pending'}</span>
                              </div>
                              {order.paymentInfo.senderNumber && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Sender Number:</span>
                                  <span className="font-mono text-xs mt-0.5">{order.paymentInfo.senderNumber}</span>
                                </div>
                              )}
                              {order.paymentInfo.transactionId && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Transaction ID:</span>
                                  <span className="font-mono text-xs mt-0.5 uppercase tracking-widest">{order.paymentInfo.transactionId}</span>
                                </div>
                              )}
                            </div>
                            
                            {order.status !== 'Confirmed order' && (
                              <div className="mt-6 flex justify-end">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateOrderStatus(order.id, 'Confirmed order');
                                  }}
                                  className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-black transition-colors"
                                >
                                  Confirm Order
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

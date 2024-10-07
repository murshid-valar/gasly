"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for the dashboard
const mockData = {
  cylinderStatus: [
    { name: 'Full', value: 120 },
    { name: 'Empty', value: 80 },
    { name: 'Refilling', value: 40 },
  ],
  customerCylinders: [
    { id: 1, customer: "ABC Corp", purchaseDate: "2023-03-01", type: "Type A", capacity: 50 },
    { id: 2, customer: "XYZ Ltd", purchaseDate: "2023-03-05", type: "Type B", capacity: 30 },
    { id: 3, customer: "123 Industries", purchaseDate: "2023-03-10", type: "Type A", capacity: 50 },
  ],
  deliveryStatus: {
    outForDelivery: 15,
    needPickup: 8,
  },
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status, router]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatusCard title="Cylinder Status" data={mockData.cylinderStatus} />
        <DeliveryStatusCard data={mockData.deliveryStatus} />
        <CustomerCylindersCard data={mockData.customerCylinders} />
      </div>
      <CylinderStatusChart data={mockData.cylinderStatus} />
    </div>
  );
}

function StatusCard({ title, data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {data.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center mb-2"
            >
              <span>{item.name}</span>
              <span className="font-bold">{item.value}</span>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function DeliveryStatusCard({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Status</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-2"
        >
          <span>Out for Delivery</span>
          <span className="font-bold">{data.outForDelivery}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-center"
        >
          <span>Need Pickup</span>
          <span className="font-bold">{data.needPickup}</span>
        </motion.div>
      </CardContent>
    </Card>
  );
}

function CustomerCylindersCard({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Cylinders</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {data.map((cylinder, index) => (
            <motion.li
              key={cylinder.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-sm"
            >
              <span className="font-semibold">{cylinder.customer}</span>
              <br />
              <span className="text-gray-600">
                {cylinder.type} - {cylinder.capacity}L, Purchased: {cylinder.purchaseDate}
              </span>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function CylinderStatusChart({ data }) {
  return (
    <Card className="w-full h-96">
      <CardHeader>
        <CardTitle>Cylinder Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="w-48 h-8 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="w-32 h-6" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="w-full h-96">
        <CardHeader>
          <Skeleton className="w-48 h-6" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-full" />
        </CardContent>
      </Card>
    </div>
  );
}
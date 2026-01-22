'use client';

import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/app/actions/orders";
import { useState, useTransition } from "react";

const statusColors = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    PAID: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    SHIPPED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
};

interface Props {
    orderId: string;
    currentStatus: OrderStatus;
}

export function OrderStatusSelector({ orderId, currentStatus }: Props) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState(currentStatus);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as OrderStatus;
        setStatus(newStatus);

        startTransition(async () => {
            await updateOrderStatus(orderId, newStatus);
        });
    };

    return (
        <select
            value={status}
            onChange={handleChange}
            disabled={isPending}
            className={`text-xs font-semibold px-2 py-1 rounded-full border bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[color:var(--bg-secondary)] ${statusColors[status]}`}
        >
            <option value="PENDING" className="bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)]">Pendiente</option>
            <option value="PAID" className="bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)]">Pagado</option>
            <option value="SHIPPED" className="bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)]">Enviado</option>
            <option value="DELIVERED" className="bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)]">Entregado</option>
            <option value="CANCELLED" className="bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)]">Cancelado</option>
        </select>
    );
}

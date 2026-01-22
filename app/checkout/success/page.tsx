import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
    searchParams: {
        orderId?: string;
    };
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
    const { orderId } = await searchParams;

    if (!orderId) {
        notFound();
    }

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            user: true
        }
    });

    if (!order) {
        notFound();
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Success Icon */}
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-in zoom-in duration-500">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">¡Pedido Confirmado!</h1>
                    <p className="text-[hsl(var(--text-secondary))] text-lg">
                        Gracias por tu compra, {order.user.name}
                    </p>
                </div>

                {/* Order Details */}
                <div className="glass-card p-8">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-[hsl(var(--border-color))]">
                        <div>
                            <p className="text-sm text-[hsl(var(--text-secondary))]">Número de Orden</p>
                            <p className="font-mono font-bold text-lg">{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-[hsl(var(--text-secondary))]">Total Pagado</p>
                            <p className="text-2xl font-bold gradient-text">${Number(order.total).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-[hsl(var(--accent-primary))]" />
                            <h3 className="font-bold">Productos</h3>
                        </div>
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 rounded-lg bg-[hsl(var(--bg-primary))]">
                                <div className="w-16 h-16 rounded-lg bg-[hsl(var(--bg-tertiary))] overflow-hidden flex-shrink-0">
                                    {item.product.imageUrl && (
                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-[hsl(var(--text-secondary))]">
                                        Cantidad: {item.quantity} × ${Number(item.price).toFixed(2)}
                                    </p>
                                </div>
                                <p className="font-bold">
                                    ${(Number(item.price) * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm text-blue-300">
                            📧 Hemos enviado la confirmación a <strong>{order.user.email}</strong>
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/products" className="btn btn-primary flex-1 justify-center group">
                        Seguir Comprando
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/" className="btn btn-outline flex-1 justify-center">
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}

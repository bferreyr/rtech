{
    orders.map((order: any) => {
        const isExpanded = expandedOrders.has(order.id);
        const toggleExpand = () => {
            const newExpanded = new Set(expandedOrders);
            if (isExpanded) {
                newExpanded.delete(order.id);
            } else {
                newExpanded.add(order.id);
            }
            setExpandedOrders(newExpanded);
        };

        return (
            <div key={order.id} className="glass-card border-white/10 overflow-hidden group hover:border-[hsl(var(--accent-primary))]/30 transition-all">
                {/* Compact Header - Always Visible */}
                <div
                    className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={toggleExpand}
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">
                                    Pedido #{order.id.slice(-8).toUpperCase()}
                                </p>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.status === 'PAID' ? 'bg-green-500/10 text-green-400' :
                                        order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-400' :
                                            order.status === 'DELIVERED' ? 'bg-purple-500/10 text-purple-400' :
                                                'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[hsl(var(--text-secondary))]">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package size={14} />
                                    <span>{(order as any).items.length} {(order as any).items.length === 1 ? 'producto' : 'productos'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs text-[hsl(var(--text-tertiary))] mb-1">Total</p>
                                <p className="text-lg font-black gradient-text">USD {Number(order.total).toFixed(2)}</p>
                            </div>
                            <ChevronDown
                                className={`w-5 h-5 text-[hsl(var(--text-secondary))] transition-transform ${isExpanded ? 'rotate-180' : ''
                                    }`}
                            />
                        </div>
                    </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <div className="px-6 pb-6 space-y-6 border-t border-white/5">
                        {/* Order Items */}
                        <div className="space-y-4 pt-6">
                            <h4 className="font-bold text-sm text-[hsl(var(--text-secondary))]">Productos</h4>
                            {(order as any).items.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                                        {item.product.imageUrl && (
                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                                        <p className="text-xs text-[hsl(var(--text-tertiary))]">Cant: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold">USD {Number(item.price).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        {/* Order Timeline */}
                        <OrderTimeline
                            currentStatus={order.status as OrderStatus}
                            trackingUrl={order.trackingUrl}
                        />

                        {/* Tracking Link */}
                        {order.trackingUrl && (
                            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <Truck className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-blue-400 mb-2">Seguimiento de Envío</h4>
                                        <p className="text-sm text-[hsl(var(--text-secondary))] mb-3">
                                            Seguí tu envío al detalle desde este link
                                        </p>
                                        <a
                                            href={order.trackingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                                        >
                                            <Truck className="w-4 h-4" />
                                            Ver seguimiento en Correo Argentino
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Shipping Info */}
                        {order.shipment && (
                            <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <MapPin size={48} />
                                </div>
                                <h4 className="font-bold flex items-center gap-2">
                                    <Package size={16} className="text-[hsl(var(--accent-primary))]" />
                                    Seguimiento de Envío
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Número de Guía</p>
                                        <p className="text-sm font-mono text-[hsl(var(--accent-primary))]">{order.shipment.trackingNumber || 'Pendiente de asignación'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Empresa</p>
                                        <p className="text-sm">{order.shipment.carrier}</p>
                                    </div>
                                </div>
                                {order.shipment.trackingNumber && (
                                    <a
                                        href={`https://www.correoargentino.com.ar/formularios/e-commerce?id=${order.shipment.trackingNumber}`}
                                        target="_blank"
                                        className="btn btn-secondary w-full py-3 text-xs uppercase tracking-widest font-bold"
                                    >
                                        Ver en Correo Argentino
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    })
}

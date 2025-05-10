<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'products' => 'required|array',
            'total_price' => 'required|numeric',
            // Add other validation rules
        ]);

        $order = Order::create([
            'user_id' => $request->user_id,
            // Add other order fields
            'payment_status' => 'pending',
            'delivery_status' => 'processing'
        ]);

        return response()->json($order, 201);
    }

    public function getOrders($user_id)
    {
        $orders = Order::where('user_id', $user_id)->get();
        return response()->json($orders);
    }

    public function cancelOrder($order_id)
    {
        $order = Order::findOrFail($order_id);
        $order->update(['delivery_status' => 'cancelled']);
        return response()->json($order);
    }
}
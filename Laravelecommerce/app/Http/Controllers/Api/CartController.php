<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function addToCart(Request $request, $product_id)
    {
        $request->validate([
            'user_id' => 'required|string',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::findOrFail($product_id);

        $cartItem = Cart::create([
            'user_id' => $request->user_id,
            'product_id' => (string)$product_id,
            'quantity' => (string)$request->quantity,
            'product_title' => $product->title,
            'price' => $product->price,
            'image' => $product->image,
            // Nullable fields
            'name' => null,
            'email' => null,
            'phone' => null,
            'address' => null,
        ]);

        return response()->json($cartItem, 201);
    }

    // Keep other methods the same
    public function getCart($user_id)
{
    $items = Cart::where('user_id', $user_id)->get();
    $total = $items->sum(function($item) {
        return (float)$item->price * (int)$item->quantity;
    });
    
    return response()->json([
        'items' => $items,
        'total' => $total
    ]);
}

    public function removeFromCart($cart_id)
    {
        Cart::destroy($cart_id);
        return response()->json(null, 204);
    }

    public function clearCart($user_id)
    {
        Cart::where('user_id', $user_id)->delete();
        return response()->json(null, 204);
    }
}